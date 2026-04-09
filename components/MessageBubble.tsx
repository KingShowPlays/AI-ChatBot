"use client";

import { useState, useEffect } from "react";
import type { Message, RichCard, HoursRow } from "@/lib/types";

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

/* ── Rich card renderers ── */

function HoursCard({ rows }: { rows: HoursRow[] }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full mt-1">
      <div className="bg-[#0084FF] px-4 py-3 flex items-center gap-2">
        <span className="text-lg">🕐</span>
        <p className="text-white font-semibold text-sm">Opening Hours</p>
      </div>
      <div className="divide-y divide-gray-50">
        {rows.map((row) => {
          const isToday = row.day === today;
          return (
            <div
              key={row.day}
              className={`flex items-center justify-between px-4 py-2.5 ${
                isToday ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    row.open ? "bg-green-400" : "bg-red-400"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isToday
                      ? "font-bold text-[#0084FF]"
                      : "font-medium text-gray-700"
                  }`}
                >
                  {row.day}
                  {isToday && (
                    <span className="ml-1.5 text-[10px] font-semibold bg-[#0084FF] text-white px-1.5 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </span>
              </div>
              <span
                className={`text-xs font-medium ${
                  row.open ? "text-gray-600" : "text-red-500"
                }`}
              >
                {row.hours}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LocationCard({
  address,
  landmark,
}: {
  address: string;
  landmark?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full mt-1">
      {/* Map placeholder */}
      <div className="bg-linear-to-br from-green-50 to-emerald-100 h-24 flex items-center justify-center relative">
        <div className="text-5xl">🗺️</div>
      </div>
      <div className="px-4 py-3 space-y-1">
        <p className="text-sm font-semibold text-gray-800 flex items-start gap-1.5">
          <span className="shrink-0 mt-0.5">📍</span>
          {address}
        </p>
        {landmark && (
          <p className="text-xs text-gray-400 pl-5">{landmark}</p>
        )}
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center justify-center gap-1.5 w-full bg-[#0084FF] text-white text-xs font-semibold py-2 rounded-xl hover:bg-blue-600 active:scale-95 transition-all"
        >
          Get Directions →
        </a>
      </div>
    </div>
  );
}

function ContactCard({
  phone,
  hours,
  address,
}: {
  phone: string;
  hours: string;
  address: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full mt-1">
      <div className="bg-[#0084FF] px-4 py-3 flex items-center gap-2">
        <span className="text-lg">📞</span>
        <p className="text-white font-semibold text-sm">Contact Us</p>
      </div>
      <div className="px-4 py-3 space-y-3">
        <a
          href={`tel:${phone}`}
          className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[#0084FF] flex items-center justify-center text-white text-base shrink-0">
            📲
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Call us</p>
            <p className="text-sm font-bold text-[#0084FF]">{phone}</p>
          </div>
        </a>
        <div className="flex items-start gap-3 px-1">
          <span className="text-base shrink-0 mt-0.5">🕐</span>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Hours</p>
            <p className="text-xs font-medium text-gray-700">{hours}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 px-1">
          <span className="text-base shrink-0 mt-0.5">📍</span>
          <div>
            <p className="text-[11px] text-gray-400 font-medium">Address</p>
            <p className="text-xs font-medium text-gray-700">{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeliveryCard({
  area,
  minOrder,
  fee,
  phone,
}: {
  area: string;
  minOrder: string;
  fee: string;
  phone: string;
}) {
  const rows = [
    { label: "Delivery Area", value: area, icon: "📍" },
    { label: "Minimum Order", value: minOrder, icon: "🛒" },
    { label: "Delivery Fee", value: fee, icon: "💳" },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full mt-1">
      <div className="bg-[#0084FF] px-4 py-3 flex items-center gap-2">
        <span className="text-lg">🚚</span>
        <p className="text-white font-semibold text-sm">Delivery Info</p>
      </div>
      <div className="px-4 py-3 space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">{row.icon}</span>
              <span className="text-xs text-gray-500">{row.label}</span>
            </div>
            <span className="text-xs font-semibold text-gray-800">
              {row.value}
            </span>
          </div>
        ))}
        <div className="border-t border-gray-100 pt-2.5 mt-1">
          <p className="text-[11px] text-gray-400 mb-2">
            To arrange delivery, call us during business hours:
          </p>
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-1.5 w-full bg-[#0084FF] text-white text-xs font-semibold py-2 rounded-xl hover:bg-blue-600 active:scale-95 transition-all"
          >
            📞 Call {phone}
          </a>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ phone, cakeNote }: { phone: string; cakeNote: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full mt-1">
      <div className="bg-[#0084FF] px-4 py-3 flex items-center gap-2">
        <span className="text-lg">🛍️</span>
        <p className="text-white font-semibold text-sm">Place an Order</p>
      </div>
      <div className="px-4 py-3 space-y-3">
        <p className="text-xs text-gray-500">
          Call us during business hours (Mon–Sat, 8AM–7PM) to place your order:
        </p>
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-1.5 w-full bg-[#0084FF] text-white text-sm font-bold py-3 rounded-xl hover:bg-blue-600 active:scale-95 transition-all"
        >
          📞 {phone}
        </a>
        <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2.5">
          <span className="text-base shrink-0">🎂</span>
          <p className="text-xs text-yellow-800">{cakeNote}</p>
        </div>
      </div>
    </div>
  );
}

function RichCardRenderer({ card }: { card: RichCard }) {
  switch (card.type) {
    case "hours":
      return <HoursCard rows={card.rows} />;
    case "location":
      return <LocationCard address={card.address} landmark={card.landmark} />;
    case "contact":
      return (
        <ContactCard
          phone={card.phone}
          hours={card.hours}
          address={card.address}
        />
      );
    case "delivery":
      return (
        <DeliveryCard
          area={card.area}
          minOrder={card.minOrder}
          fee={card.fee}
          phone={card.phone}
        />
      );
    case "order":
      return <OrderCard phone={card.phone} cakeNote={card.cakeNote} />;
  }
}

/* ── Main component ── */

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

        {/* Rich card */}
        {message.richCard && <RichCardRenderer card={message.richCard} />}

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
                      <div className="bg-linear-to-br from-orange-50 to-yellow-50 h-16 flex items-center justify-center text-4xl">
                        {item.emoji}
                      </div>
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
