"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { questions } from "@/lib/questions";
import { ReponsesFormulaire } from "@/lib/types";
import Stepper from "@/components/Stepper";
import QuestionCard from "@/components/QuestionCard";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [reponses, setReponses] = useState<Partial<ReponsesFormulaire>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les réponses sauvegardées
  useEffect(() => {
    const savedReponses = localStorage.getItem("ia-booster-reponses");
    if (savedReponses) {
      try {
        const parsedReponses = JSON.parse(savedReponses);
        setReponses(parsedReponses);
      } catch (error) {
        console.error("Erreur lors du chargement des réponses:", error);
      }
    }
  }, []);

  // Sauvegarder automatiquement les réponses
  useEffect(() => {
    if (Object.keys(reponses).length > 0) {
      localStorage.setItem("ia-booster-reponses", JSON.stringify(reponses));
    }
  }, [reponses]);

  const handleAnswer = (
    field: keyof ReponsesFormulaire,
    value: string | number | boolean
  ) => {
    setReponses((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Sauvegarder les réponses finales
    localStorage.setItem("ia-booster-reponses", JSON.stringify(reponses));

    // Rediriger vers les résultats
    router.push("/resultats");
  };

  const isCurrentQuestionAnswered = () => {
    const question = questions[currentQuestion];
    const response = reponses[question.id as keyof ReponsesFormulaire];

    if (question.type === "radio" || question.type === "text") {
      return response !== undefined && response !== "";
    }
    if (question.type === "number") {
      return response !== undefined && response !== null;
    }
    if (question.type === "boolean") {
      return response !== undefined;
    }
    return false;
  };

  const getProgress = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec progression */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">IA</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Diagnostic IA</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentQuestion + 1} sur {questions.length}
              </span>
              <div className="w-32">
                <Stepper
                  currentStep={currentQuestion + 1}
                  totalSteps={questions.length}
                />
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
              style={{ width: `${getProgress()}%` }}
              layoutId="progress"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard
              question={questions[currentQuestion]}
              value={
                reponses[
                  questions[currentQuestion].id as keyof ReponsesFormulaire
                ]
              }
              onChange={(value) =>
                handleAnswer(
                  questions[currentQuestion].id as keyof ReponsesFormulaire,
                  value
                )
              }
              onNext={handleNext}
              onPrev={handlePrevious}
              canGoNext={isCurrentQuestionAnswered()}
              isFirstStep={currentQuestion === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Indicateur de sauvegarde */}
        {Object.keys(reponses).length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center"
          >
            <p className="text-xs text-gray-500">
              ✓ Vos réponses sont sauvegardées automatiquement
            </p>
          </motion.div>
        )}

        {/* Message de soumission */}
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
              <motion.div
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analyse en cours...
              </h3>
              <p className="text-gray-600">
                Notre IA DeepSeek analyse vos réponses pour générer des
                recommandations personnalisées
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
