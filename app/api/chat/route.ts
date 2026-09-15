import { NextRequest, NextResponse } from "next/server";
import {
  NEET_SAATHI_CONTACT_HELP,
  NEET_SAATHI_SYSTEM_PROMPT,
} from "@/lib/neet-saathi-prompt";
import {
  checkRateLimit,
  getClientIp,
  sanitizePlainText,
} from "@/lib/security";
import { SITE_IDENTITY } from "@/app/config/site_identity";

const MAX_MESSAGE = 800;
const MAX_HISTORY = 12;
const MAX_BODY_BYTES = 16_384;

type ChatMessage = { role: "user" | "assistant"; content: string };

function failPayload(message: string) {
  return {
    error: message,
    contact: {
      phone: SITE_IDENTITY.contact.phone,
      email: SITE_IDENTITY.contact.email,
      website: SITE_IDENTITY.website,
      address: SITE_IDENTITY.address.full,
      hours: `Mon–Sat ${SITE_IDENTITY.officeHours.mondayToSaturday}`,
    },
    help: NEET_SAATHI_CONTACT_HELP,
  };
}

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(failPayload("Request too large."), { status: 413 });
    }

    const ip = getClientIp(request);
    const ipLimit = checkRateLimit(`chat:ip:${ip}`, 30, 60 * 60 * 1000);
    if (!ipLimit.allowed) {
      return NextResponse.json(
        failPayload(
          `Too many messages right now. Please try again shortly, or call ${SITE_IDENTITY.contact.phone}.`
        ),
        {
          status: 429,
          headers: { "Retry-After": String(ipLimit.retryAfterSec) },
        }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    if (!apiKey) {
      console.error("OPENROUTER_API_KEY missing");
      return NextResponse.json(
        failPayload(
          `Chat is temporarily unavailable. Please contact ${SITE_IDENTITY.name} at ${SITE_IDENTITY.contact.phone} or ${SITE_IDENTITY.contact.email}.`
        ),
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(failPayload("Invalid request."), { status: 400 });
    }

    const message = sanitizePlainText(
      (body as { message?: string }).message,
      MAX_MESSAGE
    );
    if (!message || message.length < 2) {
      return NextResponse.json(
        failPayload("Please type your question."),
        { status: 400 }
      );
    }

    const rawHistory = (body as { history?: unknown }).history;
    const history: ChatMessage[] = Array.isArray(rawHistory)
      ? rawHistory
          .slice(-MAX_HISTORY)
          .filter(
            (m): m is ChatMessage =>
              !!m &&
              typeof m === "object" &&
              ((m as ChatMessage).role === "user" ||
                (m as ChatMessage).role === "assistant") &&
              typeof (m as ChatMessage).content === "string"
          )
          .map((m) => ({
            role: m.role,
            content: sanitizePlainText(m.content, MAX_MESSAGE),
          }))
          .filter((m) => m.content.length > 0)
      : [];

    const openRouterRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": SITE_IDENTITY.website,
          "X-Title": `${SITE_IDENTITY.name} NeetSaathi`,
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: NEET_SAATHI_SYSTEM_PROMPT },
            ...history.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: message },
          ],
          temperature: 0.65,
          max_tokens: 700,
        }),
      }
    );

    if (!openRouterRes.ok) {
      const errText = await openRouterRes.text().catch(() => "");
      console.error(
        "OpenRouter API error:",
        openRouterRes.status,
        errText.slice(0, 200)
      );
      return NextResponse.json(
        failPayload(
          `I couldn't generate a reply right now. Please try again, or reach ${SITE_IDENTITY.name} at ${SITE_IDENTITY.contact.phone} / ${SITE_IDENTITY.contact.email}.`
        ),
        { status: 502 }
      );
    }

    const data = (await openRouterRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      `Sorry — I couldn't generate an answer. 🙏 Please try again or contact us:\n\n${NEET_SAATHI_CONTACT_HELP}`;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(
      "Chat API error:",
      error instanceof Error ? error.message : "unknown"
    );
    return NextResponse.json(
      failPayload(
        `Something went wrong. Please try again or call ${SITE_IDENTITY.contact.phone}.`
      ),
      { status: 500 }
    );
  }
}
