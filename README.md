# 🎂 Sweet Delights Bakery — AI Customer Support Chatbot

A production-ready AI-powered customer support chatbot for **Sweet Delights Bakery**, a small bakery in Port Harcourt, Nigeria. Built with Next.js 14+, TypeScript, Tailwind CSS v4, and the Groq API (Llama 3.3 70B).

---

## Features

### Chat Interface

- **Messenger-style full-screen layout** with warm animated gradient background
- **Message bubbles** — user messages (blue, right-aligned), bot messages (grey, left-aligned)
- **Timestamps** on every message
- **Auto-scroll** to the latest message
- **Smooth fade-in animation** on each new message

### Typing Indicator

- Three animated bouncing dots appear right after the user sends a message
- Realistic **1–2 second random delay** before bot responds (even for instant predefined answers)
- Replaced automatically with the actual response when ready

### Quick Replies

- Six suggestion chips on load: `View Menu & Prices`, `Opening Hours`, `Location`, `Delivery Info`, `Contact Us`, `Place an Order`
- Tapping a chip returns a **predefined answer instantly** (no API call)
- Context-relevant follow-up chips shown after each reply
- **← All options** chip always available to return to the full menu

### Rich Cards

Predefined quick replies render beautiful interactive cards instead of plain text:

| Quick Reply | Card Type |
| --- | --- |
| Opening Hours | Day-by-day table with open/closed indicators and today highlighted |
| Location | Map card with a "Get Directions" button linking to Google Maps |
| Contact Us | Tappable call button, hours, and address |
| Delivery Info | Structured info card with area, min order, fee, and call button |
| Place an Order | Large call CTA + cake pre-order tip |

### AI Responses (Groq API)

- Free-form messages not matching a predefined trigger → sent to **Groq API** (Llama 3.3 70B)
- Full conversation history passed for context-aware multi-turn replies
- System prompt strictly scopes the bot to bakery topics
- Graceful in-chat error messages for rate limits and network failures

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| AI | Groq `llama-3.3-70b-versatile` via `groq-sdk` |
| State | React hooks (`useState`, `useEffect`, `useRef`, `useCallback`) |

---

## Project Structure

```
aichatbot/
├── app/
│   ├── api/chat/route.ts          # Groq API endpoint
│   ├── globals.css                # Animations: typing bounce, float, fade-in
│   ├── icon.svg                   # Favicon (cake icon)
│   ├── layout.tsx                 # Root layout + metadata
│   └── page.tsx                   # Root page → background + ChatWindow
├── components/
│   ├── ChatWindow.tsx             # All state logic + layout
│   ├── FloatingDecors.tsx         # Animated background SVG shapes
│   ├── MessageBubble.tsx          # Message bubble + rich card renderers
│   ├── QuickReplies.tsx           # Suggestion chips + All options reset
│   └── TypingIndicator.tsx        # Animated three-dot bubble
├── lib/
│   ├── predefined-responses.ts    # Q&A data, quick reply lists, matcher
│   └── types.ts                   # Message, RichCard, PredefinedEntry types
├── .env.local                     # GROQ_API_KEY (not committed)
└── README.md
```

---

## Business Data

| | |
| --- | --- |
| **Location** | Avenue 123, Port Harcourt, Rivers State |
| **Phone** | 08125888459 |
| **Hours** | Mon–Sat, 8:00 AM – 7:00 PM · Closed Sundays |
| **Delivery** | Port Harcourt only · Min ₦5,000 · Fee ₦1,000 |

### Menu

| Item | Price |
| --- | --- |
| Meat Pie | ₦500 |
| Chicken Pie | ₦700 |
| Sausage Roll | ₦400 |
| Chin Chin (pack) | ₦1,500 |
| Doughnut (each) | ₦300 |
| Birthday Cake — Small | ₦15,000 |
| Birthday Cake — Medium | ₦25,000 |
| Birthday Cake — Large | ₦40,000 |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your API key

```bash
# .env.local
GROQ_API_KEY=your_api_key_here
```

Get a free key at [console.groq.com](https://console.groq.com). No billing required. Predefined quick replies work without any API key — only free-form AI responses require one.

### 3. Run the dev server

```bash
npm run dev
# → http://localhost:3000
```

---

## How It Works

```
User sends a message
      ↓
Typing indicator appears (1–2 s delay)
      ↓
    Exact match in predefined-responses.ts?
    ├── YES → return rich card / hardcoded response instantly (no API call)
    └── NO  → POST /api/chat with conversation history
                    ↓
              Groq (Llama 3.3 70B) responds
                    ↓
        Bot bubble replaces typing indicator
```

---

## Customisation

| What | Where |
| --- | --- |
| Menu, prices, hours, quick reply text | `lib/predefined-responses.ts` |
| Rich card content (hours, address, phone) | `lib/predefined-responses.ts` |
| AI personality / bakery data | System prompt in `app/api/chat/route.ts` |
| AI model | `model` field in `app/api/chat/route.ts` |
| Primary colour (`#0084FF`) | `ChatWindow.tsx`, `MessageBubble.tsx`, `QuickReplies.tsx` |
| Background gradient | `app/page.tsx` |
| Floating decorations | `components/FloatingDecors.tsx` |

---

## Groq Free Tier Limits

| Limit | llama-3.3-70b-versatile |
| --- | --- |
| Requests / minute | 30 |
| Requests / day | 1,000 |
| Tokens / minute | 12,000 |
| Tokens / day | 100,000 |

For higher volume, swap to `llama-3.1-8b-instant` (14,400 req/day) in `app/api/chat/route.ts`.

---

## Deployment (Vercel)

```bash
npx vercel
```

Add `GROQ_API_KEY` under **Settings → Environment Variables** in your Vercel project.

---

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `GROQ_API_KEY` | Yes (for AI replies) | Groq API key from console.groq.com |

---

## License

MIT
