# GES Group One — AI Chatbot

**University of Port Harcourt**  
**Department of Computer Science**  
**Group Project**

A production-ready AI-powered customer support chatbot we developed for **Sweet Delights Bakery**, a small bakery in Port Harcourt, Nigeria. We built this application using Next.js 16, TypeScript, Tailwind CSS v4, and the Groq API (Llama 3.3 70B) to demonstrate modern web development practices and AI integration.

---

## 👥 Group Members

| Name | Matric Number |
| --- | --- |
| [Christian Kingdavid] | [U2022/5570005] |
| [Member 2 Name] | [Matric Number] |
| [Member 3 Name] | [Matric Number] |
| [Member 4 Name] | [Matric Number] |
| [Member 5 Name] | [Matric Number] |
| [Member 6 Name] | [Matric Number] |
| [Member 7 Name] | [Matric Number] |
| [Member 8 Name] | [Matric Number] |
| [Member 9 Name] | [Matric Number] |
| [Member 10 Name] | [Matric Number] |

---

## 📋 Project Overview

For this project, we set out to create a modern, AI-powered customer support chatbot that could handle real-world business needs. We chose Sweet Delights Bakery as our use case — a local bakery in Port Harcourt that needed an automated way to answer customer questions about their menu, prices, hours, and delivery options.

Our solution combines predefined responses for common queries (for instant replies) with AI-powered responses (using Groq's Llama 3.3 70B model) for more complex or open-ended questions. This hybrid approach ensures fast, accurate responses while maintaining the flexibility to handle unexpected customer inquiries.

### What We Built

We developed a full-stack web application with:
- A responsive, mobile-first chat interface with smooth animations
- Intelligent message routing (predefined vs. AI responses)
- Rich interactive cards for displaying menus, hours, location, and contact info
- Real-time typing indicators for better user experience
- Quick reply buttons for common questions
- File attachment support for future enhancements
- Conversation history management for context-aware AI responses

---

## 🎯 Features

### Chat Interface

We designed a **Messenger-style full-screen layout** with:
- Warm animated gradient background for visual appeal
- **Message bubbles** — user messages appear in blue on the right, bot messages in grey on the left
- **Timestamps** on every message for conversation tracking
- **Auto-scroll** functionality that automatically scrolls to the latest message
- **Smooth fade-in animations** on each new message for polished UX

### Typing Indicator

We implemented a realistic typing experience:
- Three animated bouncing dots appear immediately after the user sends a message
- **1–2 second random delay** before the bot responds (even for instant predefined answers)
- The indicator is automatically replaced with the actual response when ready
- This creates a more natural, human-like conversation flow

### Quick Replies

We created an intuitive quick reply system:
- Six suggestion chips displayed on initial load: `View Menu & Prices`, `Opening Hours`, `Location`, `Delivery Info`, `Contact Us`, `Place an Order`
- Tapping a chip returns a **predefined answer instantly** (no API call needed)
- Context-relevant follow-up chips are shown after each reply
- **← All options** chip is always available to return to the full menu
- Horizontal scrolling for mobile responsiveness

### Rich Interactive Cards

We designed beautiful interactive cards for predefined quick replies instead of plain text responses:

| Quick Reply | Card Type | What We Implemented |
| --- | --- | --- |
| Opening Hours | Day-by-day table | Open/closed indicators with today highlighted in purple |
| Location | Map card | "Get Directions" button linking to Google Maps with the bakery's address |
| Contact Us | Contact card | Tappable call button, business hours, and full address |
| Delivery Info | Info card | Structured display of delivery area, minimum order, fee, and call button |
| Place an Order | Order CTA | Large call-to-action button with cake pre-order reminder |
| View Menu & Prices | Menu sections | Categorized items with emojis and prices in Nigerian Naira |

### AI-Powered Responses (Groq API)

We integrated the Groq API for handling complex queries:
- Free-form messages that don't match predefined triggers are sent to **Groq API** (Llama 3.3 70B)
- Full conversation history is passed to the API for context-aware, multi-turn conversations
- We crafted a system prompt that strictly scopes the bot to bakery-related topics
- Graceful error handling with in-chat error messages for rate limits and network failures
- The AI maintains the bakery's friendly, helpful tone throughout conversations

---

## 🛠️ Tech Stack & Implementation

We chose modern, industry-standard technologies for this project:

| Layer | Technology | Why We Chose It |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router) | Server-side rendering, API routes, and excellent developer experience |
| Language | **TypeScript** | Type safety and better code maintainability |
| Styling | **Tailwind CSS v4** | Utility-first CSS for rapid UI development |
| AI | **Groq API** with `llama-3.3-70b-versatile` | Fast, free-tier AI inference for natural language processing |
| State Management | React hooks | `useState`, `useEffect`, `useRef`, `useCallback` for efficient state handling |
| HTTP Client | Native `fetch` API | Built-in, no additional dependencies needed |

### Key Code Components We Developed

1. **`app/api/chat/route.ts`** — We created a Next.js API route that:
   - Receives conversation history from the frontend
   - Sends it to Groq API with our custom system prompt
   - Returns the AI-generated response
   - Handles errors gracefully

2. **`components/ChatWindow.tsx`** — The main component where we implemented:
   - All state management logic (messages, typing indicators, loading states)
   - Message sending and receiving logic
   - Quick reply handling
   - Predefined vs. AI response routing
   - Auto-scrolling behavior
   - File attachment UI (prepared for future enhancements)

3. **`components/MessageBubble.tsx`** — We built custom renderers for:
   - User and bot message bubbles with different styling
   - Rich card components (hours table, location map, contact info, etc.)
   - Menu sections with categorized items
   - Responsive design for mobile and desktop

4. **`components/QuickReplies.tsx`** — We implemented:
   - Horizontal scrolling chip layout
   - Active state management
   - "All options" reset functionality
   - Disabled state during loading

5. **`components/TypingIndicator.tsx`** — We created:
   - Animated three-dot bouncing effect
   - Smooth CSS animations for realistic typing simulation

6. **`lib/predefined-responses.ts`** — We defined:
   - All predefined Q&A pairs
   - Rich card data structures
   - Follow-up suggestion logic
   - Message matching algorithm

7. **`lib/types.ts`** — We established TypeScript interfaces for:
   - Message objects
   - Rich card types
   - Menu sections
   - Predefined entry structures

---

## 📁 Project Structure

We organized our codebase as follows:

```
aichatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Groq API endpoint we created
│   ├── globals.css                # Custom animations (typing bounce, float, fade-in)
│   ├── favicon.ico                # Cake icon
│   ├── layout.tsx                 # Root layout with metadata
│   └── page.tsx                   # Root page with background and ChatWindow
├── components/
│   ├── ChatWindow.tsx             # Main chat logic and state management
│   ├── MessageBubble.tsx          # Message rendering and rich cards
│   ├── QuickReplies.tsx           # Suggestion chips component
│   └── TypingIndicator.tsx        # Animated typing dots
├── lib/
│   ├── predefined-responses.ts    # Q&A data, quick replies, matcher function
│   └── types.ts                   # TypeScript type definitions
├── .env.local                     # Environment variables (GROQ_API_KEY)
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
└── README.md                      # This file
```

---

## 🏪 Business Data We Used

For our demo, we used realistic business data for Sweet Delights Bakery:

| | |
| --- | --- |
| **Location** | Avenue 123, Port Harcourt, Rivers State |
| **Phone** | 08125888459 |
| **Hours** | Mon–Sat, 8:00 AM – 7:00 PM · Closed Sundays |
| **Delivery** | Port Harcourt only · Min ₦5,000 · Fee ₦1,000 |

### Menu We Implemented

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

## 🚀 Getting Started

To run our project locally, follow these steps:

### 1. Install Dependencies

We used npm for package management:

```bash
npm install
```

This installs all required packages including:
- `next` (v16.2.3) — The React framework
- `react` & `react-dom` (v19.2.4) — React library
- `groq-sdk` (v1.1.2) — Groq API client
- `typescript` (v5) — TypeScript compiler
- `tailwindcss` (v4) — CSS framework
- And other dev dependencies

### 2. Configure Your API Key

We use environment variables to securely store the Groq API key:

```bash
# Create a .env.local file in the root directory
GROQ_API_KEY=your_api_key_here
```

**How to get a Groq API key:**
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for a free account (no billing required)
3. Generate an API key from the dashboard
4. Copy it to your `.env.local` file

**Note:** Predefined quick replies work without any API key — only free-form AI responses require one.

### 3. Run the Development Server

We use Next.js's built-in development server:

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

### 4. Build for Production

To create an optimized production build:

```bash
npm run build
npm start
```

---

## 🔄 How Our System Works

We implemented a hybrid response system that intelligently routes messages:

```
User sends a message
      ↓
Typing indicator appears (1–2 second delay for realism)
      ↓
    Does the message exactly match a predefined trigger?
    ├── YES → Return rich card / hardcoded response instantly
    │         (No API call, instant response)
    │         Examples: "View Menu & Prices", "Opening Hours"
    │
    └── NO  → POST to /api/chat with full conversation history
                    ↓
              Groq API (Llama 3.3 70B) processes the request
                    ↓
              AI generates contextual response
                    ↓
        Bot bubble replaces typing indicator
```

### Code Flow We Implemented

1. **User Input** → `ChatWindow.tsx` captures the message
2. **State Update** → We add the user message to the messages array
3. **Typing Indicator** → We show the typing animation
4. **Response Routing** → We check `findPredefinedResponse()` in `predefined-responses.ts`
   - **Match found** → Return predefined response with rich cards
   - **No match** → Call `/api/chat` endpoint
5. **API Call** (if needed) → `route.ts` sends conversation to Groq
6. **Response Display** → We add bot message to messages array
7. **Follow-ups** → We update quick reply chips based on the response

---

## 🎨 Customization Guide

We designed the system to be easily customizable. Here's what you can modify:

| What to Customize | Where to Edit | What We Did |
| --- | --- | --- |
| Menu, prices, hours | `lib/predefined-responses.ts` | Defined all bakery data in structured format |
| Quick reply text | `lib/predefined-responses.ts` | Created trigger phrases and follow-up suggestions |
| Rich card content | `lib/predefined-responses.ts` | Built data structures for hours, location, contact, etc. |
| AI personality | `app/api/chat/route.ts` | Wrote system prompt to define bot behavior |
| AI model | `app/api/chat/route.ts` | Selected `llama-3.3-70b-versatile` for quality |
| Primary color | `ChatWindow.tsx`, `MessageBubble.tsx` | Used purple/pink gradient theme |
| Background gradient | `app/page.tsx` | Created warm purple gradient background |
| Animations | `app/globals.css` | Implemented fade-in, float, and bounce effects |

### Example: Changing the AI Model

In `app/api/chat/route.ts`, we used:

```typescript
const completion = await groq.chat.completions.create({
  messages: [systemMessage, ...messages],
  model: "llama-3.3-70b-versatile", // ← Change this
  temperature: 0.7,
  max_tokens: 500,
});
```

For faster responses with higher rate limits, you could change to `llama-3.1-8b-instant`.

---

## 📊 Groq API Free Tier Limits

We chose Groq for its generous free tier:

| Limit | llama-3.3-70b-versatile |
| --- | --- |
| Requests / minute | 30 |
| Requests / day | 1,000 |
| Tokens / minute | 12,000 |
| Tokens / day | 100,000 |

For higher volume applications, we could switch to `llama-3.1-8b-instant` which offers:
- 14,400 requests/day
- Faster response times
- Slightly lower quality responses

---

## 🌐 Deployment

We recommend deploying to Vercel (Next.js's hosting platform):

### Deploy to Vercel

**Important:** After deployment, add your `GROQ_API_KEY` in:
- Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

The application will automatically rebuild with the environment variable.

---

## 🔐 Environment Variables

We use the following environment variables:

| Variable | Required | Description | Where to Get It |
| --- | --- | --- | --- |
| `GROQ_API_KEY` | Yes (for AI) | Groq API authentication key | [console.groq.com](https://console.groq.com) |

**Security Note:** We added `.env.local` to `.gitignore` to prevent accidentally committing API keys.

---

## 💡 Technical Challenges We Solved

During development, we encountered and solved several challenges:

1. **Realistic Typing Delay** — We added a random 1-2 second delay even for instant predefined responses to make the bot feel more natural.

2. **Auto-Scrolling** — We used `useRef` and `scrollIntoView` to automatically scroll to new messages without disrupting user interaction.

3. **Context-Aware AI** — We pass the full conversation history to Groq so the AI can reference previous messages.

4. **Rich Card Rendering** — We created a flexible card system that can render different types of content (tables, buttons, maps) based on the response type.

5. **Mobile Responsiveness** — We used Tailwind's responsive utilities and horizontal scrolling for quick replies to ensure the app works on all screen sizes.

6. **Error Handling** — We implemented graceful error messages that appear in the chat when API calls fail, rather than breaking the UI.

---

## 🎓 What We Learned

Through this project, we gained hands-on experience with:

- **Next.js 16 App Router** — Server components, API routes, and modern React patterns
- **TypeScript** — Type-safe development and interface design
- **AI Integration** — Working with LLM APIs and prompt engineering
- **State Management** — Complex React state with hooks
- **UI/UX Design** — Creating smooth animations and intuitive interfaces
- **API Design** — Building RESTful endpoints with error handling
- **Deployment** — Environment variables and production builds

---

## 📝 Future Enhancements

Given more time, we could add:

- **User Authentication** — Allow customers to save order history
- **Order Placement** — Direct ordering through the chat interface
- **Payment Integration** — Accept payments via Paystack or Flutterwave
- **Admin Dashboard** — View conversations and analytics
- **Multi-language Support** — Support for Pidgin English and other local languages
- **Voice Input** — Speech-to-text for accessibility
- **Image Recognition** — Upload cake photos for custom design quotes
- **WhatsApp Integration** — Connect the bot to WhatsApp Business API

---

## 🙏 Acknowledgments

We would like to thank:
- **University of Port Harcourt** — For providing the opportunity to work on this project
- **Groq** — For providing free access to their AI API
- **Vercel** — For Next.js and hosting platform
- **The Open Source Community** — For the amazing tools and libraries we used

---

**Developed with ❤️ by GES Group 1 Computer Science Students at University of Port Harcourt**
