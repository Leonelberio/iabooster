import { OpenAI } from "openai";
import { ReponsesFormulaire, ResultatAnalyse, Recommandation } from "./types";
import {
  chargerOutilsIA,
  obtenirOutilsParDomaine,
  nettoyerOutils,
  OutilsParCategorie,
} from "./tools-database";

// Configuration OpenRouter
const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error(
    "❌ OPENROUTER_API_KEY n'est pas définie dans les variables d'environnement"
  );
  throw new Error("Configuration manquante: OPENROUTER_API_KEY est requis");
}

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey,
  dangerouslyAllowBrowser: false,
  timeout: 30000, // 30 secondes timeout
});

console.log("✅ Client OpenRouter configuré avec succès");

export async function genererRecommandationsIA(
  reponses: Partial<ReponsesFormulaire>
): Promise<ResultatAnalyse> {
  const prompt = creerPromptAnalyse(reponses);

  try {
    // Charger la base de données d'outils IA
    const outilsDatabase = await chargerOutilsIA();

    console.log("Début de l'appel à l'API OpenRouter...");

    const completion = await client.chat.completions.create({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content: `Tu es un expert en transformation digitale et intelligence artificielle pour les entreprises. Tu analyses les réponses d'un questionnaire pour recommander les meilleurs outils IA selon le contexte spécifique de l'entreprise.

Tu dois retourner uniquement un JSON valide avec cette structure exacte:
{
  "score": number (0-100),
  "recommandations": [
    {
      "domaine": string (choix: "Service Client", "Marketing Digital", "Analyse de Données", "Gestion & Organisation", "Recrutement", "Comptabilité & Admin", "Vente & CRM", "Production", "Logistique"),
      "description": string,
      "outils": [
        {
          "nom": string,
          "description": string,
          "prix": string,
          "lien": string
        }
      ],
      "priorite": "haute" | "moyenne" | "faible",
      "impact": string
    }
  ],
  "domainesAOptimiser": string[],
  "tempsMoyenEconomise": string
}

IMPORTANT: Pour les outils, utilise uniquement des noms réels et populaires comme:
- Service Client: ChatGPT, Intercom, Zendesk AI, Freshdesk, Drift
- Marketing: Jasper, Copy.ai, Canva AI, HubSpot AI, Mailchimp AI
- Données: Tableau, Power BI, Google Analytics Intelligence, Looker
- Gestion: Notion AI, Monday.com AI, Asana Intelligence, ClickUp AI
- Recrutement: HireVue, Pymeteus, Workday AI, BambooHR AI

Calcule un score d'optimisation IA (0-100) basé sur:
- Potentiel d'amélioration identifié
- Urgence des défis
- Taille de l'entreprise
- Secteur d'activité

Priorise les domaines avec le plus fort impact business et ROI.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    console.log("Réponse reçue de l'API OpenRouter");

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      console.error("Pas de contenu dans la réponse de l'IA");
      throw new Error("Pas de réponse de l'IA");
    }

    console.log(
      "Contenu de la réponse IA:",
      responseContent.substring(0, 200) + "..."
    );

    // Parser la réponse JSON
    let result: ResultatAnalyse;
    try {
      // Nettoyer la réponse si elle contient du texte avant/après le JSON
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseContent;

      result = JSON.parse(jsonString) as ResultatAnalyse;
    } catch (parseError) {
      console.error("Erreur parsing JSON:", parseError);
      console.error("Contenu reçu:", responseContent);
      throw new Error("Réponse IA non parseable");
    }

    // Enrichir les recommandations avec les outils de la database si nécessaire
    result = await enrichirRecommandations(result, outilsDatabase);

    console.log("Analyse IA terminée avec succès");
    return result;
  } catch (error) {
    console.error("Erreur lors de la génération IA:", error);

    // Fallback vers l'ancienne logique si l'IA échoue
    console.log("Utilisation du fallback...");
    return genererRecommandationsFallback(reponses);
  }
}

async function enrichirRecommandations(
  resultat: ResultatAnalyse,
  outilsDatabase: OutilsParCategorie
): Promise<ResultatAnalyse> {
  // Pour chaque recommandation, compléter avec des outils de la database si nécessaire
  const recommandationsEnrichies = resultat.recommandations.map(
    (recommandation) => {
      // Si la recommandation a moins de 2 outils, en ajouter depuis la database
      if (recommandation.outils.length < 2) {
        const outilsSupplementaires = obtenirOutilsParDomaine(
          recommandation.domaine,
          outilsDatabase,
          3 - recommandation.outils.length
        );

        // Nettoyer les doublons
        const tousOutils = nettoyerOutils([
          ...recommandation.outils,
          ...outilsSupplementaires,
        ]);

        return {
          ...recommandation,
          outils: tousOutils.slice(0, 3), // Limite à 3 outils max
        };
      }

      return recommandation;
    }
  );

  return {
    ...resultat,
    recommandations: recommandationsEnrichies,
  };
}

function creerPromptAnalyse(reponses: Partial<ReponsesFormulaire>): string {
  return `
Analyse cette entreprise et recommande les meilleurs outils IA:

**Profil Entreprise:**
- Taille: ${reponses.tailleEntreprise || "non spécifié"}
- Secteur: ${reponses.secteurActivite || "non spécifié"}
- Volume demandes client/semaine: ${reponses.demandeClientVolume || 0}

**Défis identifiés:**
- Service client difficile: ${reponses.serviceClient ? "Oui" : "Non"}
- Création contenu chronophage: ${reponses.creationContenu ? "Oui" : "Non"}
- Marketing digital à améliorer: ${reponses.marketingDigital ? "Oui" : "Non"}
- Données sous-exploitées: ${reponses.analysesDonnees ? "Oui" : "Non"}
- Gestion stock/inventaire difficile: ${reponses.gestionStock ? "Oui" : "Non"}
- Recrutement chronophage: ${reponses.recrutement ? "Oui" : "Non"}
- Tâches administratives à automatiser: ${reponses.comptabilite ? "Oui" : "Non"}

**Instructions d'analyse:**
1. Calcule un score d'optimisation IA (0-100) basé sur le potentiel d'amélioration réel
2. Identifie 2-4 domaines prioritaires avec le plus fort impact business
3. Pour chaque domaine, recommande 2-3 outils IA spécifiques et réels avec:
   - Nom de l'outil réel et populaire sur le marché
   - Description précise de son utilité pour ce contexte
   - Prix réaliste basé sur les tarifs actuels du marché
   - URL du site officiel de l'outil
4. Priorise selon l'urgence business et le ROI potentiel
5. Estime l'impact concret et mesurable
6. Calcule le temps total économisé par semaine de façon réaliste

**Contexte supplémentaire:**
- Startups: Focus sur outils économiques et faciles à implémenter
- PME: Équilibre entre coût et fonctionnalités avancées
- Grandes entreprises: Outils enterprise avec intégrations complexes

Secteurs spécifiques à considérer:
- E-commerce: Focus automatisation marketing et service client
- Services: Outils de productivité et gestion client
- Manufacturing: IA prédictive et optimisation opérationnelle
- Tech: Outils de développement et analyse avancée

Réponds uniquement avec le JSON demandé, sans texte supplémentaire.
`;
}

// Fonction de fallback si l'IA échoue
function genererRecommandationsFallback(
  reponses: Partial<ReponsesFormulaire>
): ResultatAnalyse {
  const recommandations: Recommandation[] = [];
  const domainesAOptimiser: string[] = [];
  let score = 0;

  // Service Client
  if (
    reponses.serviceClient ||
    (reponses.demandeClientVolume && reponses.demandeClientVolume > 10)
  ) {
    recommandations.push({
      domaine: "Service Client",
      description:
        "Automatisez vos réponses client pour gagner du temps et améliorer la satisfaction",
      outils: [
        {
          nom: "ChatGPT",
          description:
            "Chatbot intelligent pour automatiser les réponses client",
          prix: "20€/mois",
          lien: "https://openai.com/chatgpt",
        },
        {
          nom: "Intercom",
          description: "Plateforme de service client avec IA intégrée",
          prix: "39€/mois",
          lien: "https://intercom.com",
        },
        {
          nom: "Zendesk AI",
          description: "Support client intelligent avec IA",
          prix: "49€/mois",
          lien: "https://zendesk.com",
        },
      ],
      priorite:
        reponses.demandeClientVolume && reponses.demandeClientVolume > 50
          ? "haute"
          : "moyenne",
      impact: `Économie de ${Math.round(
        (reponses.demandeClientVolume || 10) * 0.3
      )} heures/semaine`,
    });
    domainesAOptimiser.push("Service Client");
    score +=
      reponses.demandeClientVolume && reponses.demandeClientVolume > 50
        ? 25
        : 15;
  }

  // Marketing Digital
  if (reponses.creationContenu || reponses.marketingDigital) {
    recommandations.push({
      domaine: "Marketing Digital",
      description:
        "Accélérez la création de contenu et optimisez vos campagnes marketing",
      outils: [
        {
          nom: "Jasper",
          description: "Génération de contenu marketing avec IA",
          prix: "29€/mois",
          lien: "https://jasper.ai",
        },
        {
          nom: "Copy.ai",
          description: "Rédaction automatique de copies marketing",
          prix: "36€/mois",
          lien: "https://copy.ai",
        },
        {
          nom: "Canva AI",
          description: "Design graphique assisté par IA",
          prix: "15€/mois",
          lien: "https://canva.com",
        },
      ],
      priorite: "haute",
      impact: "Productivité contenu x3",
    });
    domainesAOptimiser.push("Marketing Digital");
    score += 20;
  }

  // Analyse de Données
  if (reponses.analysesDonnees) {
    recommandations.push({
      domaine: "Analyse de Données",
      description: "Transformez vos données en insights actionables avec l'IA",
      outils: [
        {
          nom: "Tableau",
          description: "Visualisation de données avancée avec IA",
          prix: "70€/mois",
          lien: "https://tableau.com",
        },
        {
          nom: "Power BI",
          description: "Business Intelligence avec IA Microsoft",
          prix: "10€/mois",
          lien: "https://powerbi.microsoft.com",
        },
        {
          nom: "Looker",
          description: "Plateforme d'analyse de données IA",
          prix: "60€/mois",
          lien: "https://looker.com",
        },
      ],
      priorite: "moyenne",
      impact: "Décisions data-driven 5x plus rapides",
    });
    domainesAOptimiser.push("Analyse de Données");
    score += 15;
  }

  // Gestion & Organisation
  if (reponses.comptabilite || domainesAOptimiser.length < 2) {
    recommandations.push({
      domaine: "Gestion & Organisation",
      description:
        "Optimisez vos processus internes et automatisez les tâches répétitives",
      outils: [
        {
          nom: "Notion AI",
          description: "Workspace intelligent avec IA",
          prix: "10€/mois",
          lien: "https://notion.so",
        },
        {
          nom: "Monday.com AI",
          description: "Gestion de projets avec IA",
          prix: "8€/mois",
          lien: "https://monday.com",
        },
        {
          nom: "ClickUp AI",
          description: "Productivité et gestion avec IA",
          prix: "7€/mois",
          lien: "https://clickup.com",
        },
      ],
      priorite: "moyenne",
      impact: "Efficacité organisationnelle +40%",
    });
    domainesAOptimiser.push("Gestion & Organisation");
    score += 12;
  }

  // Bonus selon taille entreprise
  if (reponses.tailleEntreprise === "grande") score += 10;
  if (reponses.tailleEntreprise === "pme") score += 5;

  const tempsMoyenEconomise = `${Math.round(score * 0.5)} heures/semaine`;

  return {
    score: Math.min(score, 100),
    recommandations: recommandations.sort((a, b) => {
      const prioriteOrder = { haute: 3, moyenne: 2, faible: 1 };
      return prioriteOrder[b.priorite] - prioriteOrder[a.priorite];
    }),
    domainesAOptimiser,
    tempsMoyenEconomise,
  };
}
