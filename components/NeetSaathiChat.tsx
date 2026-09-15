"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Send, Trash2, User, X } from "lucide-react";
import {
  NEET_SAATHI,
  NEET_SAATHI_CONTACT_HELP,
} from "@/lib/neet-saathi-prompt";
import { SITE_IDENTITY } from "@/app/config/site_identity";
import { useNeetSaathi } from "@/contexts/NeetSaathiContext";
import { NeetSaathiIcon } from "@/components/NeetSaathiIcon";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: `Hi! 🎓 I'm ${NEET_SAATHI.name} — your ${NEET_SAATHI.hindiTagline}.\n\nAsk me anything about MBBS in India/Abroad, NEET counselling, fees, cut-offs, or college shortlists. I reply in English by default, and can switch to Hindi or Hinglish if you do. ✨`,
};

const QUICK_PROMPTS = [
  "Best MBBS options after NEET?",
  "MBBS abroad vs India?",
  "What NEET score do I need?",
];

const LOADING_HINTS = [
  "Checking your question…",
  "Looking up admission guidance…",
  "Preparing a clear answer…",
];

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-accent"
          style={{
            animation: "neet-saathi-dot 1.05s ease-in-out infinite",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </span>
  );
}

function BotAvatar({ pulse = false }: { pulse?: boolean }) {
  return (
    <span
      className={`relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-deep text-white shadow-[0_4px_12px_rgba(21,128,61,0.28)] ${
        pulse ? "animate-pulse" : ""
      }`}
    >
      <NeetSaathiIcon className="h-4 w-4" />
    </span>
  );
}

export default function NeetSaathiChat() {
  const { isOpen: open, openChat, closeChat } = useNeetSaathi();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHint, setLoadingHint] = useState(LOADING_HINTS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const loadingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const showQuickPrompts = messages.length === 1 && !loading;

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = listRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [open, messages, loading, scrollToBottom]);

  useEffect(() => {
    if (open && !loading) {
      const t = setTimeout(() => inputRef.current?.focus(), 180);
      return () => clearTimeout(t);
    }
  }, [open, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeChat]);

  useEffect(() => {
    if (!loading) {
      setLoadingHint(LOADING_HINTS[0]);
      return;
    }
    let i = 0;
    setLoadingHint(LOADING_HINTS[0]);
    const timer = setInterval(() => {
      i = (i + 1) % LOADING_HINTS.length;
      setLoadingHint(LOADING_HINTS[i]);
    }, 2200);
    return () => clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const clearChat = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    loadingRef.current = false;
    setLoading(false);
    setInput("");
    setMessages([WELCOME]);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.focus();
    }
  };

  const resizeInput = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  };

  const sendMessage = async (preset?: string) => {
    const text = (preset ?? input).trim();
    if (!text || loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    const userMsg: ChatMessage = { id: newId(), role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    const history = nextMessages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: history.slice(0, -1) }),
        signal: controller.signal,
      });

      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        help?: string;
      };

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: newId(),
            role: "assistant",
            content: `${data.error || "Chat failed right now."}\n\n${
              data.help || NEET_SAATHI_CONTACT_HELP
            }`,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          content:
            data.reply ||
            `Sorry — I couldn't generate an answer. 🙏\n\n${NEET_SAATHI_CONTACT_HELP}`,
        },
      ]);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          content: `Sorry, I couldn't connect right now. 🙏\n\n${NEET_SAATHI_CONTACT_HELP}`,
        },
      ]);
    } finally {
      if (abortRef.current === controller) {
        loadingRef.current = false;
        setLoading(false);
        abortRef.current = null;
      }
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <>
      {/* Launcher FAB */}
      <button
        type="button"
        onClick={openChat}
        aria-label={`Open ${NEET_SAATHI.name} chat`}
        className={`group fixed bottom-[calc(var(--bottom-ticker-h)+max(1rem,env(safe-area-inset-bottom)))] right-[max(1rem,env(safe-area-inset-right))] z-[75] flex items-center gap-2.5 rounded-full bg-gradient-to-br from-accent to-accent-deep text-white shadow-[0_10px_32px_rgba(21,128,61,0.42)] transition-all hover:scale-[1.03] hover:shadow-[0_14px_36px_rgba(21,128,61,0.5)] active:scale-95 ${
          open
            ? "pointer-events-none scale-0 opacity-0"
            : "scale-100 opacity-100"
        }`}
      >
        <span className="relative flex h-14 w-14 items-center justify-center sm:h-[58px] sm:w-[58px]">
          <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
          <NeetSaathiIcon className="relative h-7 w-7" />
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent-deep bg-[#86efac]" />
        </span>
        <span className="hidden pr-5 font-body text-[13px] font-bold tracking-tight sm:inline">
          Ask AI
        </span>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[80] bg-[#0f172a]/45 backdrop-blur-[3px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        onClick={closeChat}
      />

      {/* Sidebar panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-busy={loading}
        aria-label={`${NEET_SAATHI.name} chat`}
        className={`fixed inset-y-0 right-0 z-[85] flex w-full max-w-[420px] flex-col overflow-hidden bg-[#f3f7f4] shadow-[-12px_0_48px_rgba(15,23,42,0.22)] transition-transform duration-300 ease-out sm:my-3 sm:mr-3 sm:h-[calc(100%-1.5rem)] sm:rounded-[22px] ${
          open ? "translate-x-0" : "translate-x-[110%]"
        }`}
      >
        {/* Header */}
        <header className="relative shrink-0 overflow-hidden bg-gradient-to-br from-[#14532d] via-[#166534] to-[#15803d] px-4 pb-4 pt-4 sm:px-5">
          <div
            className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-12 left-8 h-28 w-28 rounded-full bg-[#86efac]/20 blur-2xl"
            aria-hidden
          />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm">
                <NeetSaathiIcon className="h-6 w-6" />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#14532d] ${
                    loading ? "animate-pulse bg-amber-300" : "bg-[#4ade80]"
                  }`}
                />
              </span>
              <div className="min-w-0">
                <h2 className="truncate font-display text-[17px] font-extrabold tracking-tight text-white">
                  {NEET_SAATHI.name}
                </h2>
                <p className="truncate font-body text-[11px] text-white/75">
                  {loading ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Replying…
                    </span>
                  ) : (
                    <>
                      <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-[#86efac]" />
                      Online · {NEET_SAATHI.hindiTagline}
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                disabled={messages.length <= 1 && !loading && !input.trim()}
                aria-label="Clear chat"
                title="Clear chat"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={closeChat}
                aria-label="Close chat"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={listRef}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5"
        >
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                {isUser ? (
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                    <User className="h-4 w-4" />
                  </span>
                ) : (
                  <BotAvatar />
                )}
                <div
                  className={`max-w-[82%] rounded-[18px] px-3.5 py-2.5 font-body text-[14px] leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? "rounded-br-md bg-gradient-to-br from-[#14532d] to-[#166534] text-white shadow-[0_6px_16px_rgba(20,83,45,0.22)]"
                      : "rounded-bl-md border border-[#d8e8dc] bg-white text-text shadow-[0_4px_14px_rgba(15,23,42,0.05)]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {showQuickPrompts && (
            <div className="flex flex-wrap gap-2 pl-10">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  className="rounded-full border border-accent/25 bg-white px-3 py-1.5 font-body text-[12px] font-semibold text-accent-deep shadow-sm transition-colors hover:border-accent/45 hover:bg-accent/8"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex gap-2.5" role="status" aria-live="polite">
              <BotAvatar pulse />
              <div className="max-w-[82%] space-y-2 rounded-[18px] rounded-bl-md border border-[#d8e8dc] bg-white px-4 py-3 shadow-[0_4px_14px_rgba(15,23,42,0.05)]">
                <div className="flex items-center gap-2.5">
                  <TypingDots />
                  <span className="font-body text-sm font-semibold text-text">
                    {NEET_SAATHI.name} is typing
                  </span>
                </div>
                <p className="font-body text-xs text-muted transition-opacity duration-300">
                  {loadingHint}
                </p>
                <div className="space-y-1.5 pt-0.5">
                  <div className="h-2 w-40 animate-pulse rounded-full bg-[#d8e8dc]" />
                  <div className="h-2 w-28 animate-pulse rounded-full bg-[#e6f0e9]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <footer className="shrink-0 border-t border-[#d8e8dc] bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
          {loading && (
            <div className="mb-2.5 flex items-center gap-2 rounded-[12px] bg-accent/10 px-3 py-2 font-body text-[11px] font-semibold text-accent-deep">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Please wait — crafting your reply…
            </div>
          )}
          <form
            onSubmit={onSubmit}
            className="flex items-end gap-2 rounded-[16px] border border-[#d8e8dc] bg-[#f7fbf8] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] focus-within:border-accent/45 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(21,128,61,0.1)]"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                resizeInput();
              }}
              onKeyDown={onKeyDown}
              rows={1}
              placeholder={
                loading
                  ? "Waiting for reply…"
                  : "Ask about MBBS, NEET, colleges..."
              }
              disabled={loading}
              aria-disabled={loading}
              className="max-h-28 min-h-[42px] flex-1 resize-none bg-transparent px-2.5 py-2.5 font-body text-sm text-text outline-none placeholder:text-muted/70 disabled:cursor-not-allowed disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label={loading ? "Sending…" : "Send message"}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-accent to-accent-deep text-white shadow-[0_4px_12px_rgba(21,128,61,0.3)] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </form>
          <p className="mt-2.5 text-center font-body text-[10px] leading-snug text-muted">
            AI-generated answers. Please verify with a {SITE_IDENTITY.name}{" "}
            counsellor before deciding.
          </p>
        </footer>
      </aside>
    </>
  );
}
