"use client";

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { FormSchema, FormField, FormData } from '@/lib/types';

export function useFormRenderer(schema: FormSchema) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});

  const form = useForm<FormData>({
    defaultValues: formData,
    mode: 'onChange'
  });

  const currentStepData = schema.steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === schema.steps.length - 1;
  const totalSteps = schema.steps.length;

  const checkDependencies = useCallback((field: FormField, values: FormData): { show: boolean; enable: boolean } => {
    if (!field.dependencies?.length) {
      return { show: true, enable: true };
    }

    let show = true;

    field.dependencies.forEach(dep => {
      const fieldValue = values[dep.key];
      
      if (dep.notEmpty !== undefined) {
        const hasValue = fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
        if (dep.notEmpty && !hasValue) {
          show = false;
        }
      }
      
      if (dep.equals !== undefined) {
        if (fieldValue !== dep.equals) {
          show = false;
        }
      }
    });

    return { show, enable: true };
  }, []);

  const getDynamicOptions = useCallback((field: FormField, values: FormData): string[] => {
    if (!field.optionSource) {
      return field.options || [];
    }
    
    const dependentValue = values[field.optionSource.key];
    return field.optionSource.map[dependentValue] || [];
  }, []);

  const nextStep = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await form.trigger();
    if (isValid && !isLastStep) {
      const currentValues = form.getValues();
      setFormData(prev => ({ ...prev, ...currentValues }));
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  }, [form, isLastStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (!isFirstStep) {
      const currentValues = form.getValues();
      setFormData(prev => ({ ...prev, ...currentValues }));
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  }, [form, isFirstStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      const currentValues = form.getValues();
      setFormData(prev => ({ ...prev, ...currentValues }));
      setCurrentStep(step);
    }
  }, [form, totalSteps]);

  const onSubmit = useCallback((data: FormData) => {
    const finalData = { ...formData, ...data };
    console.log('Form Submitted:', JSON.stringify(finalData, null, 2));
    alert('Form submitted successfully! Check the console for the data.');
  }, [formData]);

  return {
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
    getDynamicOptions
  };
}