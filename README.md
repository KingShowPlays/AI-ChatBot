# 🎂 Sweet Delights Bakery — AI Customer Support Chatbot

A production-ready AI-powered customer support chatbot for **Sweet Delights Bakery**, a small bakery on Port Harcourt, Nigeria. Built with Next.js 14+, TypeScript, Tailwind CSS v4, and the Anthropic Claude API.

---

## Features

### Chat Interface

- **Messenger-style layout** — full-screen on mobile, centered card on desktop
- **Animated background** — warm gradient with floating bakery-themed SVG decorations
- **Message bubbles** — user messages (blue, right-aligned), bot messages (white, left-aligned)
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

### AI Responses (Claude API)

- Free-form messages not matching a predefined trigger → sent to **Claude API**
- Full conversation history passed for context-aware multi-turn replies
- System prompt strictly scopes the bot to bakery topics
- Graceful in-chat error messages for rate limits, billing, and network failures

---

## Tech Stack

| Layer     | Technology                                                     |
| --------- | -------------------------------------------------------------- |
| Framework | Next.js 14+ (App Router)                                       |
| Language  | TypeScript                                                     |
| Styling   | Tailwind CSS v4                                                |
| AI        | Anthropic Claude `claude-sonnet-4-0` via `@anthropic-ai/sdk`   |
| State     | React hooks (`useState`, `useEffect`, `useRef`, `useCallback`) |

---

## Project Structure

```
aichatbot/
├── app/
│   ├── api/chat/route.ts          # Claude API endpoint
│   ├── globals.css                # Animations: typing bounce, float, fade-in
│   ├── icon.svg                   # Favicon (cake icon)
│   ├── layout.tsx                 # Root layout + metadata
│   └── page.tsx                   # Root page → background + ChatWindow card
├── components/
│   ├── ChatWindow.tsx             # All state logic + layout
│   ├── FloatingDecors.tsx         # Animated background SVG shapes
│   ├── MessageBubble.tsx          # Message bubble + markdown-lite renderer
│   ├── QuickReplies.tsx           # Suggestion chips + All options reset
│   └── TypingIndicator.tsx        # Animated three-dot bubble
├── lib/
│   ├── predefined-responses.ts    # Q&A data, quick reply lists, matcher
│   └── types.ts                   # Message, PredefinedEntry interfaces
├── .env.local                     # ANTHROPIC_API_KEY (not committed)
└── README.md
```

---

## Business Data

|              |                                              |
| ------------ | -------------------------------------------- |
| **Location** | Rd 123, Port Harcourt, Rivers State          |
| **Phone**    | 08125888459                                  |
| **Hours**    | Mon–Sat, 8:00 AM – 7:00 PM · Closed Sundays  |
| **Delivery** | Port Harcourt only · Min ₦5,000 · Fee ₦1,000 |

### Menu

| Item                   | Price   |
| ---------------------- | ------- |
| Meat Pie               | ₦500    |
| Chicken Pie            | ₦700    |
| Sausage Roll           | ₦400    |
| Chin Chin (pack)       | ₦1,500  |
| Doughnut (each)        | ₦300    |
| Birthday Cake — Small  | ₦15,000 |
| Birthday Cake — Medium | ₦25,000 |
| Birthday Cake — Large  | ₦40,000 |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your API key

```bash
# .env.local
ANTHROPIC_API_KEY=your_api_key_here
```

Get a key at [console.anthropic.com](https://console.anthropic.com). Predefined quick replies work without credits — only free-form AI responses require a funded account.

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
    ├── YES → return hardcoded response instantly (no API call)
    └── NO  → POST /api/chat with conversation history
                    ↓
              Claude responds
                    ↓
        Bot bubble replaces typing indicator
```

---

## Customisation

| What                                  | Where                                                     |
| ------------------------------------- | --------------------------------------------------------- |
| Menu, prices, hours, quick reply text | `lib/predefined-responses.ts`                             |
| AI personality / bakery data          | System prompt in `app/api/chat/route.ts`                  |
| AI model                              | `model` field in `app/api/chat/route.ts`                  |
| Primary colour (`#0084FF`)            | `ChatWindow.tsx`, `MessageBubble.tsx`, `QuickReplies.tsx` |
| Background gradient                   | `app/page.tsx`                                            |
| Floating decorations                  | `components/FloatingDecors.tsx`                           |

---

## Deployment (Vercel)

```bash
npx vercel
```

Add `ANTHROPIC_API_KEY` under **Settings → Environment Variables** in your Vercel project.

---

## Environment Variables

| Variable            | Required             | Description                                  |
| ------------------- | -------------------- | -------------------------------------------- |
| `ANTHROPIC_API_KEY` | Yes (for AI replies) | Anthropic API key from console.anthropic.com |

---

## License

MIT
