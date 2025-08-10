"use client";

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Send, FileText } from 'lucide-react';
import { FormField } from '@/components/formField';
import { StepIndicator } from '@/components/stepIndicator';
import { FormSummary } from '@/components/formSummary';
import { useFormRenderer } from '@/hooks/useformRenderer';
import { FormSchema } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MultiStepFormProps {
  schema: FormSchema;
}

export function MultiStepForm({ schema }: MultiStepFormProps) {
  const {
    form,
    currentStep,
    currentStepData,
    isFirstStep,
    isLastStep,
    totalSteps,
    formData,
    nextStep,
    prevStep,
    goToStep,
    onSubmit,
    checkDependencies,
    getDynamicOptions,
  } = useFormRenderer(schema);

  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isSummaryStep = currentStep === totalSteps - 1 && currentStepData.fields.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {schema.title}
          </h1>
          {schema.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {schema.description}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <StepIndicator
            steps={schema.steps}
            currentStep={currentStep}
            onStepClick={goToStep}
          />
        </motion.div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      {isSummaryStep ? (
                        <>
                          <FileText className="h-6 w-6 text-blue-600" />
                          Review & Submit
                        </>
                      ) : (
                        <>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
                            {currentStep + 1}
                          </span>
                          {currentStepData.title}
                        </>
                      )}
                    </CardTitle>
                    {currentStepData.description && !isSummaryStep && (
                      <p className="text-gray-600 mt-2">
                        {currentStepData.description}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pb-8">
                    {isSummaryStep ? (
                      <FormSummary formData={{ ...formData, ...form.getValues() }} />
                    ) : (
                      <div className="space-y-6">
                        {currentStepData.fields.map((field) => (
                          <FormField
                            key={field.key}
                            field={field}
                            formData={formData}
                            checkDependencies={checkDependencies}
                            getDynamicOptions={getDynamicOptions}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-between items-center pt-6"
            >
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isFirstStep}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 transition-all duration-200",
                  isFirstStep ? "invisible" : "hover:bg-gray-100"
                )}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-3">
                {isLastStep ? (
                  <Button
                    type="submit"
                    className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 transition-all duration-200"
                  >
                    <Send className="h-4 w-4" />
                    Submit Form
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={(e) => nextStep(e)}
                    className="flex items-center gap-2 px-6 py-3 transition-all duration-200"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}