import { NextRequest, NextResponse } from "next/server";

// Get API key from environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `Tu es un assistant IA expert spécialisé dans l'intégration de l'intelligence artificielle dans les workflows d'entreprise. Tu aides les utilisateurs à :

1. **Automatiser leurs processus métier** avec des outils IA
2. **Optimiser leur productivité** grâce à l'IA
3. **Choisir les bons outils IA** pour leur secteur
4. **Mesurer le ROI** de leurs investissements IA
5. **Répondre aux questions générales** sur l'IA, machine learning, etc.

**Ton expertise couvre :**
- Outils IA : ChatGPT, Claude, Notion AI, Zapier, Make.com, Midjourney, etc.
- Domaines : E-commerce, marketing, finance, service client, RH, etc.
- Technologies : Machine learning, NLP, computer vision, automation
- Stratégie : Implémentation progressive, formation équipes, mesure performance

**Ton style de communication :**
- Professionnel mais accessible
- Réponses concises et actionnables
- Exemples concrets et pratiques
- Questions de suivi pour mieux aider
- Toujours en français

Aide l'utilisateur à transformer son entreprise avec l'IA de manière pratique et mesurable.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // Check if API key is configured
    if (!OPENROUTER_API_KEY) {
      console.error("OPENROUTER_API_KEY is not configured");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Prepare messages for OpenRouter
    const formattedMessages: Message[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...messages.map((msg: { isBot: boolean; text: string }) => ({
        role: (msg.isBot ? "assistant" : "user") as "user" | "assistant",
        content: msg.text,
      })),
    ];

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "IA Booster Assistant",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1",
          messages: formattedMessages,
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.9,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: aiResponse,
      usage: data.usage,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
