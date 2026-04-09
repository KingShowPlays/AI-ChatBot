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

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [quickReplies, setQuickReplies] = useState<string[]>(
    INITIAL_QUICK_REPLIES
  );
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<Message[]>([WELCOME_MESSAGE]);

  // Keep ref in sync with state for use inside async handlers
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
      setQuickReplies([]);
      setIsTyping(true);
      setIsLoading(true);

      // Minimum realistic delay: 1–2 seconds
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
        };
        setMessages((prev) => [...prev, botMessage]);
        setQuickReplies(predefined.followUps);
      } else {
        // Build conversation history for the API (must start with user role)
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
    [isLoading]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5]">
      {/* Header */}
      <header className="bg-[#0084FF] text-white px-4 py-3 flex items-center gap-3 shadow-md flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl flex-shrink-0">
          🎂
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight truncate">
            Sweet Delights Bakery
          </p>
          <p className="text-xs text-blue-100 leading-tight">
            AI Support Assistant
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-blue-100">Online</span>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-0.5">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom: quick replies + input */}
      <div className="bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] shrink-0">
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

        {/* Input bar */}
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex-1 flex items-center bg-[#F0F2F5] rounded-full px-4 ring-0 focus-within:ring-2 focus-within:ring-[#0084FF]/30 transition">
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
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1 bg-transparent py-2.5 text-sm text-gray-800
                         placeholder-gray-400 outline-none disabled:opacity-60"
            />
          </div>
          <button
            onClick={() => handleSend(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            className="w-10 h-10 rounded-full bg-[#0084FF] text-white flex items-center justify-center
                       flex-shrink-0 hover:bg-blue-600 active:scale-95 transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            aria-label="Send message"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 translate-x-0.5"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
