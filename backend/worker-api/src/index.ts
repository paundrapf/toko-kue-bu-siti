interface Env {
  APP_ENV: string;
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  APP_BASE_URL?: string;
  FONNTE_API_KEY?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  ADMIN_NOTIFICATION_PHONE?: string;
  ADMIN_NOTIFICATION_EMAIL?: string;
}

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ORDER_STATUSES = ["Pending", "Confirmed", "Baking", "Ready", "Delivered", "Cancelled"] as const;
const PAYMENT_STATUSES = ["Unpaid", "Paid", "Refunded"] as const;
const ORDER_TYPES = ["Delivery", "Pickup"] as const;
const PRODUCT_STATUSES = ["Available", "SoldOut", "PreOrder"] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];
type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
type OrderType = (typeof ORDER_TYPES)[number];
type ProductStatus = (typeof PRODUCT_STATUSES)[number];

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

const toProductStatus = (value: unknown): ProductStatus =>
  PRODUCT_STATUSES.includes(value as ProductStatus) ? (value as ProductStatus) : "Available";

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

const toOptionalNumber = (value: unknown): number | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
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

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

async function getOrFallbackCategoryId(
  env: Env,
  table: "product_categories" | "blog_categories",
  requestedId: string | null,
  fallbackName: string,
  fallbackSlug: string
): Promise<string> {
  if (requestedId) {
    const existing = await env.DB.prepare(`SELECT id FROM ${table} WHERE id = ? LIMIT 1`)
      .bind(requestedId)
      .first<{ id: string }>();
    if (existing) {
      return existing.id;
    }
  }

  const first = await env.DB.prepare(`SELECT id FROM ${table} ORDER BY created_at ASC LIMIT 1`).first<{ id: string }>();
  if (first) {
    return first.id;
  }

  const id = `${table === "product_categories" ? "cat" : "blog-cat"}-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO ${table} (
      id,
      name,
      slug,
      description,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(id, fallbackName, fallbackSlug, `Auto-created ${fallbackName}`, now, now)
    .run();

  return id;
}

async function getOrderById(env: Env, orderId: string): Promise<ApiOrder | null> {
  const orderRow = await env.DB.prepare(
    `SELECT
      o.*,
      m.url AS payment_proof_url
    FROM orders o
    LEFT JOIN media_files m ON m.id = o.payment_proof_media_id
    WHERE o.id = ?
    LIMIT 1`
  )
    .bind(orderId)
    .first<StoredOrderRow>();

  if (!orderRow) {
    return null;
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
    .bind(orderId)
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
    .bind(orderId)
    .all<StoredStatusHistoryRow>();

  return mapStoredOrder(orderRow, itemResult.results ?? [], statusHistoryResult.results ?? []);
}

const toRupiah = (value: number): string => `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;

async function sendWhatsAppNotification(env: Env, phone: string, message: string): Promise<void> {
  if (!env.FONNTE_API_KEY || !phone) {
    return;
  }

  await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: env.FONNTE_API_KEY
    },
    body: new URLSearchParams({
      target: phone,
      message
    })
  });
}

async function sendEmailNotification(
  env: Env,
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<void> {
  if (!env.RESEND_API_KEY || !to || !env.RESEND_FROM_EMAIL) {
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html,
      text
    })
  });
}

const formatOrderItemsForText = (order: ApiOrder): string =>
  order.items.map((item) => `- ${item.productName} (${item.variantName}) x${item.quantity}`).join("\n");

const trackingLink = (env: Env, order: ApiOrder): string => {
  const baseUrl = env.APP_BASE_URL || "https://tokokuebusiti.com";
  const params = new URLSearchParams({
    orderNumber: order.orderNumber,
    email: order.customer.email
  });
  return `${baseUrl}/track-order?${params.toString()}`;
};

async function sendOrderCreatedNotifications(env: Env, order: ApiOrder): Promise<void> {
  const adminPhone = env.ADMIN_NOTIFICATION_PHONE || "";
  const adminEmail = env.ADMIN_NOTIFICATION_EMAIL || "";
  const customerPhone = order.customer.phone;
  const customerEmail = order.customer.email;

  const orderItems = formatOrderItemsForText(order);
  const link = trackingLink(env, order);

  const adminMessage = [
    "PESANAN BARU",
    `Order: #${order.orderNumber}`,
    `Customer: ${order.customer.fullName}`,
    `Total: ${toRupiah(order.total)}`,
    "",
    "Items:",
    orderItems,
    "",
    `Delivery: ${order.deliveryDate} ${order.deliveryTime}`,
    `Detail: ${link}`
  ].join("\n");

  const customerMessage = [
    "PESANAN BERHASIL DIBUAT",
    `Nomor Order: #${order.orderNumber}`,
    `Total: ${toRupiah(order.total)}`,
    `Lacak pesanan: ${link}`
  ].join("\n");

  await Promise.allSettled([
    sendWhatsAppNotification(env, adminPhone, adminMessage),
    sendWhatsAppNotification(env, customerPhone, customerMessage),
    sendEmailNotification(
      env,
      adminEmail,
      `Pesanan Baru #${order.orderNumber}`,
      `<p>Pesanan baru dari <strong>${order.customer.fullName}</strong> dengan total <strong>${toRupiah(order.total)}</strong>.</p><p><a href="${link}">Lihat tracking</a></p>`,
      `Pesanan baru #${order.orderNumber} dari ${order.customer.fullName}. Total ${toRupiah(order.total)}. Link: ${link}`
    ),
    sendEmailNotification(
      env,
      customerEmail,
      `Pesanan Anda #${order.orderNumber} - Toko Kue Bu Siti`,
      `<p>Terima kasih sudah memesan di Toko Kue Bu Siti.</p><p>Nomor order: <strong>${order.orderNumber}</strong></p><p>Total: <strong>${toRupiah(order.total)}</strong></p><p><a href="${link}">Lacak pesanan</a></p>`,
      `Terima kasih sudah memesan. Nomor order ${order.orderNumber}. Total ${toRupiah(order.total)}. Link tracking: ${link}`
    )
  ]);
}

async function sendOrderStatusNotifications(env: Env, order: ApiOrder, status: OrderStatus): Promise<void> {
  const link = trackingLink(env, order);
  const message = [
    `UPDATE STATUS PESANAN #${order.orderNumber}`,
    `Status terbaru: ${status}`,
    `Lacak pesanan: ${link}`
  ].join("\n");

  await Promise.allSettled([
    sendWhatsAppNotification(env, order.customer.phone, message),
    sendEmailNotification(
      env,
      order.customer.email,
      `Update status pesanan #${order.orderNumber}`,
      `<p>Status pesanan Anda berubah menjadi <strong>${status}</strong>.</p><p><a href="${link}">Lacak pesanan</a></p>`,
      `Status pesanan ${order.orderNumber} berubah menjadi ${status}. Link tracking: ${link}`
    )
  ]);
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

  await sendOrderCreatedNotifications(env, order);

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

async function handleUpdateOrderStatus(
  request: Request,
  env: Env,
  orderId: string
): Promise<Response> {
  const payload = (await request.json()) as { status?: unknown; notes?: unknown };
  const status = toOrderStatus(payload.status);
  const notes = typeof payload.notes === "string" ? payload.notes : null;
  const now = new Date().toISOString();

  const existingOrder = await getOrderById(env, orderId);
  if (!existingOrder) {
    return json({ success: false, error: "Order not found" }, 404);
  }

  await env.DB.prepare(
    `UPDATE orders
      SET status = ?,
          payment_status = CASE WHEN ? = 'Confirmed' THEN 'Paid' ELSE payment_status END,
          updated_at = ?,
          confirmed_at = CASE WHEN ? = 'Confirmed' THEN COALESCE(confirmed_at, ?) ELSE confirmed_at END,
          completed_at = CASE WHEN ? = 'Delivered' THEN COALESCE(completed_at, ?) ELSE completed_at END,
          cancelled_at = CASE WHEN ? = 'Cancelled' THEN COALESCE(cancelled_at, ?) ELSE cancelled_at END
      WHERE id = ?`
  )
    .bind(
      status,
      status,
      now,
      status,
      now,
      status,
      now,
      status,
      now,
      orderId
    )
    .run();

  await env.DB.prepare(
    `INSERT INTO order_status_history (
      id,
      order_id,
      status,
      notes,
      changed_at
    ) VALUES (?, ?, ?, ?, ?)`
  )
    .bind(`status-${crypto.randomUUID()}`, orderId, status, notes, now)
    .run();

  const updatedOrder = await getOrderById(env, orderId);
  if (!updatedOrder) {
    return json({ success: false, error: "Failed to reload updated order" }, 500);
  }

  await sendOrderStatusNotifications(env, updatedOrder, status);

  return json({
    success: true,
    data: updatedOrder,
    message: "Order status updated"
  });
}

async function handleListProducts(env: Env): Promise<Response> {
  const productRows = await env.DB.prepare(
    `SELECT
      p.id,
      p.name,
      p.slug,
      p.description,
      p.short_description,
      p.category_id,
      c.name AS category_name,
      p.status,
      p.featured,
      p.total_sold,
      p.meta_title,
      p.meta_description
    FROM products p
    LEFT JOIN product_categories c ON c.id = p.category_id
    ORDER BY p.created_at DESC`
  ).all<{
    id: string;
    name: string;
    slug: string;
    description: string;
    short_description: string;
    category_id: string;
    category_name: string | null;
    status: string;
    featured: number;
    total_sold: number;
    meta_title: string | null;
    meta_description: string | null;
  }>();

  const products = await Promise.all(
    (productRows.results ?? []).map(async (row) => {
      const variants = await env.DB.prepare(
        `SELECT id, name, size, price, stock
         FROM product_variants
         WHERE product_id = ?
         ORDER BY rowid ASC`
      )
        .bind(row.id)
        .all<{ id: string; name: string; size: string; price: number; stock: number }>();

      const images = await env.DB.prepare(
        `SELECT image_url
         FROM product_images
         WHERE product_id = ?
         ORDER BY sort_order ASC, rowid ASC`
      )
        .bind(row.id)
        .all<{ image_url: string }>();

      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        shortDescription: row.short_description,
        images: (images.results ?? []).map((image) => image.image_url),
        category: row.category_id,
        categoryName: row.category_name ?? "Tanpa Kategori",
        variants: variants.results ?? [],
        status: toProductStatus(row.status),
        featured: row.featured === 1,
        totalSold: toNumber(row.total_sold, 0),
        metaTitle: row.meta_title ?? undefined,
        metaDescription: row.meta_description ?? undefined
      };
    })
  );

  return json({ success: true, data: products });
}

async function handleCreateProduct(request: Request, env: Env): Promise<Response> {
  const payload = (await request.json()) as { product?: Record<string, unknown> };
  const source = payload.product ?? {};
  const now = new Date().toISOString();

  const name = typeof source.name === "string" && source.name.trim() ? source.name.trim() : "Produk Baru";
  const slug =
    typeof source.slug === "string" && source.slug.trim() ? source.slug.trim() : slugify(name);
  const categoryId = await getOrFallbackCategoryId(
    env,
    "product_categories",
    typeof source.category === "string" ? source.category : null,
    "Umum",
    "umum"
  );
  const productId =
    typeof source.id === "string" && source.id.trim() ? source.id.trim() : `product-${crypto.randomUUID()}`;
  const status = toProductStatus(source.status);

  await env.DB.prepare(
    `INSERT INTO products (
      id,
      name,
      slug,
      description,
      short_description,
      category_id,
      status,
      featured,
      total_sold,
      meta_title,
      meta_description,
      created_at,
      updated_at,
      published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      productId,
      name,
      slug,
      typeof source.description === "string" ? source.description : name,
      typeof source.shortDescription === "string" ? source.shortDescription : name,
      categoryId,
      status,
      source.featured ? 1 : 0,
      toNumber(source.totalSold, 0),
      typeof source.metaTitle === "string" ? source.metaTitle : null,
      typeof source.metaDescription === "string" ? source.metaDescription : null,
      now,
      now,
      now
    )
    .run();

  const variantsSource = Array.isArray(source.variants)
    ? (source.variants as Array<Record<string, unknown>>)
    : [];

  const variantsToInsert =
    variantsSource.length > 0
      ? variantsSource
      : [
          {
            id: `variant-${crypto.randomUUID()}`,
            name: "Original",
            size: "Medium",
            price: 100000,
            stock: 10
          }
        ];

  for (const variant of variantsToInsert) {
    await env.DB.prepare(
      `INSERT INTO product_variants (
        id,
        product_id,
        name,
        size,
        price,
        stock,
        sku,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        typeof variant.id === "string" && variant.id.trim() ? variant.id : `variant-${crypto.randomUUID()}`,
        productId,
        typeof variant.name === "string" ? variant.name : "Original",
        typeof variant.size === "string" && ["Small", "Medium", "Large"].includes(variant.size)
          ? variant.size
          : "Medium",
        toNumber(variant.price, 0),
        toNumber(variant.stock, 0),
        typeof variant.sku === "string" ? variant.sku : null,
        now,
        now
      )
      .run();
  }

  const imagesSource = Array.isArray(source.images) ? (source.images as string[]) : [];
  const imageValues = imagesSource.length > 0 ? imagesSource : ["/images/products/brownies-cokelat-1.jpg"];

  for (const [index, imageUrl] of imageValues.entries()) {
    await env.DB.prepare(
      `INSERT INTO product_images (id, product_id, image_url, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(`pimg-${crypto.randomUUID()}`, productId, imageUrl, index, now)
      .run();
  }

  return json({ success: true, data: { id: productId }, message: "Product created" }, 201);
}

async function handleUpdateProduct(request: Request, env: Env, productId: string): Promise<Response> {
  const existing = await env.DB.prepare("SELECT id FROM products WHERE id = ? LIMIT 1")
    .bind(productId)
    .first<{ id: string }>();
  if (!existing) {
    return json({ success: false, error: "Product not found" }, 404);
  }

  const payload = (await request.json()) as { product?: Record<string, unknown> };
  const source = payload.product ?? {};
  const now = new Date().toISOString();
  const nextStatus = typeof source.status !== "undefined" ? toProductStatus(source.status) : null;

  const categoryId = await getOrFallbackCategoryId(
    env,
    "product_categories",
    typeof source.category === "string" ? source.category : null,
    "Umum",
    "umum"
  );

  await env.DB.prepare(
    `UPDATE products
      SET name = COALESCE(?, name),
          slug = COALESCE(?, slug),
          description = COALESCE(?, description),
          short_description = COALESCE(?, short_description),
          category_id = ?,
          status = COALESCE(?, status),
          featured = COALESCE(?, featured),
          meta_title = ?,
          meta_description = ?,
          updated_at = ?
      WHERE id = ?`
  )
    .bind(
      typeof source.name === "string" ? source.name : null,
      typeof source.slug === "string" ? source.slug : null,
      typeof source.description === "string" ? source.description : null,
      typeof source.shortDescription === "string" ? source.shortDescription : null,
      categoryId,
      nextStatus,
      typeof source.featured === "boolean" ? (source.featured ? 1 : 0) : null,
      typeof source.metaTitle === "string" ? source.metaTitle : null,
      typeof source.metaDescription === "string" ? source.metaDescription : null,
      now,
      productId
    )
    .run();

  if (Array.isArray(source.variants)) {
    await env.DB.prepare("DELETE FROM product_variants WHERE product_id = ?").bind(productId).run();
    for (const variant of source.variants as Array<Record<string, unknown>>) {
      await env.DB.prepare(
        `INSERT INTO product_variants (
          id,
          product_id,
          name,
          size,
          price,
          stock,
          sku,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          typeof variant.id === "string" && variant.id.trim() ? variant.id : `variant-${crypto.randomUUID()}`,
          productId,
          typeof variant.name === "string" ? variant.name : "Original",
          typeof variant.size === "string" && ["Small", "Medium", "Large"].includes(variant.size)
            ? variant.size
            : "Medium",
          toNumber(variant.price, 0),
          toNumber(variant.stock, 0),
          typeof variant.sku === "string" ? variant.sku : null,
          now,
          now
        )
        .run();
    }
  }

  if (Array.isArray(source.images)) {
    await env.DB.prepare("DELETE FROM product_images WHERE product_id = ?").bind(productId).run();
    for (const [index, imageUrl] of (source.images as string[]).entries()) {
      await env.DB.prepare(
        `INSERT INTO product_images (id, product_id, image_url, sort_order, created_at)
         VALUES (?, ?, ?, ?, ?)`
      )
        .bind(`pimg-${crypto.randomUUID()}`, productId, imageUrl, index, now)
        .run();
    }
  }

  return json({ success: true, data: { id: productId }, message: "Product updated" });
}

async function handleDeleteProduct(env: Env, productId: string): Promise<Response> {
  await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(productId).run();
  return json({ success: true, data: { id: productId }, message: "Product deleted" });
}

async function handleListBlogPosts(env: Env): Promise<Response> {
  const rows = await env.DB.prepare(
    `SELECT
      b.id,
      b.title,
      b.slug,
      b.excerpt,
      b.content,
      b.category_id,
      bc.name AS category_name,
      b.tags_json,
      b.status,
      b.featured,
      b.views,
      b.meta_title,
      b.meta_description,
      b.featured_image_url,
      b.created_at,
      b.updated_at,
      b.published_at,
      COALESCE(u.name, 'Admin') AS author_name
    FROM blog_posts b
    LEFT JOIN blog_categories bc ON bc.id = b.category_id
    LEFT JOIN users u ON u.id = b.author_user_id
    ORDER BY b.created_at DESC`
  ).all<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    category_id: string;
    category_name: string | null;
    tags_json: string;
    status: "Draft" | "Published";
    featured: number;
    views: number;
    meta_title: string | null;
    meta_description: string | null;
    featured_image_url: string | null;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    author_name: string;
  }>();

  const posts = (rows.results ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    content: row.content,
    featuredImage: row.featured_image_url ?? "/images/blog/brownies-recipe.jpg",
    category: row.category_id,
    categoryName: row.category_name ?? "Tanpa Kategori",
    tags: JSON.parse(row.tags_json || "[]"),
    author: row.author_name,
    status: row.status,
    featured: row.featured === 1,
    views: toNumber(row.views, 0),
    createdAt: row.created_at,
    publishedAt: row.published_at ?? undefined,
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined
  }));

  return json({ success: true, data: posts });
}

async function handleCreateBlogPost(request: Request, env: Env): Promise<Response> {
  const payload = (await request.json()) as { post?: Record<string, unknown> };
  const source = payload.post ?? {};
  const now = new Date().toISOString();

  const title = typeof source.title === "string" && source.title.trim() ? source.title.trim() : "Artikel Baru";
  const slug = typeof source.slug === "string" && source.slug.trim() ? source.slug.trim() : slugify(title);
  const categoryId = await getOrFallbackCategoryId(
    env,
    "blog_categories",
    typeof source.category === "string" ? source.category : null,
    "Blog",
    "blog"
  );

  const postId = typeof source.id === "string" && source.id.trim() ? source.id.trim() : `post-${crypto.randomUUID()}`;
  const status = typeof source.status === "string" && ["Draft", "Published"].includes(source.status)
    ? source.status
    : "Draft";

  await env.DB.prepare(
    `INSERT INTO blog_posts (
      id,
      title,
      slug,
      excerpt,
      content,
      category_id,
      tags_json,
      status,
      featured,
      views,
      meta_title,
      meta_description,
      featured_image_url,
      created_at,
      updated_at,
      published_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      postId,
      title,
      slug,
      typeof source.excerpt === "string" ? source.excerpt : "",
      typeof source.content === "string" ? source.content : "",
      categoryId,
      JSON.stringify(Array.isArray(source.tags) ? source.tags : []),
      status,
      source.featured ? 1 : 0,
      toNumber(source.views, 0),
      typeof source.metaTitle === "string" ? source.metaTitle : null,
      typeof source.metaDescription === "string" ? source.metaDescription : null,
      typeof source.featuredImage === "string" ? source.featuredImage : "/images/blog/brownies-recipe.jpg",
      now,
      now,
      status === "Published" ? now : null
    )
    .run();

  return json({ success: true, data: { id: postId }, message: "Blog post created" }, 201);
}

async function handleUpdateBlogPost(request: Request, env: Env, postId: string): Promise<Response> {
  const existing = await env.DB.prepare("SELECT id FROM blog_posts WHERE id = ? LIMIT 1")
    .bind(postId)
    .first<{ id: string }>();

  if (!existing) {
    return json({ success: false, error: "Blog post not found" }, 404);
  }

  const payload = (await request.json()) as { post?: Record<string, unknown> };
  const source = payload.post ?? {};
  const now = new Date().toISOString();
  const categoryId = await getOrFallbackCategoryId(
    env,
    "blog_categories",
    typeof source.category === "string" ? source.category : null,
    "Blog",
    "blog"
  );

  await env.DB.prepare(
    `UPDATE blog_posts
      SET title = COALESCE(?, title),
          slug = COALESCE(?, slug),
          excerpt = COALESCE(?, excerpt),
          content = COALESCE(?, content),
          category_id = ?,
          tags_json = COALESCE(?, tags_json),
          status = COALESCE(?, status),
          featured = COALESCE(?, featured),
          meta_title = ?,
          meta_description = ?,
          featured_image_url = COALESCE(?, featured_image_url),
          updated_at = ?,
          published_at = CASE WHEN COALESCE(?, status) = 'Published' THEN COALESCE(published_at, ?) ELSE published_at END
      WHERE id = ?`
  )
    .bind(
      typeof source.title === "string" ? source.title : null,
      typeof source.slug === "string" ? source.slug : null,
      typeof source.excerpt === "string" ? source.excerpt : null,
      typeof source.content === "string" ? source.content : null,
      categoryId,
      Array.isArray(source.tags) ? JSON.stringify(source.tags) : null,
      typeof source.status === "string" ? source.status : null,
      typeof source.featured === "boolean" ? (source.featured ? 1 : 0) : null,
      typeof source.metaTitle === "string" ? source.metaTitle : null,
      typeof source.metaDescription === "string" ? source.metaDescription : null,
      typeof source.featuredImage === "string" ? source.featuredImage : null,
      now,
      typeof source.status === "string" ? source.status : null,
      now,
      postId
    )
    .run();

  return json({ success: true, data: { id: postId }, message: "Blog post updated" });
}

async function handleDeleteBlogPost(env: Env, postId: string): Promise<Response> {
  await env.DB.prepare("DELETE FROM blog_posts WHERE id = ?").bind(postId).run();
  return json({ success: true, data: { id: postId }, message: "Blog post deleted" });
}

async function handleGetSettings(env: Env): Promise<Response> {
  const settings = await env.DB.prepare("SELECT * FROM site_settings WHERE id = 1 LIMIT 1").first<Record<string, unknown>>();
  const bankAccounts = await env.DB.prepare(
    `SELECT id, bank_name, account_number, account_holder
     FROM bank_accounts
     WHERE is_active = 1
     ORDER BY created_at ASC`
  ).all<{ id: string; bank_name: string; account_number: string; account_holder: string }>();

  return json({
    success: true,
    data: {
      ...(settings || {}),
      bankAccounts: (bankAccounts.results ?? []).map((account) => ({
        id: account.id,
        bankName: account.bank_name,
        accountNumber: account.account_number,
        accountHolder: account.account_holder
      }))
    }
  });
}

async function handleUpdateSettings(request: Request, env: Env): Promise<Response> {
  const payload = (await request.json()) as { settings?: Record<string, unknown> };
  const source = payload.settings ?? {};
  const now = new Date().toISOString();

  await env.DB.prepare(
    `UPDATE site_settings
      SET site_name = COALESCE(?, site_name),
          tagline = COALESCE(?, tagline),
          description = COALESCE(?, description),
          logo_url = COALESCE(?, logo_url),
          favicon_url = COALESCE(?, favicon_url),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          whatsapp = COALESCE(?, whatsapp),
          address = COALESCE(?, address),
          instagram_url = COALESCE(?, instagram_url),
          facebook_url = COALESCE(?, facebook_url),
          tiktok_url = COALESCE(?, tiktok_url),
          shipping_cost = COALESCE(?, shipping_cost),
          min_order_amount = COALESCE(?, min_order_amount),
          lead_time_days = COALESCE(?, lead_time_days),
          order_prefix = COALESCE(?, order_prefix),
          payment_instructions = COALESCE(?, payment_instructions),
          seo_default_title = COALESCE(?, seo_default_title),
          seo_default_description = COALESCE(?, seo_default_description),
          ga4_id = COALESCE(?, ga4_id),
          updated_at = ?
      WHERE id = 1`
  )
    .bind(
      typeof source.site_name === "string" ? source.site_name : null,
      typeof source.tagline === "string" ? source.tagline : null,
      typeof source.description === "string" ? source.description : null,
      typeof source.logo_url === "string" ? source.logo_url : null,
      typeof source.favicon_url === "string" ? source.favicon_url : null,
      typeof source.email === "string" ? source.email : null,
      typeof source.phone === "string" ? source.phone : null,
      typeof source.whatsapp === "string" ? source.whatsapp : null,
      typeof source.address === "string" ? source.address : null,
      typeof source.instagram_url === "string" ? source.instagram_url : null,
      typeof source.facebook_url === "string" ? source.facebook_url : null,
      typeof source.tiktok_url === "string" ? source.tiktok_url : null,
      toOptionalNumber(source.shipping_cost),
      toOptionalNumber(source.min_order_amount),
      toOptionalNumber(source.lead_time_days),
      typeof source.order_prefix === "string" ? source.order_prefix : null,
      typeof source.payment_instructions === "string" ? source.payment_instructions : null,
      typeof source.seo_default_title === "string" ? source.seo_default_title : null,
      typeof source.seo_default_description === "string" ? source.seo_default_description : null,
      typeof source.ga4_id === "string" ? source.ga4_id : null,
      now
    )
    .run();

  if (Array.isArray(source.bankAccounts)) {
    await env.DB.prepare("DELETE FROM bank_accounts").run();
    for (const account of source.bankAccounts as Array<Record<string, unknown>>) {
      await env.DB.prepare(
        `INSERT INTO bank_accounts (
          id,
          bank_name,
          account_number,
          account_holder,
          is_active,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, 1, ?, ?)`
      )
        .bind(
          typeof account.id === "string" && account.id.trim() ? account.id : `bank-${crypto.randomUUID()}`,
          typeof account.bankName === "string" ? account.bankName : "",
          typeof account.accountNumber === "string" ? account.accountNumber : "",
          typeof account.accountHolder === "string" ? account.accountHolder : "",
          now,
          now
        )
        .run();
    }
  }

  return handleGetSettings(env);
}

async function handleSendTestNotification(request: Request, env: Env): Promise<Response> {
  const payload = (await request.json()) as {
    channel?: "whatsapp" | "email";
    target?: string;
    subject?: string;
    message?: string;
  };

  const channel = payload.channel;
  const target = payload.target ?? "";
  const message = payload.message ?? "Test notification from toko-kue-api";
  const subject = payload.subject ?? "Test Notification";

  if (!channel || !target) {
    return json({ success: false, error: "channel and target are required" }, 400);
  }

  if (channel === "whatsapp") {
    await sendWhatsAppNotification(env, target, message);
  } else {
    await sendEmailNotification(env, target, subject, `<p>${message}</p>`, message);
  }

  return json({ success: true, data: { channel, target }, message: "Test notification sent" });
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
    return handleListProducts(env);
  }

  if (pathname === "/api/products" && request.method === "POST") {
    return handleCreateProduct(request, env);
  }

  const productMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
  if (productMatch && request.method === "PUT") {
    return handleUpdateProduct(request, env, decodeURIComponent(productMatch[1]));
  }

  if (productMatch && request.method === "DELETE") {
    return handleDeleteProduct(env, decodeURIComponent(productMatch[1]));
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

  const orderStatusMatch = pathname.match(/^\/api\/orders\/([^/]+)\/status$/);
  if (orderStatusMatch && (request.method === "PATCH" || request.method === "PUT")) {
    return handleUpdateOrderStatus(request, env, decodeURIComponent(orderStatusMatch[1]));
  }

  if (pathname === "/api/blog/posts" && request.method === "GET") {
    return handleListBlogPosts(env);
  }

  if (pathname === "/api/blog/posts" && request.method === "POST") {
    return handleCreateBlogPost(request, env);
  }

  const blogPostMatch = pathname.match(/^\/api\/blog\/posts\/([^/]+)$/);
  if (blogPostMatch && request.method === "PUT") {
    return handleUpdateBlogPost(request, env, decodeURIComponent(blogPostMatch[1]));
  }

  if (blogPostMatch && request.method === "DELETE") {
    return handleDeleteBlogPost(env, decodeURIComponent(blogPostMatch[1]));
  }

  if (pathname === "/api/settings" && request.method === "GET") {
    return handleGetSettings(env);
  }

  if (pathname === "/api/settings" && (request.method === "PUT" || request.method === "PATCH")) {
    return handleUpdateSettings(request, env);
  }

  if (pathname === "/api/notifications/test" && request.method === "POST") {
    return handleSendTestNotification(request, env);
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
