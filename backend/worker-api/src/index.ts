interface Env {
  APP_ENV: string;
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
