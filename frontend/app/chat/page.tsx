"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
  createConversation,
  deleteConversation,
  getConversations,
  getMessages,
  renameConversation,
  sendMessage,
  type Conversation,
  type Message,
} from "@/services/conversationService";
import { cn } from "@/lib/utils";
import {
  Plus, Send, Pencil, Trash2, Check, X, Loader2, MessageSquare,
} from "lucide-react";

type DraftMessage = Message | {
  id: number;
  conversation_id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  pending?: boolean;
};

function formatConversationDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(value));
}

function formatMessageTime(value: string) {
  const date = new Date(value);
  const now  = new Date();
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth()    === now.getMonth() &&
    date.getDate()     === now.getDate();
  const time = new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(date);
  return isToday
    ? `Today, ${time}`
    : `${new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date)}, ${time}`;
}

function getConversationLabel(
  conversation: Conversation,
  messageByConversation: Record<number, Message[]>
) {
  if (conversation.title) return conversation.title;
  const first = messageByConversation[conversation.id]?.find((m) => m.role === "user");
  if (!first) return `Conversation ${conversation.id}`;
  return first.content.length > 36 ? `${first.content.slice(0, 36)}…` : first.content;
}

export default function ChatPage() {
  const router    = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [token,                  setToken]                  = useState<string | null>(null);
  const [conversations,          setConversations]          = useState<Conversation[]>([]);
  const [activeConversationId,   setActiveConversationId]   = useState<number | null>(null);
  const [messages,               setMessages]               = useState<DraftMessage[]>([]);
  const [messageByConversation,  setMessageByConversation]  = useState<Record<number, Message[]>>({});
  const [draft,                  setDraft]                  = useState("");
  const [loadingConversations,   setLoadingConversations]   = useState(true);
  const [loadingMessages,        setLoadingMessages]        = useState(false);
  const [sending,                setSending]                = useState(false);
  const [editingConversationId,  setEditingConversationId]  = useState<number | null>(null);
  const [editingTitle,           setEditingTitle]           = useState("");
  const [savingTitle,            setSavingTitle]            = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState<number | null>(null);
  const [error,                  setError]                  = useState<string | null>(null);

  /* ── auth ───────────────────────────────────────────────── */
  useEffect(() => {
    const t = window.setTimeout(() => {
      const saved = localStorage.getItem("access_token");
      if (!saved) { router.replace("/login"); return; }
      setToken(saved);
    }, 0);
    return () => window.clearTimeout(t);
  }, [router]);

  /* ── load conversations ─────────────────────────────────── */
  useEffect(() => {
    if (!token) return;
    getConversations(token)
      .then((data) => {
        setConversations(data);
        if (data.length > 0) setActiveConversationId(data[0].id);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load conversations."))
      .finally(() => setLoadingConversations(false));
  }, [token]);

  /* ── load messages when conversation changes ─────────────── */
  useEffect(() => {
    if (!token || activeConversationId === null) return;
    let ignore = false;
    const authToken = token;
    const convId    = activeConversationId;

    async function load() {
      setLoadingMessages(true);
      setError(null);
      try {
        const data = await getMessages(convId, authToken);
        if (ignore) return;
        setMessages(data);
        setMessageByConversation((prev) => ({ ...prev, [convId]: data }));
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : "Failed to load messages.");
      } finally {
        if (!ignore) setLoadingMessages(false);
      }
    }
    void load();
    return () => { ignore = true; };
  }, [activeConversationId, token]);

  /* ── auto-scroll ────────────────────────────────────────── */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingMessages, sending]);

  const canSend = useMemo(() => draft.trim().length > 0 && !sending, [draft, sending]);
  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const activeLabel = activeConversation
    ? getConversationLabel(activeConversation, messageByConversation)
    : "Chat";

  /* ── handlers ───────────────────────────────────────────── */
  async function refreshConversations(authToken: string, selectedId: number) {
    const data = await getConversations(authToken);
    setConversations(data);
    setActiveConversationId(selectedId);
  }

  async function handleNewConversation() {
    if (!token) return;
    setError(null);
    try {
      const id = await createConversation(token);
      await refreshConversations(token, id);
      setMessages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create conversation.");
    }
  }

  async function handleSelectConversation(id: number) {
    if (editingConversationId !== null || id === activeConversationId) return;
    setActiveConversationId(id);
    setMessages(messageByConversation[id] ?? []);
  }

  function startRenaming(conversation: Conversation) {
    setEditingConversationId(conversation.id);
    setEditingTitle(getConversationLabel(conversation, messageByConversation));
    setError(null);
  }

  function cancelRenaming() {
    setEditingConversationId(null);
    setEditingTitle("");
  }

  async function handleRename(conversationId: number) {
    if (!token || savingTitle) return;
    const title = editingTitle.trim();
    if (!title) { setError("Title is required."); return; }
    setSavingTitle(true);
    try {
      const updated = await renameConversation(conversationId, title, token);
      setConversations((prev) => prev.map((c) => c.id === conversationId ? updated : c));
      cancelRenaming();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename.");
    } finally {
      setSavingTitle(false);
    }
  }

  async function handleDelete(conversation: Conversation, label: string) {
    if (!token || deletingConversationId !== null) return;
    if (!window.confirm(`Delete "${label}" and all its messages?`)) return;
    setDeletingConversationId(conversation.id);
    try {
      await deleteConversation(conversation.id, token);
      const next = conversations.filter((c) => c.id !== conversation.id);
      setConversations(next);
      setMessageByConversation((prev) => { const n = { ...prev }; delete n[conversation.id]; return n; });
      if (conversation.id === activeConversationId) {
        const nextActive = next[0] ?? null;
        setActiveConversationId(nextActive?.id ?? null);
        setMessages(nextActive ? messageByConversation[nextActive.id] ?? [] : []);
      }
      if (conversation.id === editingConversationId) cancelRenaming();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete conversation.");
    } finally {
      setDeletingConversationId(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token || !canSend) return;
    const content = draft.trim();
    setDraft("");
    setError(null);
    setSending(true);
    let convId = activeConversationId;
    try {
      if (convId === null) {
        convId = await createConversation(token);
        await refreshConversations(token, convId);
      }
      const optimistic: DraftMessage = {
        id: Date.now() * -1, conversation_id: convId,
        role: "user", content, created_at: new Date().toISOString(), pending: true,
      };
      setMessages((prev) => [...prev, optimistic]);
      const response = await sendMessage(convId, content, token);
      const latest   = await getMessages(response.conversation_id, token);
      setMessages(latest);
      setMessageByConversation((prev) => ({ ...prev, [response.conversation_id]: latest }));
      await refreshConversations(token, response.conversation_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
      setDraft(content);
    } finally {
      setSending(false);
    }
  }

  /* ── sidebar icon button ─────────────────────────────────── */
  function SideIconBtn({
    onClick, disabled, label, danger, children,
  }: {
    onClick: () => void;
    disabled?: boolean;
    label: string;
    danger?: boolean;
    children: React.ReactNode;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all",
          "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
          danger
            ? "text-[var(--muted-foreground)] hover:bg-red-500/15 hover:text-red-400"
            : "text-[var(--muted-foreground)] hover:bg-[var(--surface-3)] hover:text-[var(--foreground)]",
          disabled && "cursor-not-allowed opacity-30"
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <main className="flex-1 bg-[var(--background)] px-3 py-4">
      <div className="mx-auto flex h-[calc(100vh-8rem)] min-h-[620px] max-w-6xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl shadow-black/40">

        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[var(--surface-1)] md:flex md:flex-col">

          {/* New chat button */}
          <div className="p-3 border-b border-[var(--border)]">
            <button
              type="button"
              onClick={handleNewConversation}
              disabled={!token}
              className={cn(
                "flex h-10 w-full items-center justify-center gap-2 rounded-xl",
                "brand-gradient text-white text-sm font-semibold transition-all",
                "hover:opacity-90 hover:shadow-md hover:shadow-[var(--brand-from)]/30",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          {/* Conversation list */}
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {loadingConversations ? (
              <div className="flex h-24 items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-[var(--primary)]" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="px-3 py-4 text-sm text-[var(--muted-foreground)]">No conversations yet</p>
            ) : (
              <div className="flex flex-col gap-0.5">
                {conversations.map((conversation) => {
                  const active  = conversation.id === activeConversationId;
                  const editing = conversation.id === editingConversationId;
                  const label   = getConversationLabel(conversation, messageByConversation);

                  if (editing) {
                    return (
                      <div key={conversation.id} className="rounded-xl bg-[var(--surface-2)] p-2 border border-[var(--border)]">
                        <input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter")  { e.preventDefault(); void handleRename(conversation.id); }
                            if (e.key === "Escape") cancelRenaming();
                          }}
                          maxLength={100}
                          autoFocus
                          className="h-8 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-1)] px-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--brand-via)]/60"
                        />
                        <div className="mt-1.5 flex justify-end gap-1">
                          <button type="button" onClick={cancelRenaming} className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--surface-3)]">
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => handleRename(conversation.id)} disabled={savingTitle}
                            className="flex h-7 w-7 items-center justify-center rounded-lg brand-gradient text-white disabled:opacity-40">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={conversation.id}
                      className={cn(
                        "group flex items-center gap-1 rounded-xl pr-1 transition-all duration-150 cursor-pointer",
                        active
                          ? "bg-[var(--surface-2)] border border-[var(--brand-from)]/25"
                          : "hover:bg-[var(--surface-2)] border border-transparent"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectConversation(conversation.id)}
                        className="min-w-0 flex-1 px-3 py-2 text-left"
                      >
                        <span className={cn("block truncate text-sm font-semibold", active ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]")}>
                          {label}
                        </span>
                        <span className="mt-0.5 block text-xs text-[var(--muted-foreground)]/70">
                          {formatConversationDate(conversation.created_at)}
                        </span>
                      </button>
                      <SideIconBtn onClick={() => startRenaming(conversation)} label="Rename">
                        <Pencil className="w-3.5 h-3.5" />
                      </SideIconBtn>
                      <SideIconBtn
                        onClick={() => handleDelete(conversation, label)}
                        disabled={deletingConversationId === conversation.id}
                        label="Delete"
                        danger
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </SideIconBtn>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ── Chat area ───────────────────────────────────── */}
        <section className="flex min-w-0 flex-1 flex-col">

          {/* Header bar */}
          <div className="flex min-h-14 items-center justify-between border-b border-[var(--border)] px-4">
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-[var(--foreground)]">{activeLabel}</h1>
              <p className="text-xs text-[var(--muted-foreground)]">KelanaAI Travel Assistant</p>
            </div>
            <button
              type="button"
              onClick={handleNewConversation}
              disabled={!token}
              className="h-8 rounded-lg border border-[var(--border)] px-3 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--surface-2)] transition-colors md:hidden"
            >
              New
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div className="border-b border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Messages */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--background)] px-4 py-5">
            {loadingMessages ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="w-7 h-7 animate-spin text-[var(--primary)]" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div className="max-w-sm">
                  <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-[var(--brand-from)]/30">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-[var(--foreground)]">Where should we go next?</h2>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">
                    Ask about routes, itineraries, budgets, or what to do on a specific day.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex max-w-3xl flex-col gap-3">
                {messages.map((message) => {
                  const isUser    = message.role === "user";
                  const isPending = "pending" in message && message.pending;
                  return (
                    <div key={message.id} className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
                      <div
                        className={cn(
                          "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6",
                          isUser
                            ? "rounded-br-sm brand-gradient text-white shadow-md shadow-[var(--brand-from)]/25"
                            : "rounded-bl-sm border border-[var(--brand-via)]/20 bg-[var(--brand-from)]/10 text-[var(--foreground)]",
                          isPending && "opacity-60"
                        )}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        ) : (
                          <div className="prose prose-sm prose-invert max-w-none prose-p:my-0 prose-ul:my-2 prose-ol:my-2 prose-li:my-1">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                      {!isPending && (
                        <span className="mt-1 px-1 text-[11px] text-[var(--muted-foreground)]">
                          {formatMessageTime(message.created_at)}
                        </span>
                      )}
                    </div>
                  );
                })}
                {sending && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm border border-[var(--brand-via)]/20 bg-[var(--brand-from)]/10 px-4 py-3 text-sm text-[var(--muted-foreground)]">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking…
                      </span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-[var(--border)] bg-[var(--card)] p-3">
            <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-2 focus-within:border-[var(--brand-via)]/60 transition-all">
              <label htmlFor="chat-message" className="sr-only">Message</label>
              <textarea
                id="chat-message"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={1}
                placeholder="Type a message… (Enter to send)"
                className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] outline-none"
              />
              <button
                type="submit"
                disabled={!canSend}
                aria-label="Send message"
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all",
                  "brand-gradient text-white",
                  "hover:opacity-90 hover:scale-[1.05] hover:shadow-md hover:shadow-[var(--brand-from)]/30",
                  "disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
