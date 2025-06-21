import {
  ReponsesFormulaire,
  ResultatAnalyse,
  Recommandation,
  OutilIA,
} from "./types";

const outilsIA: Record<string, OutilIA[]> = {
  serviceClient: [
    {
      nom: "ChatGPT",
      description: "Chatbot intelligent pour automatiser les réponses client",
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
      description: "Solutions d'assistance client automatisées",
      prix: "49€/mois",
      lien: "https://zendesk.com",
    },
  ],
  marketing: [
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
      nom: "Canva Magic Write",
      description: "Création de visuels et textes marketing",
      prix: "12€/mois",
      lien: "https://canva.com",
    },
  ],
  gestion: [
    {
      nom: "Notion AI",
      description: "Organisation et automatisation des tâches",
      prix: "8€/mois",
      lien: "https://notion.so",
    },
    {
      nom: "Monday.com AI",
      description: "Gestion de projets intelligente",
      prix: "8€/mois",
      lien: "https://monday.com",
    },
  ],
  analyse: [
    {
      nom: "Tableau",
      description: "Analyse de données avancée avec IA",
      prix: "70€/mois",
      lien: "https://tableau.com",
    },
    {
      nom: "Power BI",
      description: "Business intelligence Microsoft",
      prix: "10€/mois",
      lien: "https://powerbi.microsoft.com",
    },
  ],
  recrutement: [
    {
      nom: "HireVue",
      description: "Entretiens vidéo automatisés avec IA",
      prix: "Sur devis",
      lien: "https://hirevue.com",
    },
    {
      nom: "Pymeteus",
      description: "Matching candidats-postes avec IA",
      prix: "99€/mois",
      lien: "https://pymeteus.com",
    },
  ],
};

export function analyserReponses(
  reponses: Partial<ReponsesFormulaire>
): ResultatAnalyse {
  const recommandations: Recommandation[] = [];
  const domainesAOptimiser: string[] = [];
  let score = 0;

  // Service Client
  if (reponses.demandeClientVolume && reponses.demandeClientVolume > 10) {
    recommandations.push({
      domaine: "Service Client",
      description:
        "Automatisez vos réponses client pour gagner du temps et améliorer la satisfaction",
      outils: outilsIA.serviceClient,
      priorite: reponses.demandeClientVolume > 50 ? "haute" : "moyenne",
      impact: `Économie de ${Math.round(
        reponses.demandeClientVolume * 0.3
      )} heures/semaine`,
    });
    domainesAOptimiser.push("Service Client");
    score += reponses.demandeClientVolume > 50 ? 25 : 15;
  }

  // Marketing Digital
  if (reponses.creationContenu || reponses.marketingDigital) {
    recommandations.push({
      domaine: "Marketing Digital",
      description:
        "Accélérez la création de contenu et optimisez vos campagnes marketing",
      outils: outilsIA.marketing,
      priorite: "haute",
      impact: "Productivité contenu x3",
    });
    domainesAOptimiser.push("Marketing Digital");
    score += 20;
  }

  // Analyses et Données
  if (reponses.analysesDonnees) {
    recommandations.push({
      domaine: "Analyse de Données",
      description: "Transformez vos données en insights actionnables avec l'IA",
      outils: outilsIA.analyse,
      priorite: reponses.tailleEntreprise === "grande" ? "haute" : "moyenne",
      impact: "Prise de décision 5x plus rapide",
    });
    domainesAOptimiser.push("Analyse de Données");
    score += 15;
  }

  // Gestion et Organisation
  if (reponses.gestionStock || reponses.comptabilite) {
    recommandations.push({
      domaine: "Gestion & Organisation",
      description:
        "Optimisez vos processus internes et réduisez les tâches répétitives",
      outils: outilsIA.gestion,
      priorite: "moyenne",
      impact: "30% de temps économisé sur les tâches admin",
    });
    domainesAOptimiser.push("Gestion & Organisation");
    score += 10;
  }

  // Recrutement
  if (reponses.recrutement) {
    recommandations.push({
      domaine: "Recrutement",
      description:
        "Automatisez le screening et améliorez la sélection des candidats",
      outils: outilsIA.recrutement,
      priorite: reponses.tailleEntreprise === "startup" ? "faible" : "moyenne",
      impact: "Temps de recrutement divisé par 2",
    });
    domainesAOptimiser.push("Recrutement");
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
