import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a friendly and helpful customer support chatbot for Sweet Delights Bakery, a small bakery in Port Harcourt, Nigeria.

## About Sweet Delights Bakery
- Location: Avenue 123, Port Harcourt, Rivers State
- Phone: 08125888459
- Hours: Monday to Saturday, 8:00 AM – 7:00 PM. Closed on Sundays.

## Menu & Prices
Snacks & Pastries:
- Meat Pie: ₦500
- Chicken Pie: ₦700
- Sausage Roll: ₦400
- Chin Chin (pack): ₦1,500
- Doughnut (each): ₦300

Birthday Cakes:
- Small Birthday Cake: ₦15,000
- Medium Birthday Cake: ₦25,000
- Large Birthday Cake: ₦40,000

## Delivery Policy
- Available within Port Harcourt only
- Minimum order: ₦5,000
- Delivery fee: ₦1,000
- Orders placed by calling during business hours

## Instructions
- Only answer questions related to Sweet Delights Bakery
- Be warm, friendly, and conversational
- Keep responses concise (2–4 sentences max unless listing items)
- Always use ₦ for prices
- For cake orders, recommend calling 2–3 days in advance
- If asked about something unrelated, politely redirect to bakery topics`;

type GroqMessage = { role: "user" | "assistant" | "system"; content: string };

async function callGroq(messages: GroqMessage[], attempt = 1): Promise<string> {
  const MAX_ATTEMPTS = 3;
  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 512,
      messages,
    });
    return (
      response.choices[0]?.message?.content ??
      "I'm sorry, I couldn't process that. Please try again or call us at 08125888459. 🙏"
    );
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "";
    const isRetryable =
      errMsg.includes("ETIMEDOUT") ||
      errMsg.includes("fetch failed") ||
      errMsg.includes("Connection error") ||
      errMsg.includes("ECONNRESET") ||
      errMsg.includes("socket");

    if (isRetryable && attempt < MAX_ATTEMPTS) {
      const delay = attempt * 1000; // 1s, 2s
      await new Promise((r) => setTimeout(r, delay));
      return callGroq(messages, attempt + 1);
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid messages format." },
        { status: 400 }
      );
    }

    const groqMessages: GroqMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const text = await callGroq(groqMessages);
    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Groq API error:", error);

    const errMsg = error instanceof Error ? error.message : "";

    if (errMsg.includes("429") || errMsg.includes("quota")) {
      return NextResponse.json(
        { error: "I'm a little busy right now! Please try again in a moment. 😊" },
        { status: 429 }
      );
    }
    if (errMsg.includes("401") || errMsg.includes("API_KEY")) {
      return NextResponse.json(
        { error: "Configuration error. Please contact the bakery directly at 08125888459." },
        { status: 401 }
      );
    }
    if (
      errMsg.includes("ETIMEDOUT") ||
      errMsg.includes("fetch failed") ||
      errMsg.includes("Connection error")
    ) {
      return NextResponse.json(
        { error: "Connection timed out after 3 attempts. Please check your internet and try again. 🙏" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Oops! Something went wrong. Please try again or call us at 08125888459. 🙏" },
      { status: 500 }
    );
  }
}
