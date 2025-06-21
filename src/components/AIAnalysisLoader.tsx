"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Zap } from "lucide-react";

export default function AIAnalysisLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Animation principale */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cercles d'animation */}
          <div className="relative w-24 h-24 mx-auto">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-4 border-blue-200 rounded-full"
                style={{
                  borderTopColor:
                    i === 0 ? "#3b82f6" : i === 1 ? "#8b5cf6" : "#06b6d4",
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}

            {/* Icône centrale */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain className="w-8 h-8 text-blue-600" />
              </motion.div>
            </div>
          </div>

          {/* Particules flottantes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              style={{
                left: `${20 + (i % 3) * 30}%`,
                top: `${20 + Math.floor(i / 3) * 60}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Texte animé */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              Analyse IA en cours
            </h2>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>

          <motion.p
            className="text-gray-600 mb-6"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Notre intelligence artificielle analyse vos réponses pour générer
            des recommandations personnalisées...
          </motion.p>
        </motion.div>

        {/* Étapes d'analyse */}
        <div className="space-y-3">
          {[
            "Analyse du profil entreprise",
            "Identification des opportunités IA",
            "Sélection des outils optimaux",
            "Calcul de l'impact business",
          ].map((etape, index) => (
            <motion.div
              key={etape}
              className="flex items-center space-x-3 text-sm text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
            >
              <motion.div
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              />
              <span>{etape}</span>
              {index < 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.5 }}
                >
                  <Zap className="w-4 h-4 text-green-500" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100"
        >
          <p className="text-xs text-blue-700">
            ✨ Analyse propulsée par l'IA DeepSeek pour des recommandations
            ultra-personnalisées
          </p>
        </motion.div>
      </div>
    </div>
  );
}
