import { NextRequest, NextResponse } from "next/server";
import { genererRecommandationsIA } from "@/lib/ai-service";
import { ReponsesFormulaire } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reponses: Partial<ReponsesFormulaire> = body.reponses;

    if (!reponses) {
      return NextResponse.json(
        { error: "Réponses manquantes" },
        { status: 400 }
      );
    }

    // Appel à l'IA pour générer les recommandations
    const resultat = await genererRecommandationsIA(reponses);

    return NextResponse.json(resultat);
  } catch (error) {
    console.error("Erreur API analyze:", error);

    return NextResponse.json(
      { error: "Erreur lors de l'analyse" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
