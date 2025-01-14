import { z } from "zod";

export type ValidationRule = {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
};

export type FormComponent = {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'phone' | 'file';
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: ValidationRule[];
  description?: string;
  className?: string;
  width?: 'full' | '1/2' | '1/3' | '1/4';
  conditions?: {
    field: string;
    operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
    value: any;
  }[];
};

export const formComponentSchema = z.object({
  id: z.string(),
  type: z.enum([
    "text",
    "number",
    "email",
    "textarea",
    "select",
    "radio",
    "checkbox",
    "date",
    "phone",
    "file"
  ]),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
  }).optional(),
});

export const formSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  components: z.array(formComponentSchema),
});

export type Form = z.infer<typeof formSchema>;