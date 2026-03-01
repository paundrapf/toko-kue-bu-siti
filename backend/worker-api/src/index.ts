interface Env {
  APP_ENV: string;
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ORDER_STATUSES = ["Pending", "Confirmed", "Baking", "Ready", "Delivered", "Cancelled"] as const;
const PAYMENT_STATUSES = ["Unpaid", "Paid", "Refunded"] as const;
const ORDER_TYPES = ["Delivery", "Pickup"] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];
type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
type OrderType = (typeof ORDER_TYPES)[number];

interface ApiOrderItem {
  id: string;
  productId: string;
  productName: string;
  variantName: string;
  variantSize: string;
  quantity: number;
  pricePerItem: number;
  subtotal: number;
  image: string;
}

interface ApiOrder {
  id: string;
  orderNumber: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    deliveryNotes: string;
  };
  items: ApiOrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  orderType: OrderType;
  deliveryDate: string;
  deliveryTime: string;
  paymentMethod: string;
  paymentProof?: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    changedAt: string;
    notes?: string;
  }>;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
}

interface StoredOrderRow {
  id: string;
  order_number: string;
  customer_full_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_postal_code: string | null;
  customer_delivery_notes: string | null;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  order_type: OrderType;
  delivery_date: string;
  delivery_time: string;
  payment_method: string;
  payment_status: PaymentStatus;
  status: OrderStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  payment_proof_url: string | null;
}

interface StoredOrderItemRow {
  id: string;
  product_id: string | null;
  product_name: string;
  variant_name: string;
  variant_size: string;
  quantity: number;
  price_per_item: number;
  subtotal: number;
  image_url: string | null;
}

interface StoredStatusHistoryRow {
  status: OrderStatus;
  changed_at: string;
  notes: string | null;
}

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders
    }
  });

const notFound = (path: string): Response =>
  json(
    {
      success: false,
      error: "Route not found",
      path
    },
    404
  );

const withCors = (response: Response): Response => {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

const getFileExtension = (mimeType: string): string => {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
};

const isFile = (value: File | string | null): value is File => value instanceof File;

const toOrderStatus = (value: unknown): OrderStatus =>
  ORDER_STATUSES.includes(value as OrderStatus) ? (value as OrderStatus) : "Pending";

const toPaymentStatus = (value: unknown): PaymentStatus =>
  PAYMENT_STATUSES.includes(value as PaymentStatus) ? (value as PaymentStatus) : "Unpaid";

const toOrderType = (value: unknown): OrderType =>
  ORDER_TYPES.includes(value as OrderType) ? (value as OrderType) : "Delivery";

const generateOrderNumber = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 900) + 100;
  return `TK-${dateStr}-${random}`;
};

const toNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeOrderInput = (raw: unknown): ApiOrder => {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid order payload");
  }

  const now = new Date().toISOString();
  const source = raw as Record<string, unknown>;
  const customer = (source.customer ?? {}) as Record<string, unknown>;
  const items = Array.isArray(source.items) ? source.items : [];

  const normalizedItems: ApiOrderItem[] = items.map((item, index) => {
    const sourceItem = (item ?? {}) as Record<string, unknown>;
    const quantity = Math.max(1, toNumber(sourceItem.quantity, 1));
    const pricePerItem = Math.max(0, toNumber(sourceItem.pricePerItem, 0));
    return {
      id:
        typeof sourceItem.id === "string" && sourceItem.id.trim()
          ? sourceItem.id.trim()
          : `item-${Date.now()}-${index}-${crypto.randomUUID()}`,
      productId: typeof sourceItem.productId === "string" ? sourceItem.productId : "",
      productName: typeof sourceItem.productName === "string" ? sourceItem.productName : "Produk",
      variantName: typeof sourceItem.variantName === "string" ? sourceItem.variantName : "Default",
      variantSize: typeof sourceItem.variantSize === "string" ? sourceItem.variantSize : "-",
      quantity,
      pricePerItem,
      subtotal: Math.max(0, toNumber(sourceItem.subtotal, pricePerItem * quantity)),
      image: typeof sourceItem.image === "string" ? sourceItem.image : ""
    };
  });

  if (normalizedItems.length === 0) {
    throw new Error("Order items are required");
  }

  const customerEmail = typeof customer.email === "string" ? customer.email.trim().toLowerCase() : "";
  if (!customerEmail) {
    throw new Error("Customer email is required");
  }

  const customerName = typeof customer.fullName === "string" ? customer.fullName.trim() : "";
  const customerPhone = typeof customer.phone === "string" ? customer.phone.trim() : "";
  if (!customerName || !customerPhone) {
    throw new Error("Customer name and phone are required");
  }

  const status = toOrderStatus(source.status);
  const statusHistorySource = Array.isArray(source.statusHistory)
    ? (source.statusHistory as Array<Record<string, unknown>>)
    : [];

  const statusHistory =
    statusHistorySource.length > 0
      ? statusHistorySource.map((entry) => ({
          status: toOrderStatus(entry.status),
          changedAt: typeof entry.changedAt === "string" ? entry.changedAt : now,
          notes: typeof entry.notes === "string" ? entry.notes : undefined
        }))
      : [{ status, changedAt: now, notes: "Order created" }];

  const subtotal = Math.max(0, toNumber(source.subtotal, 0));
  const shipping = Math.max(0, toNumber(source.shipping, 0));
  const discount = Math.max(0, toNumber(source.discount, 0));

  return {
    id:
      typeof source.id === "string" && source.id.trim()
        ? source.id.trim()
        : `order-${crypto.randomUUID()}`,
    orderNumber:
      typeof source.orderNumber === "string" && source.orderNumber.trim()
        ? source.orderNumber.trim().toUpperCase()
        : generateOrderNumber(),
    customer: {
      fullName: customerName,
      email: customerEmail,
      phone: customerPhone,
      address: typeof customer.address === "string" ? customer.address : "",
      city: typeof customer.city === "string" ? customer.city : "",
      postalCode: typeof customer.postalCode === "string" ? customer.postalCode : "",
      deliveryNotes: typeof customer.deliveryNotes === "string" ? customer.deliveryNotes : ""
    },
    items: normalizedItems,
    subtotal,
    shipping,
    discount,
    total: Math.max(0, toNumber(source.total, subtotal + shipping - discount)),
    orderType: toOrderType(source.orderType),
    deliveryDate: typeof source.deliveryDate === "string" ? source.deliveryDate : now.slice(0, 10),
    deliveryTime: typeof source.deliveryTime === "string" ? source.deliveryTime : "",
    paymentMethod: typeof source.paymentMethod === "string" ? source.paymentMethod : "Bank Transfer",
    paymentProof: typeof source.paymentProof === "string" ? source.paymentProof : undefined,
    paymentStatus: toPaymentStatus(source.paymentStatus),
    status,
    statusHistory,
    adminNotes: typeof source.adminNotes === "string" ? source.adminNotes : "",
    createdAt: typeof source.createdAt === "string" ? source.createdAt : now,
    updatedAt: now
  };
};

const mapStoredOrder = (
  row: StoredOrderRow,
  items: StoredOrderItemRow[],
  history: StoredStatusHistoryRow[]
): ApiOrder => ({
  id: row.id,
  orderNumber: row.order_number,
  customer: {
    fullName: row.customer_full_name,
    email: row.customer_email,
    phone: row.customer_phone,
    address: row.customer_address,
    city: row.customer_city,
    postalCode: row.customer_postal_code ?? "",
    deliveryNotes: row.customer_delivery_notes ?? ""
  },
  items: items.map((item) => ({
    id: item.id,
    productId: item.product_id ?? "",
    productName: item.product_name,
    variantName: item.variant_name,
    variantSize: item.variant_size,
    quantity: toNumber(item.quantity, 0),
    pricePerItem: toNumber(item.price_per_item, 0),
    subtotal: toNumber(item.subtotal, 0),
    image: item.image_url ?? ""
  })),
  subtotal: toNumber(row.subtotal, 0),
  shipping: toNumber(row.shipping, 0),
  discount: toNumber(row.discount, 0),
  total: toNumber(row.total, 0),
  orderType: row.order_type,
  deliveryDate: row.delivery_date,
  deliveryTime: row.delivery_time,
  paymentMethod: row.payment_method,
  paymentProof: row.payment_proof_url ?? undefined,
  paymentStatus: row.payment_status,
  status: row.status,
  statusHistory: history.map((entry) => ({
    status: entry.status,
    changedAt: entry.changed_at,
    notes: entry.notes ?? undefined
  })),
  adminNotes: row.admin_notes ?? "",
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

async function uploadFileToR2(
  bucket: R2Bucket,
  file: File,
  keyPrefix: string,
  alt: string
): Promise<{ key: string; viewUrl: string; contentType: string; size: number; alt: string }> {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    throw new Error("Unsupported file type");
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error("File too large");
  }

  const ext = getFileExtension(file.type);
  const key = `${keyPrefix}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const body = await file.arrayBuffer();

  await bucket.put(key, body, {
    httpMetadata: {
      contentType: file.type
    }
  });

  return {
    key,
    alt,
    contentType: file.type,
    size: file.size,
    viewUrl: `/api/media/${encodeURIComponent(key)}`
  };
}

async function handleMediaUpload(request: Request, env: Env): Promise<Response> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return json(
      {
        success: false,
        error: "Invalid content type",
        message: "Use multipart/form-data with field name 'file'."
      },
      400
    );
  }

  const formData = await request.formData();
  const fileEntry = formData.get("file");
  const altEntry = formData.get("alt");

  if (!isFile(fileEntry)) {
    return json(
      {
        success: false,
        error: "Invalid file",
        message: "Field 'file' is required and must be an uploaded file."
      },
      400
    );
  }

  try {
    const uploaded = await uploadFileToR2(
      env.MEDIA_BUCKET,
      fileEntry,
      "uploads",
      typeof altEntry === "string" ? altEntry : ""
    );

    return json({
      success: true,
      data: uploaded,
      message: "Media uploaded to R2 bucket."
    });
  } catch (error) {
    return json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed"
      },
      400
    );
  }
}

async function handleMediaRead(pathname: string, env: Env): Promise<Response> {
  const encodedKey = pathname.replace("/api/media/", "");
  if (!encodedKey) {
    return json({ success: false, error: "Media key is required" }, 400);
  }

  const key = decodeURIComponent(encodedKey);
  const object = await env.MEDIA_BUCKET.get(key);
  if (!object || !object.body) {
    return json({ success: false, error: "Media not found" }, 404);
  }

  return withCors(
    new Response(object.body, {
      status: 200,
      headers: {
        "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
        ETag: object.httpEtag
      }
    })
  );
}

async function handleCreateOrder(request: Request, env: Env): Promise<Response> {
  const payload = (await request.json()) as { order?: unknown };
  const order = normalizeOrderInput(payload.order);

  await env.DB.prepare(
    `INSERT INTO orders (
      id,
      order_number,
      customer_full_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_postal_code,
      customer_delivery_notes,
      subtotal,
      shipping,
      discount,
      total,
      order_type,
      delivery_date,
      delivery_time,
      payment_method,
      payment_status,
      status,
      admin_notes,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      order.id,
      order.orderNumber,
      order.customer.fullName,
      order.customer.email,
      order.customer.phone,
      order.customer.address,
      order.customer.city,
      order.customer.postalCode,
      order.customer.deliveryNotes,
      order.subtotal,
      order.shipping,
      order.discount,
      order.total,
      order.orderType,
      order.deliveryDate,
      order.deliveryTime,
      order.paymentMethod,
      order.paymentStatus,
      order.status,
      order.adminNotes,
      order.createdAt,
      order.updatedAt
    )
    .run();

  for (const item of order.items) {
    await env.DB.prepare(
      `INSERT INTO order_items (
        id,
        order_id,
        product_id,
        product_name,
        variant_name,
        variant_size,
        quantity,
        price_per_item,
        subtotal,
        image_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        item.id,
        order.id,
        item.productId,
        item.productName,
        item.variantName,
        item.variantSize,
        item.quantity,
        item.pricePerItem,
        item.subtotal,
        item.image
      )
      .run();
  }

  for (const statusEntry of order.statusHistory) {
    await env.DB.prepare(
      `INSERT INTO order_status_history (
        id,
        order_id,
        status,
        notes,
        changed_at
      ) VALUES (?, ?, ?, ?, ?)`
    )
      .bind(
        `status-${crypto.randomUUID()}`,
        order.id,
        statusEntry.status,
        statusEntry.notes ?? null,
        statusEntry.changedAt
      )
      .run();
  }

  return json({
    success: true,
    data: order,
    message: "Order created"
  });
}

async function handleTrackOrder(url: URL, env: Env): Promise<Response> {
  const orderNumber = (url.searchParams.get("orderNumber") ?? "").trim().toUpperCase();
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();

  if (!orderNumber || !email) {
    return json(
      {
        success: false,
        error: "orderNumber and email are required"
      },
      400
    );
  }

  const orderRow = await env.DB.prepare(
    `SELECT
      o.*,
      m.url AS payment_proof_url
    FROM orders o
    LEFT JOIN media_files m ON m.id = o.payment_proof_media_id
    WHERE o.order_number = ?
      AND lower(o.customer_email) = lower(?)
    LIMIT 1`
  )
    .bind(orderNumber, email)
    .first<StoredOrderRow>();

  if (!orderRow) {
    return json({ success: false, error: "Order not found" }, 404);
  }

  const itemResult = await env.DB.prepare(
    `SELECT
      id,
      product_id,
      product_name,
      variant_name,
      variant_size,
      quantity,
      price_per_item,
      subtotal,
      image_url
    FROM order_items
    WHERE order_id = ?
    ORDER BY rowid ASC`
  )
    .bind(orderRow.id)
    .all<StoredOrderItemRow>();

  const statusHistoryResult = await env.DB.prepare(
    `SELECT
      status,
      changed_at,
      notes
    FROM order_status_history
    WHERE order_id = ?
    ORDER BY changed_at ASC`
  )
    .bind(orderRow.id)
    .all<StoredStatusHistoryRow>();

  const order = mapStoredOrder(
    orderRow,
    itemResult.results ?? [],
    statusHistoryResult.results ?? []
  );

  return json({ success: true, data: order });
}

async function handleListOrders(env: Env): Promise<Response> {
  const rows = await env.DB.prepare(
    `SELECT
      id,
      order_number,
      customer_full_name,
      total,
      status,
      payment_status,
      created_at
    FROM orders
    ORDER BY created_at DESC
    LIMIT 50`
  ).all();

  return json({
    success: true,
    data: rows.results ?? []
  });
}

async function handleOrderPaymentProofUpload(
  request: Request,
  env: Env,
  orderId: string
): Promise<Response> {
  const order = await env.DB.prepare("SELECT id FROM orders WHERE id = ? LIMIT 1")
    .bind(orderId)
    .first<{ id: string }>();

  if (!order) {
    return json({ success: false, error: "Order not found" }, 404);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return json(
      {
        success: false,
        error: "Invalid content type",
        message: "Use multipart/form-data with field name 'file'."
      },
      400
    );
  }

  const formData = await request.formData();
  const fileEntry = formData.get("file");
  const altEntry = formData.get("alt");

  if (!isFile(fileEntry)) {
    return json(
      {
        success: false,
        error: "Invalid file",
        message: "Field 'file' is required and must be an uploaded file."
      },
      400
    );
  }

  const uploaded = await uploadFileToR2(
    env.MEDIA_BUCKET,
    fileEntry,
    "payment-proofs",
    typeof altEntry === "string" ? altEntry : `Bukti pembayaran ${orderId}`
  );

  const mediaId = `media-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO media_files (
      id,
      r2_key,
      url,
      alt,
      size_bytes,
      mime_type,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(mediaId, uploaded.key, uploaded.viewUrl, uploaded.alt, uploaded.size, uploaded.contentType, now)
    .run();

  await env.DB.prepare(
    `UPDATE orders
      SET payment_proof_media_id = ?,
          updated_at = ?
      WHERE id = ?`
  )
    .bind(mediaId, now, orderId)
    .run();

  return json({
    success: true,
    data: uploaded,
    message: "Payment proof uploaded"
  });
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname === "/health" && request.method === "GET") {
    return json({
      success: true,
      service: "toko-kue-api",
      env: env.APP_ENV,
      timestamp: new Date().toISOString()
    });
  }

  if (pathname === "/api/products" && request.method === "GET") {
    return json({ success: true, data: [], message: "Products route placeholder" });
  }

  if (pathname === "/api/orders" && request.method === "GET") {
    return handleListOrders(env);
  }

  if (pathname === "/api/orders" && request.method === "POST") {
    return handleCreateOrder(request, env);
  }

  if (pathname === "/api/orders/track" && request.method === "GET") {
    return handleTrackOrder(url, env);
  }

  if (pathname === "/api/blog/posts" && request.method === "GET") {
    return json({ success: true, data: [], message: "Blog posts route placeholder" });
  }

  if (pathname === "/api/settings" && request.method === "GET") {
    return json({ success: true, data: {}, message: "Settings route placeholder" });
  }

  if (pathname === "/api/media/upload" && request.method === "POST") {
    return handleMediaUpload(request, env);
  }

  const paymentProofMatch = pathname.match(/^\/api\/orders\/([^/]+)\/payment-proof$/);
  if (paymentProofMatch && request.method === "POST") {
    return handleOrderPaymentProofUpload(request, env, decodeURIComponent(paymentProofMatch[1]));
  }

  if (pathname.startsWith("/api/media/") && request.method === "GET") {
    return handleMediaRead(pathname, env);
  }

  return notFound(pathname);
}

export default {
  async fetch(request, env): Promise<Response> {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return json(
        {
          success: false,
          error: "Internal Server Error",
          message
        },
        500
      );
    }
  }
} satisfies ExportedHandler<Env>;
