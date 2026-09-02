"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { askAssistant, type AskResponse } from "@/services/assistantService";

export default function AssistantPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Guard: redirect to login if no token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await askAssistant(question.trim(), token);
      setResult(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!authChecked) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen bg-white">
        <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ask KelanaAI</h1>
          <p className="text-sm text-gray-400 mt-1">
            Powered by your trusted travel documents
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask Everything about your trip plan..."
            disabled={loading}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3
                       text-sm text-gray-700 placeholder-gray-400 outline-none
                       focus:ring-2 focus:ring-blue-300 focus:border-transparent
                       disabled:opacity-60 transition"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700
                       disabled:opacity-50 disabled:cursor-not-allowed
                       text-white text-sm font-semibold px-5 py-3 rounded-xl
                       transition-colors flex items-center gap-2"
          >
            {loading ? (
              <svg
                className="animate-spin h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              "Ask"
            )}
          </button>
        </form>

        {/* Error state */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Answer card */}
        {result && (
          <div className="bg-teal-700 rounded-2xl overflow-hidden">

            {/* Answer section */}
            <div className="px-6 pt-6 pb-5">
              <p className="text-xs font-bold tracking-widest text-teal-300 uppercase mb-3">
                AI Answer
              </p>
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                {result.answer}
              </p>
            </div>

            {/* Divider */}
            {result.sources.length > 0 && (
              <div className="border-t border-teal-600 mx-6" />
            )}

            {/* Sources section */}
            {result.sources.length > 0 && (
              <div className="px-6 py-4">
                <p className="text-xs font-bold tracking-widest text-teal-300 uppercase mb-3">
                  Source
                </p>
                <ul className="space-y-1.5">
                  {result.sources.map((s, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {/* File icon */}
                      <svg
                        className="w-4 h-4 text-teal-300 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
                      </svg>
                      {s.source ? (
                        <a
                          href={s.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-teal-100 hover:text-white underline underline-offset-2 transition-colors truncate"
                        >
                          {s.filename}
                        </a>
                      ) : (
                        <span className="text-sm text-teal-100">
                          {s.filename}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Empty state — before any question */}
        {!result && !error && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500 mb-4">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">
              Ask anything about travel
            </p>
            <p className="text-gray-400 text-sm max-w-xs">
              KelanaAI will answer using your trusted travel documents as the source.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
