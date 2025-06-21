export interface OutilIA {
  nom: string;
  description: string;
  prix: string;
  lien: string;
}

export interface OutilsParCategorie {
  serviceClient: OutilIA[];
  marketing: OutilIA[];
  analysesDonnees: OutilIA[];
  gestion: OutilIA[];
  recrutement: OutilIA[];
  comptabilite: OutilIA[];
  vente: OutilIA[];
  production: OutilIA[];
  logistique: OutilIA[];
}

// Chargement dynamique des outils depuis le fichier JSON
let outilsDatabase: OutilsParCategorie | null = null;

export async function chargerOutilsIA(): Promise<OutilsParCategorie> {
  if (outilsDatabase) {
    return outilsDatabase;
  }

  try {
    // Pour les routes API côté serveur, utiliser une URL absolue ou lire le fichier directement
    let response;

    // Déterminer si on est côté serveur ou client
    if (typeof window === "undefined") {
      // Côté serveur - utiliser une URL absolue ou lire le fichier
      const fs = await import("fs");
      const path = await import("path");

      const filePath = path.join(
        process.cwd(),
        "public",
        "outils_ia_etendus.json"
      );

      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        outilsDatabase = JSON.parse(fileContent);
        return outilsDatabase!;
      } catch (fileError) {
        console.warn(
          "Impossible de lire le fichier JSON, utilisation du fallback"
        );
        throw fileError;
      }
    } else {
      // Côté client - utiliser fetch normal
      response = await fetch("/outils_ia_etendus.json");
      if (!response.ok) {
        throw new Error("Fichier outils non trouvé");
      }

      outilsDatabase = await response.json();
      return outilsDatabase!;
    }
  } catch (error) {
    console.error("Erreur lors du chargement des outils IA:", error);

    // Fallback avec quelques outils de base
    return {
      serviceClient: [
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
          nom: "Canva AI",
          description: "Design graphique assisté par IA",
          prix: "15€/mois",
          lien: "https://canva.com",
        },
      ],
      analysesDonnees: [
        {
          nom: "Tableau",
          description: "Visualisation de données avec IA",
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
      gestion: [
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
      recrutement: [
        {
          nom: "HireVue",
          description: "Entretiens vidéo avec analyse IA",
          prix: "Sur devis",
          lien: "https://hirevue.com",
        },
        {
          nom: "Workday AI",
          description: "RH et recrutement assisté par IA",
          prix: "Sur devis",
          lien: "https://workday.com",
        },
        {
          nom: "BambooHR AI",
          description: "Gestion RH intelligente",
          prix: "6€/mois/employé",
          lien: "https://bamboohr.com",
        },
      ],
      comptabilite: [
        {
          nom: "QuickBooks AI",
          description: "Comptabilité automatisée",
          prix: "25€/mois",
          lien: "https://quickbooks.com",
        },
        {
          nom: "Xero AI",
          description: "Comptabilité intelligente pour PME",
          prix: "20€/mois",
          lien: "https://xero.com",
        },
        {
          nom: "Sage AI",
          description: "Solutions comptables avec IA",
          prix: "30€/mois",
          lien: "https://sage.com",
        },
      ],
      vente: [
        {
          nom: "Salesforce Einstein",
          description: "CRM avec IA prédictive",
          prix: "75€/mois",
          lien: "https://salesforce.com",
        },
        {
          nom: "HubSpot AI",
          description: "CRM et marketing automation IA",
          prix: "45€/mois",
          lien: "https://hubspot.com",
        },
        {
          nom: "Pipedrive AI",
          description: "CRM intelligent pour ventes",
          prix: "15€/mois",
          lien: "https://pipedrive.com",
        },
      ],
      production: [
        {
          nom: "Predictive Maintenance AI",
          description: "Maintenance prédictive avec IA",
          prix: "Sur devis",
          lien: "#",
        },
        {
          nom: "Quality Control AI",
          description: "Contrôle qualité automatisé par IA",
          prix: "Sur devis",
          lien: "#",
        },
      ],
      logistique: [
        {
          nom: "Optimize AI",
          description: "Optimisation logistique avec IA",
          prix: "Sur devis",
          lien: "#",
        },
        {
          nom: "Route Planning AI",
          description: "Planification de routes intelligente",
          prix: "Sur devis",
          lien: "#",
        },
      ],
    };
  }
}

export function obtenirOutilsParDomaine(
  domaine: string,
  outils: OutilsParCategorie,
  limite: number = 3
): OutilIA[] {
  // Mapping des domaines vers les catégories
  const mapping: Record<string, keyof OutilsParCategorie> = {
    "Service Client": "serviceClient",
    "Marketing Digital": "marketing",
    "Analyse de Données": "analysesDonnees",
    "Gestion & Organisation": "gestion",
    "Recrutement": "recrutement",
    "Comptabilité & Admin": "comptabilite",
    "Vente & CRM": "vente",
    "Production": "production",
    "Logistique": "logistique",
  };

  const categorie = mapping[domaine];
  if (!categorie || !outils[categorie]) {
    return [];
  }

  // Retourner un échantillon aléatoire des outils
  const outilsDisponibles = outils[categorie];
  const shuffled = [...outilsDisponibles].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, limite);
}

// Nettoyage des doublons dans les outils
export function nettoyerOutils(outils: OutilIA[]): OutilIA[] {
  const vus = new Set<string>();
  return outils.filter((outil) => {
    const cleUnique = outil.nom.toLowerCase().replace(/\s+/g, "");
    if (vus.has(cleUnique)) {
      return false;
    }
    vus.add(cleUnique);
    return true;
  });
}
