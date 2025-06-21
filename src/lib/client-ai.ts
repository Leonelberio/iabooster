import { ReponsesFormulaire, ResultatAnalyse } from "./types";

export async function analyserAvecIA(
  reponses: Partial<ReponsesFormulaire>
): Promise<ResultatAnalyse> {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reponses }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const resultat = await response.json();
    return resultat as ResultatAnalyse;
  } catch (error) {
    console.error("Erreur lors de l'appel à l'IA:", error);

    // Fallback vers l'ancienne logique si l'API échoue
    const { analyserReponses } = await import("./analyse");
    return analyserReponses(reponses);
  }
}
