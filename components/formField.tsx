"use client";

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FormField as FormFieldType, FormData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface FormFieldProps {
  field: FormFieldType;
  formData: FormData;
  checkDependencies: (field: FormFieldType, values: FormData) => { show: boolean; enable: boolean };
  getDynamicOptions: (field: FormFieldType, values: FormData) => string[];
}

export function FormField({ field, formData, checkDependencies, getDynamicOptions }: FormFieldProps) {
  const { control, formState: { errors }, watch } = useFormContext();
  const watchedValues = watch();
  const { show, enable } = checkDependencies(field, watchedValues);

  if (!show) return null;

  const RenderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <Controller
            name={field.key}
            control={control}
            rules={{
              required: field.required ? `${field.label} is required` : false
            }}
            render={({ field: fieldProps }) => (
              <Input
                {...fieldProps}
                disabled={!enable}
                className={cn(
                  "transition-all duration-200",
                  !enable && "opacity-50 cursor-not-allowed",
                  errors[field.key] && "border-red-500 focus:border-red-500"
                )}
              />
            )}
          />
        );

      case 'number':
        return (
          <Controller
            name={field.key}
            control={control}
            rules={{
              required: field.required ? `${field.label} is required` : false
            }}
            render={({ field: fieldProps }) => (
              <Input
                {...fieldProps}
                type="number"
                disabled={!enable}
                onChange={(e) => fieldProps.onChange(e.target.value ? Number(e.target.value) : '')}
                className={cn(
                  "transition-all duration-200",
                  !enable && "opacity-50 cursor-not-allowed",
                  errors[field.key] && "border-red-500 focus:border-red-500"
                )}
              />
            )}
          />
        );

      case 'select':
        const options = getDynamicOptions(field, watchedValues);
        return (
          <Controller
            name={field.key}
            control={control}
            rules={{
              required: field.required ? `${field.label} is required` : false
            }}
            render={({ field: fieldProps }) => (
              <Select
                onValueChange={fieldProps.onChange}
                value={fieldProps.value || ''}
                disabled={!enable}
              >
                <SelectTrigger className={cn(
                  "transition-all duration-200",
                  !enable && "opacity-50 cursor-not-allowed",
                  errors[field.key] && "border-red-500 focus:border-red-500"
                )}>
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            name={field.key}
            control={control}
            render={({ field: fieldProps }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.key}
                  checked={fieldProps.value || false}
                  onCheckedChange={fieldProps.onChange}
                  disabled={!enable}
                  className={cn(
                    "transition-all duration-200",
                    !enable && "opacity-50 cursor-not-allowed"
                  )}
                />
                <Label
                  htmlFor={field.key}
                  className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    !enable && "opacity-50"
                  )}
                >
                  {field.label}
                </Label>
              </div>
            )}
          />
        );

      case 'group':
        return (
          <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-700">
                {field.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {field.fields?.map((subField) => (
                <FormField
                  key={subField.key}
                  field={subField}
                  formData={formData}
                  checkDependencies={checkDependencies}
                  getDynamicOptions={getDynamicOptions}
                />
              ))}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (field.type === 'group' || field.type === 'checkbox') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-2"
        >
            {RenderField()}
          {errors[field.key] && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600"
            >
              {errors[field.key]?.message as string}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="space-y-2"
      >
        <Label 
          htmlFor={field.key} 
          className={cn(
            "text-sm font-medium leading-none",
            field.required && "after:content-['*'] after:ml-0.5 after:text-red-500",
            !enable && "opacity-50"
          )}
        >
          {field.label}
        </Label>
        {RenderField()}
        {errors[field.key] && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-600"
          >
            {errors[field.key]?.message as string}
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}