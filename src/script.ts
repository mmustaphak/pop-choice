import movies from "./content";
import { supabase } from "./config";
import { embedContent } from "./utils";

async function main() {
  try {
    const formattedMovies = movies.map(
      ({ title, content, releaseYear }) =>
        `${title}, ${releaseYear}, ${content}`,
    );

    const embeddedMovies = await Promise.all(
      formattedMovies.map(async (movie) => {
        return {
          content: movie,
          embedding: await embedContent(movie),
        };
      }),
    );

    const { error } = await supabase.from("movies").insert(embeddedMovies);
    if (error) {
      throw error;
    }
    console.log("All Done!!!!");
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log("Error: ", err);
    }
  }
}

main();
