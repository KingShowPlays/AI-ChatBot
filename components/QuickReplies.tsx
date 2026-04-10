interface Props {
  replies: string[];
  onSelect: (reply: string) => void;
  onReset?: () => void;
  disabled: boolean;
}

const REPLY_ICONS: Record<string, string> = {
  "View Menu & Prices": "🍰",
  "Opening Hours": "🕐",
  "Location": "📍",
  "Delivery Info": "🚚",
  "Contact Us": "📞",
  "Place an Order": "🛍️",
};

export default function QuickReplies({ replies, onSelect, onReset, disabled }: Props) {
  if (replies.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {onReset && (
        <button
          onClick={onReset}
          disabled={disabled}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all disabled:opacity-40"
          style={{
            background: "rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.08)",
            color: "#9ca3af",
          }}
        >
          ← All
        </button>
      )}
      {replies.map((reply) => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(167,139,250,0.4)",
            color: "#7c3aed",
            backdropFilter: "blur(8px)",
          }}
        >
          {REPLY_ICONS[reply] && (
            <span className="text-xs">{REPLY_ICONS[reply]}</span>
          )}
          {reply}
        </button>
      ))}
    </div>
  );
}
