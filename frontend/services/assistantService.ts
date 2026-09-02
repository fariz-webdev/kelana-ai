const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface KBSource {
  filename: string;
  source: string;
}

export interface AskResponse {
  answer: string;
  sources: KBSource[];
}

export async function askAssistant(
  question: string,
  token: string
): Promise<AskResponse> {
  const res = await fetch(`${API_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `Request failed (${res.status})`);
  }

  return res.json();
}
