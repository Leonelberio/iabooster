"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ResultCard from "@/components/ResultCard";
import AIAnalysisLoader from "@/components/AIAnalysisLoader";
import { analyserAvecIA } from "@/lib/client-ai";
import { genererRapportPDF } from "@/lib/pdf";
import { ReponsesFormulaire, ResultatAnalyse } from "@/lib/types";
import {
  Download,
  RefreshCw,
  Share2,
  TrendingUp,
  Target,
  Sparkles,
  Calendar,
  MessageCircle,
  Zap,
} from "lucide-react";

export default function ResultatsPage() {
  const router = useRouter();
  const [resultat, setResultat] = useState<ResultatAnalyse | null>(null);
  const [reponses, setReponses] = useState<Partial<ReponsesFormulaire> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isAIAnalysis, setIsAIAnalysis] = useState(true);

  useEffect(() => {
    async function analyseReponses() {
      // Récupérer les réponses depuis localStorage
      const savedReponses = localStorage.getItem("ia-booster-reponses");
      const savedResultats = localStorage.getItem("ia-booster-resultats");

      if (!savedReponses) {
        // Rediriger vers le quiz si pas de réponses
        router.push("/");
        return;
      }

      try {
        const parsedReponses = JSON.parse(
          savedReponses
        ) as Partial<ReponsesFormulaire>;
        setReponses(parsedReponses);

        // Si des résultats sont déjà sauvegardés, les utiliser
        if (savedResultats) {
          try {
            const parsedResultats = JSON.parse(
              savedResultats
            ) as ResultatAnalyse;
            setResultat(parsedResultats);
            setIsAIAnalysis(true);
            setIsLoading(false);
            return;
          } catch (error) {
            console.error(
              "Erreur lors du chargement des résultats sauvegardés:",
              error
            );
            // Continuer avec une nouvelle analyse
          }
        }

        // Analyser avec l'IA (temps minimum 3 secondes pour l'UX)
        const startTime = Date.now();

        const analysisResult = await analyserAvecIA(parsedReponses);

        // Assurer un délai minimum pour l'animation
        const elapsedTime = Date.now() - startTime;
        const minLoadTime = 3000; // 3 secondes minimum

        if (elapsedTime < minLoadTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minLoadTime - elapsedTime)
          );
        }

        setResultat(analysisResult);

        // Sauvegarder les résultats dans localStorage
        localStorage.setItem(
          "ia-booster-resultats",
          JSON.stringify(analysisResult)
        );

        setIsAIAnalysis(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de l'analyse:", error);
        router.push("/");
      }
    }

    analyseReponses();
  }, [router]);

  const handleDownloadPDF = () => {
    if (!resultat || !reponses) return;

    setIsGeneratingPDF(true);

    // Simulation d'un délai pour l'UX
    setTimeout(() => {
      const nomEntreprise = "Votre Entreprise"; // Peut être récupéré des réponses si ajouté
      const secteur = reponses.secteurActivite || "";

      genererRapportPDF(resultat, nomEntreprise, secteur);
      setIsGeneratingPDF(false);
    }, 1000);
  };

  const handleNewDiagnostic = () => {
    localStorage.removeItem("ia-booster-reponses");
    localStorage.removeItem("ia-booster-resultats");
    router.push("/");
  };

  const handleConsultation = () => {
    window.open(
      "https://calendly.com/adagbeleandro55/consultation-ia-gratuite",
      "_blank"
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return "Excellent potentiel";
    if (score >= 40) return "Bon potentiel";
    return "Potentiel à développer";
  };

  // Afficher le loader IA pendant l'analyse
  if (isLoading) {
    return <AIAnalysisLoader />;
  }

  if (!resultat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">
            Erreur lors du chargement des résultats
          </p>
          <button onClick={handleNewDiagnostic} className="apple-button mt-4">
            Refaire le diagnostic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec badge IA */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              <Target className="w-4 h-4" />
              <span>Diagnostic terminé</span>
            </div>

            {isAIAnalysis && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium border border-blue-200"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analysé par IA</span>
              </motion.div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vos Résultats IA
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment l'intelligence artificielle peut transformer votre
            entreprise
          </p>

          {isAIAnalysis && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-blue-600 mt-2 font-medium"
            >
              ✨ Recommandations générées par l'IA DeepSeek pour une précision
              maximale
            </motion.p>
          )}
        </motion.div>

        {/* Score Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="apple-card p-8 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div
                className={`text-4xl font-bold mb-2 ${getScoreColor(
                  resultat.score
                )}`}
              >
                {resultat.score}/100
              </div>
              <div className="text-gray-600 font-medium">Score IA</div>
              <div className={`text-sm mt-1 ${getScoreColor(resultat.score)}`}>
                {getScoreLabel(resultat.score)}
              </div>
            </div>

            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {resultat.domainesAOptimiser.length}
              </div>
              <div className="text-gray-600 font-medium">
                Domaines identifiés
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Opportunités d'optimisation
              </div>
            </div>

            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {resultat.tempsMoyenEconomise.split(" ")[0]}
              </div>
              <div className="text-gray-600 font-medium">Heures/semaine</div>
              <div className="text-sm text-gray-500 mt-1">
                Temps économisé estimé
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <motion.button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="apple-button flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isGeneratingPDF ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Génération...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Télécharger le rapport PDF</span>
              </>
            )}
          </motion.button>

          <motion.button
            onClick={handleConsultation}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar className="w-4 h-4" />
            <span>Consultation gratuite</span>
            <span className="text-green-200 text-xs">•</span>
            <span className="text-green-200 text-xs">0€</span>
          </motion.button>

          <motion.button
            onClick={handleNewDiagnostic}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition-all duration-200 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Nouveau diagnostic</span>
          </motion.button>

          <motion.button
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition-all duration-200 flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 className="w-4 h-4" />
            <span>Partager</span>
          </motion.button>
        </motion.div>

        {/* Recommandations */}
        {resultat.recommandations.length > 0 ? (
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-gray-900 mb-8 text-center flex items-center justify-center space-x-2"
            >
              <span>🎯</span>
              <span>Vos Recommandations Personnalisées</span>
              {isAIAnalysis && <Sparkles className="w-5 h-5 text-yellow-500" />}
            </motion.h2>

            <div className="grid gap-6">
              {resultat.recommandations.map((recommandation, index) => (
                <ResultCard
                  key={recommandation.domaine}
                  recommandation={recommandation}
                  index={index}
                />
              ))}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="apple-card p-8 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune recommandation spécifique
            </h3>
            <p className="text-gray-600">
              Votre entreprise semble déjà bien optimisée, ou vous pourriez
              bénéficier d'un diagnostic plus approfondi avec nos experts.
            </p>
          </motion.div>
        )}

        {/* Call to Action Principal - Consultation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 apple-card p-8 text-center bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 relative overflow-hidden"
        >
          {/* Effets de fond */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 text-green-300">
              <Zap className="w-8 h-8" />
            </div>
            <div className="absolute bottom-4 left-4 text-green-300">
              <MessageCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Calendar className="w-8 h-8 text-white" />
            </motion.div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à passer à l'action ? 🚀
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Obtenez un accompagnement personnalisé pour implémenter ces
              recommandations IA dans votre entreprise.
              <span className="font-medium text-green-700">
                {" "}
                Consultation de 30 minutes offerte
              </span>{" "}
              avec un expert en transformation digitale.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Plan d'implémentation personnalisé</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sélection d'outils adaptés à votre budget</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Stratégie de formation équipe</span>
              </div>
            </div>

            <motion.button
              onClick={handleConsultation}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-8 py-4 rounded-xl transition-all duration-200 flex items-center space-x-3 mx-auto text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-5 h-5" />
              <span>Réserver ma consultation gratuite</span>
              <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                GRATUIT
              </span>
            </motion.button>

            <p className="text-xs text-gray-500 mt-4">
              💡 Durée : 30 minutes • Format : Visioconférence • Sans engagement
            </p>
          </div>
        </motion.div>

        {/* Call to Action Secondaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 apple-card p-8 text-center bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Besoin d'aide pour implémenter ces solutions ?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nos experts peuvent vous accompagner dans la mise en place de ces
            outils IA pour garantir le succès de votre transformation digitale.
          </p>
          <motion.button
            onClick={handleConsultation}
            className="apple-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Parler à un expert
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
