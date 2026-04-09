"use client";

import { useState, useEffect } from "react";
import type { Message } from "@/lib/types";

interface Props {
  message: Message;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function renderText(text: string) {
  return text.split("\n").map((line, lineIdx, lines) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const rendered = parts.map((part, partIdx) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={partIdx}>{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );
    return (
      <span key={lineIdx}>
        {rendered}
        {lineIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`flex items-end gap-2 px-4 py-1 message-fade-in ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Bot avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#0084FF] flex items-center justify-center shrink-0 text-white text-xs shadow-sm self-start mt-1">
          🎂
        </div>
      )}

      <div
        className={`flex flex-col gap-1 max-w-[85%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {/* Text bubble */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-[#0084FF] text-white rounded-br-sm"
              : "bg-[#E4E6EB] text-gray-800 rounded-bl-sm"
          }`}
        >
          {renderText(message.content)}
        </div>

        {/* Menu cards */}
        {message.menuSections && message.menuSections.length > 0 && (
          <div className="w-full space-y-3 mt-1">
            {message.menuSections.map((section) => (
              <div key={section.title}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
                  {section.title}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {section.items.map((item) => (
                    <div
                      key={item.name}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
                    >
                      {/* Image area */}
                      <div className="bg-linear-to-br from-orange-50 to-yellow-50 h-16 flex items-center justify-center text-4xl">
                        {item.emoji}
                      </div>
                      {/* Info */}
                      <div className="px-2.5 py-2">
                        <p className="text-xs font-medium text-gray-800 leading-tight">
                          {item.name}
                        </p>
                        <p className="text-xs font-bold text-[#0084FF] mt-0.5">
                          {item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[11px] text-gray-400 px-1">
          {mounted ? formatTime(message.timestamp) : ""}
        </span>
      </div>
    </div>
  );
}
