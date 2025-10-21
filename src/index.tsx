import { serve } from "bun";
import index from "./index.html";
import { generateEmbedding, getMovie } from "./utils";
import { supabase } from "./config";
import content from "./content";

type MovieData = { id: number; content: string; embedding: number[] };

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/api/ai": async (req) => {
      try {
        if (req.method !== "POST") {
          return Response.json(
            { error: "Wrong request method, use POST" },
            { status: 405 },
          );
        }

        const payload = await req.json();
        const dataAsString = Object.values(payload).join(" ");
        const embedding = await generateEmbedding(dataAsString);

        const { data, error } = await supabase.rpc("match_movies", {
          query_embedding: embedding,
          match_threshold: 0.4,
          match_count: 1,
        });

        if (error) {
          throw error;
        }

        const userData = JSON.stringify(payload);
        const aiContext = data[0]?.content || "";
        const aiRes = await getMovie(userData, aiContext);

        return Response.json(aiRes);
      } catch (err) {
        err instanceof Error ? console.log(err.message) : console.log(err);
        return Response.json({ error: "Server Error" }, { status: 500 });
      }
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
