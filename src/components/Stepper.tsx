"use client";

import { motion } from "framer-motion";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function Stepper({ currentStep, totalSteps }: StepperProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Step Counter */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <span className="text-gray-500">
          Étape {currentStep} sur {totalSteps}
        </span>
        <span className="text-blue-600 font-medium">
          {Math.round(progress)}% complété
        </span>
      </div>

      {/* Steps Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index < currentStep
                ? "bg-blue-600"
                : index === currentStep
                ? "bg-blue-400"
                : "bg-gray-200"
            }`}
            initial={{ scale: 0.8 }}
            animate={{
              scale: index === currentStep ? 1.2 : 1,
              opacity: index <= currentStep ? 1 : 0.5,
            }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
