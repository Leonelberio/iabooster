"use client";

import { motion } from "framer-motion";
import { Recommandation } from "@/lib/types";
import { ExternalLink, Clock, TrendingUp, AlertCircle } from "lucide-react";

interface ResultCardProps {
  recommandation: Recommandation;
  index: number;
}

export default function ResultCard({ recommandation, index }: ResultCardProps) {
  const getPriorityColor = (priorite: string) => {
    switch (priorite) {
      case "haute":
        return "border-red-200 bg-red-50 text-red-800";
      case "moyenne":
        return "border-yellow-200 bg-yellow-50 text-yellow-800";
      case "faible":
        return "border-green-200 bg-green-50 text-green-800";
      default:
        return "border-gray-200 bg-gray-50 text-gray-800";
    }
  };

  const getPriorityIcon = (priorite: string) => {
    switch (priorite) {
      case "haute":
        return <AlertCircle className="w-4 h-4" />;
      case "moyenne":
        return <Clock className="w-4 h-4" />;
      case "faible":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="apple-card p-6 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {recommandation.domaine}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {recommandation.description}
          </p>
        </div>

        <span
          className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
            recommandation.priorite
          )}`}
        >
          {getPriorityIcon(recommandation.priorite)}
          <span className="capitalize">{recommandation.priorite}</span>
        </span>
      </div>

      {/* Impact */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center space-x-2 text-blue-700">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">Impact estimé</span>
        </div>
        <p className="text-blue-600 mt-1 font-medium">
          {recommandation.impact}
        </p>
      </div>

      {/* Outils recommandés */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <span>🔧</span>
          <span>Outils recommandés</span>
        </h4>

        <div className="space-y-3">
          {recommandation.outils.slice(0, 3).map((outil, outilIndex) => (
            <motion.div
              key={outil.nom}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.2,
                delay: index * 0.1 + outilIndex * 0.05,
              }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h5 className="font-medium text-gray-900">{outil.nom}</h5>
                  <span className="text-blue-600 font-medium text-sm">
                    {outil.prix}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{outil.description}</p>
              </div>

              <motion.a
                href={outil.lien}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium text-sm ml-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Voir</span>
                <ExternalLink className="w-3 h-3" />
              </motion.a>
            </motion.div>
          ))}
        </div>

        {recommandation.outils.length > 3 && (
          <p className="text-gray-500 text-sm mt-3 text-center">
            +{recommandation.outils.length - 3} autres outils disponibles
          </p>
        )}
      </div>
    </motion.div>
  );
}
