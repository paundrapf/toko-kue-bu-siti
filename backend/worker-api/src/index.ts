interface Env {
  APP_ENV: string;
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

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

  if (!ALLOWED_IMAGE_MIME_TYPES.has(fileEntry.type)) {
    return json(
      {
        success: false,
        error: "Unsupported file type",
        message: "Allowed types: image/jpeg, image/png, image/webp."
      },
      400
    );
  }

  if (fileEntry.size > MAX_UPLOAD_SIZE_BYTES) {
    return json(
      {
        success: false,
        error: "File too large",
        message: "Max upload size is 5MB."
      },
      400
    );
  }

  const ext = getFileExtension(fileEntry.type);
  const key = `uploads/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const body = await fileEntry.arrayBuffer();
  await env.MEDIA_BUCKET.put(key, body, {
    httpMetadata: {
      contentType: fileEntry.type
    }
  });

  return json({
    success: true,
    data: {
      key,
      alt: typeof altEntry === "string" ? altEntry : "",
      contentType: fileEntry.type,
      size: fileEntry.size,
      viewUrl: `/api/media/${encodeURIComponent(key)}`
    },
    message: "Media uploaded to R2 bucket."
  });
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
    return json({ success: true, data: [], message: "Orders route placeholder" });
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
