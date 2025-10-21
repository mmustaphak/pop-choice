type MovieData = {
  movie: string;
  description: string;
};

type Success = {
  data: MovieData;
  error: null;
};

type Error = {
  error: string;
  data: null;
};

type ActionParams = Success | Error | null;

export default async function action(
  _: ActionParams,
  payload: FormData | null,
): Promise<Success | Error | null> {
  if (payload === null) {
    return null;
  }
  try {
    const data = JSON.stringify(Object.fromEntries(payload.entries()));
    const res = await fetch("/api/ai", {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw Error("AI is having a bad day right now");
    }

    const movieData: MovieData = await res.json();

    return { data: movieData, error: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, data: null };
    } else {
      return { error: "Server Error....", data: null };
    }
  }
}
