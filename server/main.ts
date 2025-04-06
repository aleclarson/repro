import { serve } from "srvx";

const server = serve({
  hostname: "0.0.0.0",
  port: 3000,
  async fetch(req) {
    if (req.method === "GET") {
      return new Response(null, { status: 404 });
    }

    console.log({
      method: req.method,
      url: req.url,
      headers: req.headers,
    });

    try {
      const formData = await req.formData();
      console.log({
        formData,
      });
    } catch (error) {
      console.error(error);
    }

    return new Response("ok");
  },
});

server.ready().then(({ url }) => {
  console.log(`Server is ready: ${url}`);
});
