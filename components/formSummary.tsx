"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FormData } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FormSummaryProps {
  formData: FormData;
}

export function FormSummary({ formData }: FormSummaryProps) {
  const formatValue = (key: string, value: any): string => {
    if (value === null || value === undefined || value === '') {
      return 'Not specified';
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    if (typeof value === 'number') {
      return value.toString();
    }
    
    return value.toString();
  };

  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const groupedData = Object.entries(formData).reduce((acc, [key, value]) => {
    if (key.startsWith('phone.') || ['countryCode', 'number'].includes(key)) {
      acc.phone = acc.phone || {};
      acc.phone[key.replace('phone.', '')] = value;
    } else if (['hasPool', 'hasGym', 'hasBalcony'].includes(key)) {
      acc.amenities = acc.amenities || {};
      acc.amenities[key] = value;
    } else {
      acc.general = acc.general || {};
      acc.general[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Form Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
              Please review your information before submitting. You can go back to edit any section if needed.
            </p>
            
            {groupedData.general && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  General Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(groupedData.general).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-3 bg-gray-50">
                      <div className="font-medium text-sm text-gray-600 mb-1">
                        {formatKey(key)}
                      </div>
                      <div className="text-gray-900">
                        {formatValue(key, value)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {groupedData.phone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">📞</span>
                  Phone Information
                </h3>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(groupedData.phone).map(([key, value]) => (
                        <div key={key}>
                          <div className="font-medium text-sm text-gray-600 mb-1">
                            {formatKey(key)}
                          </div>
                          <div className="text-gray-900">
                            {formatValue(key, value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {groupedData.amenities && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(groupedData.amenities).map(([key, value]) => (
                    <Badge
                      key={key}
                      variant={value ? "default" : "secondary"}
                      className={cn(
                        "transition-all duration-200",
                        value ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {formatKey(key.replace('has', ''))} {value ? '✓' : '✗'}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}