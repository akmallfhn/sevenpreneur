export async function POST(req: Request) {
  const streamChatURL = process.env.STREAM_SEND_CHAT_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  const body = await req.json();

  const response = await fetch(streamChatURL!, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + supabaseAnonKey!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.body) {
    return new Response("No stream", { status: 500 });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
