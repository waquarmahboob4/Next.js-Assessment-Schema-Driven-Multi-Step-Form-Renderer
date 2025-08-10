export interface FormField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'checkbox' | 'radio' | 'date' | 'group';
    required?: boolean;
    options?: string[];
    optionSource?: {
      key: string;
      map: Record<string, string[]>;
    };
    dependencies?: Array<{
      key: string;
      equals?: any;
      notEmpty?: boolean;
    }>;
    fields?: FormField[];
  }
  
  export interface FormStep {
    title: string;
    description?: string;
    fields: FormField[];
  }
  
  export interface FormSchema {
    title?: string;
    description?: string;
    steps: FormStep[];
  }
  
  export interface FormData {
    [key: string]: any;
  }