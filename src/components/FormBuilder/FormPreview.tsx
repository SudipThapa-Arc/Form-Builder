import React from 'react';
import { FormComponent } from '@/lib/form-schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ComponentActions } from './ComponentActions';
import { z } from 'zod';

interface FormPreviewProps {
  components: FormComponent[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, component: FormComponent) => void;
  previewMode: boolean;
}

export const FormPreview = React.memo(({ 
  components, 
  onRemove,
  onUpdate,
  previewMode 
}: FormPreviewProps) => {
  const form = useForm({
    resolver: zodResolver(generateValidationSchema(components))
  });

  const onSubmit = (data: any) => {
    toast.success('Form submitted successfully', {
      description: 'Form data has been validated and is ready to be processed'
    });
    console.log(data);
  };

  const renderComponent = (component: FormComponent, field: any) => {
    switch (component.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'phone':
      case 'date':
        return (
          <Input
            {...field}
            type={component.type}
            placeholder={component.placeholder}
            required={component.required}
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={component.placeholder}
            required={component.required}
          />
        );
      case 'select':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={component.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {component.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'radio':
        return (
          <RadioGroup>
            {component.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={component.id} />
            <Label htmlFor={component.id}>{component.label}</Label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          {components.map((component) => (
            <FormField
              key={component.id}
              name={component.id}
              render={({ field }) => (
                <div className={cn(
                  "relative group p-4 rounded-lg transition-all",
                  !previewMode && "hover:bg-muted/50",
                  component.width === '1/2' && 'sm:col-span-6',
                  component.width === '1/3' && 'sm:col-span-4',
                  component.width === '1/4' && 'sm:col-span-3'
                )}>
                  {!previewMode && (
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ComponentActions
                        component={component}
                        onRemove={onRemove}
                        onUpdate={onUpdate}
                      />
                    </div>
                  )}
                  <FormItem className="space-y-3">
                    <div className="space-y-1">
                      <FormLabel className="text-base">
                        {component.label}
                        {component.required && <span className="text-destructive ml-1">*</span>}
                      </FormLabel>
                      {component.description && (
                        <FormDescription>{component.description}</FormDescription>
                      )}
                    </div>
                    <FormControl>
                      {renderComponent(component, field)}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
          ))}
        </div>
        {previewMode && components.length > 0 && (
          <div className="flex justify-center pt-6">
            <Button type="submit" size="lg" className="min-w-[200px]">
              Submit Form
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
});

function generateValidationSchema(components: FormComponent[]) {
  const schema: Record<string, any> = {};

  components.forEach((component) => {
    let fieldSchema: z.ZodTypeAny = z.string().optional();

    switch (component.type) {
      case 'text':
        fieldSchema = z.string();
        break;
      case 'email':
        fieldSchema = z.string().email('Invalid email address');
        break;
      case 'number':
        fieldSchema = z.number();
        break;
      case 'phone':
        fieldSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number');
        break;
      case 'date':
        fieldSchema = z.date();
        break;
      default:
        fieldSchema = z.any();
    }
    if (component.required) {
      fieldSchema = z.string(); // Reset to non-optional type
    }

    if (component.validation) {
      component.validation.forEach((rule) => {
        switch (rule.type) {
          case 'min':
            if (component.type === 'number') {
              fieldSchema = (fieldSchema as z.ZodNumber).min(rule.value, rule.message);
            } else {
              fieldSchema = (fieldSchema as z.ZodString).min(rule.value, rule.message);
            }
            break;
          case 'max':
            if (component.type === 'number') {
              fieldSchema = (fieldSchema as z.ZodNumber).max(rule.value, rule.message);
            } else {
              fieldSchema = (fieldSchema as z.ZodString).max(rule.value, rule.message);
            }
            break;
          case 'pattern':
            fieldSchema = (fieldSchema as z.ZodString).regex(new RegExp(rule.value), rule.message);
            break;
        }
      });
    }

    schema[component.id] = fieldSchema;
  });

  return z.object(schema);
}
