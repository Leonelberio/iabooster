"use client";

import { motion } from "framer-motion";
import { Question } from "@/lib/types";
import { CheckCircle, Circle } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
  onPrev?: () => void;
  canGoNext: boolean;
  isFirstStep: boolean;
}

export default function QuestionCard({
  question,
  value,
  onChange,
  onNext,
  onPrev,
  canGoNext,
  isFirstStep,
}: QuestionCardProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canGoNext) {
      onNext();
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case "boolean":
        return (
          <div className="space-y-3">
            {[
              { value: true, label: "Oui" },
              { value: false, label: "Non" },
            ].map((option) => (
              <motion.button
                key={option.value.toString()}
                onClick={() => onChange(option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center space-x-3 ${
                  value === option.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {value === option.value ? (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium">{option.label}</span>
              </motion.button>
            ))}
          </div>
        );

      case "radio":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <motion.button
                key={option}
                onClick={() => onChange(option)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center space-x-3 ${
                  value === option
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {value === option ? (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium capitalize">{option}</span>
              </motion.button>
            ))}
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            onKeyPress={handleKeyPress}
            className="apple-input text-lg font-medium"
            placeholder="Entrez un nombre..."
            min="0"
            autoFocus
          />
        );

      case "text":
        return (
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="apple-input text-lg"
            placeholder="Votre réponse..."
            autoFocus
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="apple-card p-8 max-w-2xl mx-auto"
    >
      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3 leading-tight">
          {question.title}
        </h2>
        {question.description && (
          <p className="text-gray-600 text-base leading-relaxed">
            {question.description}
          </p>
        )}
      </div>

      {/* Input */}
      <div className="mb-8">{renderInput()}</div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        {!isFirstStep ? (
          <motion.button
            onClick={onPrev}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Précédent
          </motion.button>
        ) : (
          <div />
        )}

        <motion.button
          onClick={onNext}
          disabled={!canGoNext}
          className={`apple-button ${
            !canGoNext ? "opacity-50 cursor-not-allowed" : ""
          }`}
          whileHover={canGoNext ? { scale: 1.05 } : {}}
          whileTap={canGoNext ? { scale: 0.95 } : {}}
        >
          Suivant →
        </motion.button>
      </div>
    </motion.div>
  );
}
