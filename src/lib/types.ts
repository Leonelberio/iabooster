export interface Question {
  id: string;
  title: string;
  description?: string;
  type: "boolean" | "radio" | "number" | "text";
  options?: string[];
  required: boolean;
}

export interface ReponsesFormulaire {
  demandeClientVolume: number;
  creationContenu: boolean;
  gestionStock: boolean;
  analysesDonnees: boolean;
  recrutement: boolean;
  comptabilite: boolean;
  marketingDigital: boolean;
  serviceClient: boolean;
  tailleEntreprise: "startup" | "pme" | "grande";
  secteurActivite: string;
}

export interface Recommandation {
  domaine: string;
  description: string;
  outils: OutilIA[];
  priorite: "haute" | "moyenne" | "faible";
  impact: string;
}

export interface OutilIA {
  nom: string;
  description: string;
  prix: string;
  lien: string;
  logo?: string;
}

export interface ResultatAnalyse {
  score: number;
  recommandations: Recommandation[];
  domainesAOptimiser: string[];
  tempsMoyenEconomise: string;
}

export interface QuizContextType {
  currentStep: number;
  totalSteps: number;
  reponses: Partial<ReponsesFormulaire>;
  updateReponse: (key: keyof ReponsesFormulaire, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  isCompleted: boolean;
}
