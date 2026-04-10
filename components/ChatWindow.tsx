"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Message } from "@/lib/types";
import {
  INITIAL_QUICK_REPLIES,
  DEFAULT_FOLLOW_UPS,
  findPredefinedResponse,
} from "@/lib/predefined-responses";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import QuickReplies from "./QuickReplies";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "bot",
  content:
    "Hi there! 👋 Welcome to Sweet Delights Bakery! I'm here to help you with our menu, prices, orders, and more. What can I help you with today?",
  timestamp: new Date(),
};

/* ── Glass Orb ── */
function GlassOrb() {
  return (
    <div className="relative flex flex-col items-center select-none">
      <div className="hero-orb relative w-48 h-48 sm:w-60 sm:h-60">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `
              radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 38%),
              radial-gradient(circle at 68% 72%, rgba(103,232,249,0.55) 0%, rgba(103,232,249,0) 38%),
              radial-gradient(circle at 25% 75%, rgba(192,132,252,0.5) 0%, rgba(192,132,252,0) 38%),
              linear-gradient(135deg, #f472b6 0%, #c084fc 35%, #818cf8 60%, #67e8f9 100%)
            `,
            boxShadow: `
              inset -8px -8px 30px rgba(0,0,0,0.08),
              inset 8px 8px 30px rgba(255,255,255,0.45),
              0 30px 80px rgba(192,132,252,0.35),
              0 10px 30px rgba(244,114,182,0.25)
            `,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            top: "18%",
            left: "22%",
            width: "22%",
            height: "16%",
            background: "rgba(255,255,255,0.7)",
            filter: "blur(4px)",
            transform: "rotate(-30deg)",
          }}
        />
      </div>
      {/* Reflection */}
      <div
        className="w-36 sm:w-44 h-8 -mt-2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse, rgba(192,132,252,0.2) 0%, transparent 70%)",
          filter: "blur(8px)",
          transform: "scaleY(0.5)",
        }}
      />
    </div>
  );
}

const SUGGESTIONS = [
  "What custom cake designs do you offer?",
  "How far in advance should I order a birthday cake?",
  "What are your most popular pastries?",
  "Do you offer same-day delivery?",
  "What payment methods do you accept?",
  "Can I get a price quote for a wedding cake?",
];

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [quickReplies, setQuickReplies] = useState<string[]>(
    INITIAL_QUICK_REPLIES
  );
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<Message[]>([WELCOME_MESSAGE]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (hasStartedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, hasStartedChat]);

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      setHasStartedChat(true);

      const fileLabel = attachedFile ? ` [Attached: ${attachedFile.name}]` : "";
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed + fileLabel,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setAttachedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowSuggestions(false);
      setQuickReplies([]);
      setIsTyping(true);
      setIsLoading(true);

      const delay = 1000 + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      const predefined = findPredefinedResponse(trimmed);

      if (predefined) {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          role: "bot",
          content: predefined.response,
          timestamp: new Date(),
          menuSections: predefined.menuSections,
          richCard: predefined.richCard,
        };
        setMessages((prev) => [...prev, botMessage]);
        setQuickReplies(predefined.followUps);
      } else {
        const history = messagesRef.current;
        const apiMessages: Array<{
          role: "user" | "assistant";
          content: string;
        }> = [];
        let seenUser = false;
        for (const m of [...history, userMessage]) {
          if (m.role === "user") seenUser = true;
          if (seenUser) {
            apiMessages.push({
              role: m.role === "user" ? "user" : "assistant",
              content: m.content,
            });
          }
        }

        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: apiMessages }),
          });

          const data = await res.json();
          const content = res.ok
            ? data.message
            : data.error ??
              "Sorry, something went wrong. Please try again or call us at 08125888459. 🙏";

          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              role: "bot",
              content,
              timestamp: new Date(),
            },
          ]);
          setQuickReplies(DEFAULT_FOLLOW_UPS);
        } catch {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              role: "bot",
              content:
                "Oops! I'm having trouble connecting. Please try again or call us at 08125888459. 🙏",
              timestamp: new Date(),
            },
          ]);
          setQuickReplies(DEFAULT_FOLLOW_UPS);
        }
      }

      setIsTyping(false);
      setIsLoading(false);
    },
    [isLoading, hasStartedChat, attachedFile]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  /* ── Shared bottom bar ── */
  const bottomBar = (
    <div
      className="shrink-0 px-4 pb-4 pt-2"
      style={{
        background: "rgba(255,255,255,0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Quick replies — horizontal scroll, no wrap */}
      <QuickReplies
        replies={quickReplies}
        onSelect={handleSend}
        onReset={
          quickReplies !== INITIAL_QUICK_REPLIES && quickReplies.length > 0
            ? () => setQuickReplies(INITIAL_QUICK_REPLIES)
            : undefined
        }
        disabled={isLoading}
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          setAttachedFile(file);
          if (file) setShowSuggestions(false);
        }}
      />

      {/* Suggestions popup */}
      {showSuggestions && (
        <div
          className="mb-2 rounded-2xl overflow-hidden shadow-lg border border-white/60"
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(16px)",
          }}
        >
          <p className="text-[11px] font-semibold text-violet-400 uppercase tracking-wide px-4 pt-3 pb-1">
            Suggested questions
          </p>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setInputValue(s);
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-violet-50 transition-colors border-t border-gray-50 first:border-0"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input card with gradient border */}
      <div
        className="rounded-2xl p-px"
        style={{
          background:
            "linear-gradient(135deg, #f9a8d4, #c084fc, #818cf8, #67e8f9)",
        }}
      >
        <div
          className="rounded-2xl px-4 pt-3.5 pb-3"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Attached file preview */}
          {attachedFile && (
            <div className="flex items-center gap-2 mb-2 px-2 py-1.5 rounded-xl bg-violet-50 border border-violet-100">
              <span className="text-base">
                {attachedFile.type.startsWith("image/") ? "🖼️" : "📄"}
              </span>
              <span className="text-xs text-violet-700 font-medium truncate flex-1">
                {attachedFile.name}
              </span>
              <button
                onClick={() => {
                  setAttachedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-violet-400 hover:text-violet-600 text-xs font-bold shrink-0"
              >
                ✕
              </button>
            </div>
          )}

          {/* Text input */}
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="w-full bg-transparent text-base text-gray-700 placeholder-gray-400 outline-none disabled:opacity-60 mb-3"
          />

          {/* Action row */}
          <div className="flex items-center justify-between">
            {/* Left actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowSuggestions(false);
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: attachedFile
                    ? "rgba(124,58,237,0.1)"
                    : "rgba(0,0,0,0.04)",
                  border: attachedFile
                    ? "1px solid rgba(124,58,237,0.3)"
                    : "1px solid rgba(0,0,0,0.06)",
                  color: attachedFile ? "#7c3aed" : "#6b7280",
                }}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                {attachedFile ? "1 file" : "Attach"}
              </button>
              <button
                onClick={() => setShowSuggestions((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                style={{
                  background: showSuggestions
                    ? "rgba(124,58,237,0.1)"
                    : "rgba(0,0,0,0.04)",
                  border: showSuggestions
                    ? "1px solid rgba(124,58,237,0.3)"
                    : "1px solid rgba(0,0,0,0.06)",
                  color: showSuggestions ? "#7c3aed" : "#6b7280",
                }}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Suggest
              </button>
            </div>

            {/* Right — send button */}
            <button
              onClick={() => handleSend(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: inputValue.trim()
                  ? "linear-gradient(135deg, #f472b6, #a855f7)"
                  : "rgba(0,0,0,0.1)",
                color: inputValue.trim() ? "white" : "#9ca3af",
                boxShadow: inputValue.trim()
                  ? "0 4px 14px rgba(168,85,247,0.4)"
                  : "none",
              }}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── Welcome state ── */
  if (!hasStartedChat) {
    return (
      <div className="fixed inset-0 flex flex-col overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 min-h-0">
          <div className="welcome-fade-in">
            <GlassOrb />
          </div>
          <div className="text-center welcome-fade-in-delay">
            <h1
              className="text-2xl font-bold mb-1"
              style={{
                background: "linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Sweet Delights Bakery
            </h1>
            <p className="text-sm text-violet-400 font-medium">
              How can I help you today?
            </p>
          </div>
        </div>
        <div className="welcome-fade-in-delay-2">{bottomBar}</div>
      </div>
    );
  }

  /* ── Chat state ── */
  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      <header
        className="flex items-center gap-3 px-5 py-3.5 shrink-0 border-b border-white/40"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-xl shrink-0 shadow-lg orb-float"
          style={{
            background:
              "linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #818cf8 100%)",
            boxShadow: "0 4px 20px rgba(192,132,252,0.4)",
          }}
        >
          🎂
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-bold text-sm leading-tight"
            style={{
              background: "linear-gradient(90deg, #7c3aed, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sweet Delights Bakery
          </p>
          <p className="text-xs text-violet-400 leading-tight font-medium">
            AI Support Assistant
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px] text-green-600 font-medium">Online</span>
        </div>
      </header>

      <div
        className="flex-1 overflow-y-auto py-4 space-y-0.5 min-h-0"
        style={{ background: "transparent" }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {bottomBar}
    </div>
  );
}
