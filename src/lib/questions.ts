import { Question } from "./types";

export const questions: Question[] = [
  {
    id: "tailleEntreprise",
    title: "Quelle est la taille de votre entreprise ?",
    description: "Cela nous aide à personnaliser nos recommandations",
    type: "radio",
    options: ["startup", "pme", "grande"],
    required: true,
  },
  {
    id: "secteurActivite",
    title: "Dans quel secteur évoluez-vous ?",
    description:
      "Sélectionnez le secteur qui correspond le mieux à votre activité",
    type: "radio",
    options: [
      "E-commerce",
      "Services",
      "Manufacturing",
      "Tech/IT",
      "Santé",
      "Finance",
      "Éducation",
      "Autre",
    ],
    required: true,
  },
  {
    id: "demandeClientVolume",
    title: "Combien de demandes client recevez-vous par semaine ?",
    description: "Emails, appels, messages sur les réseaux sociaux, chat...",
    type: "number",
    required: true,
  },
  {
    id: "serviceClient",
    title: "Rencontrez-vous des difficultés avec votre service client ?",
    description:
      "Temps de réponse long, questions répétitives, saturation de l'équipe...",
    type: "boolean",
    required: true,
  },
  {
    id: "creationContenu",
    title: "Passez-vous beaucoup de temps à créer du contenu marketing ?",
    description:
      "Articles de blog, posts réseaux sociaux, newsletters, descriptions produits...",
    type: "boolean",
    required: true,
  },
  {
    id: "marketingDigital",
    title: "Souhaitez-vous améliorer votre marketing digital ?",
    description: "Personnalisation, ciblage, optimisation des campagnes...",
    type: "boolean",
    required: true,
  },
  {
    id: "analysesDonnees",
    title: "Avez-vous des données que vous n'exploitez pas assez ?",
    description:
      "Données clients, ventes, comportements utilisateurs, analytics...",
    type: "boolean",
    required: true,
  },
  {
    id: "gestionStock",
    title: "La gestion de stock ou d'inventaire est-elle un défi ?",
    description: "Prévisions, optimisation, automatisation des commandes...",
    type: "boolean",
    required: true,
  },
  {
    id: "recrutement",
    title: "Le recrutement vous prend-il beaucoup de temps ?",
    description: "Tri des CV, entretiens, évaluation des candidats...",
    type: "boolean",
    required: true,
  },
  {
    id: "comptabilite",
    title: "Souhaitez-vous automatiser vos tâches administratives ?",
    description:
      "Saisie comptable, facturation, reporting, gestion documentaire...",
    type: "boolean",
    required: true,
  },
];

export const getQuestionById = (id: string): Question | undefined => {
  return questions.find((q) => q.id === id);
};

export const getTotalSteps = (): number => {
  return questions.length;
};
