import { generateObject, generateText, NoObjectGeneratedError } from "ai";
import { google } from "@ai-sdk/google";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embed } from "ai";
import { supabase } from "./config";
import { z } from "zod";

export async function getMovie(userData: string, context: string) {
  try {
    const { object } = await generateObject({
      schema: z.object({
        movie: z.string(),
        description: z.string(),
      }),
      model: google("gemini-2.5-flash"),
      prompt: `You are the worlds best movie recommender, you will be given user-data and context. Only reply based on the context, please if the context does not provide a good movie reply:'Sorry I don't a movie to recommend'. user-data: ${userData}, context:${context}`,
    });
    return object;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      throw Error(
        "AI had an issue..., I guess even AI can't win everyday. Not too different from human don't you think?",
      );
    }
  }
}

export async function findNearestMatch(embedding: number[]) {
  try {
    const { data, error } = await supabase.rpc("match_movies", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 1,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    }
  }
}

export async function generateEmbedding(value: string) {
  try {
    const { embedding } = await embed({
      model: google.textEmbedding("gemini-embedding-001"),
      value,
    });

    return embedding;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Error Generating Embedding: ", error);
    }
  }
}

export async function chunkAndEmbedContents(content: string[]) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 150,
      chunkOverlap: 50,
    });

    const chunks = (await splitter.createDocuments(content)).map(
      ({ pageContent }) => pageContent,
    );

    async function contentAndEmbeddingFromChunk(chunk: string) {
      const embeddingData = await embed({
        model: google.textEmbedding("gemini-embedding-001"),
        value: chunk,
      });
      return { content: chunk, embedding: embeddingData.embedding };
    }

    const chunksWithEmbedding = await Promise.all(
      chunks.map(contentAndEmbeddingFromChunk),
    );

    return chunksWithEmbedding;
  } catch (err) {
    console.log("Error in embedding");
    throw err;
  }
}

export async function embedContent(content: string) {
  const { embedding } = await embed({
    model: google.textEmbedding("gemini-embedding-001"),
    value: content,
  });
  return embedding;
}
