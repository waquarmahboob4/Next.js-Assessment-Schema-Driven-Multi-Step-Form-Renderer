"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  steps: Array<{ title: string }>;
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStepClick?.(index)}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-200",
                index === currentStep
                  ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                  : index < currentStep
                  ? "border-green-600 bg-green-600 text-white"
                  : "border-gray-300 bg-white text-gray-500 hover:border-gray-400",
                onStepClick && "cursor-pointer hover:shadow-md"
              )}
            >
              {index < currentStep ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Check className="h-5 w-5" />
                </motion.div>
              ) : (
                <span>{index + 1}</span>
              )}
            </motion.button>
            
            {index < steps.length - 1 && (
              <div className="mx-2 h-0.5 w-8 sm:w-16 lg:w-24">
                <div
                  className={cn(
                    "h-full transition-colors duration-300",
                    index < currentStep ? "bg-green-600" : "bg-gray-300"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <motion.h2
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl font-bold text-gray-900"
        >
          {steps[currentStep].title}
        </motion.h2>
      </div>
    </div>
  );
}