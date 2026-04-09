import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a friendly and helpful customer support chatbot for Sweet Delights Bakery, a small bakery in Lagos, Nigeria.

## About Sweet Delights Bakery
- Location: Rd 123, Port Harcourt, Rivers State
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
- Available within Lagos Island only
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

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid messages format." },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-0",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const text =
      textBlock?.type === "text"
        ? textBlock.text
        : "I'm sorry, I couldn't process that. Please try again or call us at 08125888459. 🙏";

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Claude API error:", error);

    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        {
          error:
            "I'm a little busy right now! Please try again in a moment. 😊",
        },
        { status: 429 }
      );
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        {
          error:
            "Configuration error. Please contact the bakery directly at 08125888459.",
        },
        { status: 401 }
      );
    }
    if (error instanceof Anthropic.BadRequestError) {
      const message =
        (error.error as { error?: { message?: string } })?.error?.message ?? "";
      if (message.toLowerCase().includes("credit")) {
        return NextResponse.json(
          {
            error:
              "The AI assistant is temporarily unavailable. Please call us directly at 08125888459 — we're happy to help! 😊",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          "Oops! Something went wrong. Please try again or call us at 08125888459. 🙏",
      },
      { status: 500 }
    );
  }
}
