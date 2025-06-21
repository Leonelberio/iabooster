# 🚀 IA Booster - Diagnostic IA pour Entreprises

Un simulateur web intelligent propulsé par l'IA qui aide les entreprises à identifier et implémenter les meilleures solutions d'intelligence artificielle pour optimiser leurs opérations.

## ✨ Nouvelles Fonctionnalités IA

### 🧠 Analyse IA Avancée
- **Intelligence Artificielle DeepSeek** intégrée pour des recommandations ultra-personnalisées
- **Base de données étendue** avec plus de 3000 outils IA référencés
- **Analyse contextuelle** adaptée au secteur et à la taille de l'entreprise
- **Calcul intelligent** du ROI et de l'impact business

### 🎯 Recommandations Intelligentes
- Analyse propulsée par **OpenRouter + DeepSeek R1**
- Recommandations personnalisées basées sur :
  - Profil entreprise (taille, secteur)
  - Défis identifiés
  - Volume d'activité
  - Contraintes budgétaires
- **Priorisation automatique** selon l'impact business

## 🛠 Stack Technique

- **Frontend** : Next.js 15, TypeScript, Tailwind CSS, Framer Motion
- **IA** : OpenRouter API, DeepSeek R1 Model
- **Base de données** : MongoDB (si nécessaire), JSON statique pour les outils
- **PDF** : jsPDF pour génération de rapports
- **Animations** : Framer Motion

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/votre-nom/ia-booster.git
cd ia-booster

# Installer les dépendances
pnpm install

# Copier et configurer les variables d'environnement
cp .env.example .env.local

# Démarrer le serveur de développement
pnpm dev
```

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env.local` avec :

```env
# OpenRouter Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=IA Booster
```

### Obtenir une Clé API OpenRouter

1. Aller sur [OpenRouter.ai](https://openrouter.ai)
2. Créer un compte
3. Générer une clé API
4. Ajouter la clé dans `.env.local`

## 📊 Fonctionnalités

### 🎯 Diagnostic IA Intelligent
- **Questionnaire adaptatif** : 10 questions ciblées
- **Analyse temps réel** : Propulsée par DeepSeek IA
- **Score d'optimisation** : Calcul intelligent 0-100
- **Estimation ROI** : Temps économisé et impact business

### 📈 Recommandations Personnalisées
- **5 domaines couverts** :
  - Service Client (ChatGPT, Intercom, Zendesk AI)
  - Marketing Digital (Jasper, Copy.ai, Canva AI)
  - Analyse de Données (Tableau, Power BI, Looker)
  - Gestion & Organisation (Notion AI, Monday.com)
  - Recrutement (HireVue, Workday AI)

### 📋 Rapport PDF Professionnel
- **Génération automatique** de rapport détaillé
- **Branding personnalisé** avec logo
- **Recommandations détaillées** avec liens et tarifs
- **Plan d'action** étape par étape

### 🎨 Design Apple Minimal
- **Interface épurée** inspirée d'Apple
- **Animations fluides** avec Framer Motion
- **Responsive design** mobile-first
- **14px base font** pour une lisibilité optimale

## 🏗 Architecture

```
src/
├── app/
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Page d'accueil
<!-- │   ├── quiz/page.tsx        # Questionnaire interactif -->
│   ├── resultats/page.tsx   # Résultats avec IA
│   └── api/
│       └── analyze/route.ts # API pour analyse IA
├── components/
│   ├── Header.tsx           # Navigation
│   ├── Stepper.tsx          # Indicateur de progression
│   ├── QuestionCard.tsx     # Questions du quiz
│   ├── ResultCard.tsx       # Affichage des recommandations
│   └── AIAnalysisLoader.tsx # Loader d'analyse IA
└── lib/
    ├── ai-service.ts        # Service OpenRouter/DeepSeek
    ├── client-ai.ts         # Client IA côté frontend
    ├── tools-database.ts    # Gestion des outils IA
    ├── types.ts             # Types TypeScript
    ├── questions.ts         # Questions du questionnaire
    ├── analyse.ts           # Logique d'analyse (fallback)
    └── pdf.ts               # Génération PDF
```

## 🤖 Service IA

### OpenRouter + DeepSeek Integration

Le service IA utilise **OpenRouter** avec le modèle **DeepSeek R1** pour :

- Analyser le profil de l'entreprise
- Identifier les opportunités d'optimisation
- Recommander les outils IA les plus adaptés
- Calculer l'impact business et le ROI
- Prioriser les actions selon l'urgence

### Fallback Intelligent

En cas d'échec de l'IA, le système utilise une logique de fallback basée sur des règles métier pour garantir des recommandations cohérentes.

## 📱 Pages Principales

### 🏠 Page d'Accueil
- **Hero section** avec appel à l'action
- **Badges IA** pour mettre en avant la technologie
- **Cartes flottantes** animées
- **Section fonctionnalités** avec benefits

### ❓ Quiz Interactif
- **10 questions ciblées** couvrant tous les aspects business
- **Barre de progression** avec animations
- **Sauvegarde automatique** en localStorage
- **Validation temps réel** des réponses

### 📊 Page Résultats
- **Loader IA animé** pendant l'analyse (3s minimum)
- **Badge "Analysé par IA"** pour la crédibilité
- **Score d'optimisation** avec indicateurs visuels
- **Recommandations détaillées** par domaine
- **Actions** : PDF, nouveau diagnostic, partage

## 🎨 Design System

### Couleurs
- **Bleu principal** : #3b82f6 (Boutons, liens)
- **Fond** : #f9fafb (Gris très clair)
- **Texte** : #111827 (Gris très foncé)
- **Accents** : Dégradés bleu/violet pour l'IA

### Typographie
- **Police** : Inter (Google Fonts)
- **Taille de base** : 14px
- **Poids** : 300-700 selon contexte

### Composants
- **apple-button** : Boutons style Apple avec hover effects
- **apple-card** : Cartes avec shadow subtile et border radius
- **apple-input** : Inputs avec focus ring bleu

## 📈 Performance

### Optimisations
- **Server Side Rendering** avec Next.js 15
- **Images optimisées** avec next/image
- **Lazy loading** pour les composants non-critiques
- **Animations performantes** avec Framer Motion

### Web Vitals
- **LCP** < 2.5s : Images optimisées
- **CLS** < 0.1 : Layout stable
- **FID** < 100ms : Interactions fluides

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Build du projet
pnpm build

# Déploiement
vercel --prod
```

### Variables d'Environnement Production
- `OPENROUTER_API_KEY` : Clé API OpenRouter
- `NEXT_PUBLIC_SITE_URL` : URL de production
- `NEXT_PUBLIC_SITE_NAME` : Nom du site

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**IA Booster Team**
- Email : contact@iabooster.com
- Website : [ia-booster.vercel.app](https://ia-booster.vercel.app)

---

⭐ **Star le projet** si vous le trouvez utile !
