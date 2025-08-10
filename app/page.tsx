"use client"
import { MultiStepForm } from '@/components/multistepForm';
import { propertyFormSchema } from '@/lib/schema';

export default function Home() {
  return (
    <MultiStepForm key="propertyForm" schema={propertyFormSchema} />
  );
}
