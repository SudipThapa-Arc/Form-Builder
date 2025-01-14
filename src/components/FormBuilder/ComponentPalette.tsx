import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DraggableComponent } from './DraggableComponent';
import { FormComponent } from '@/lib/form-schema';

const defaultComponents: FormComponent[] = [
  {
    id: 'text-input',
    type: 'text',
    label: 'Text Input',
    placeholder: 'Enter text...',
    required: false,
  },
  {
    id: 'email-input',
    type: 'email',
    label: 'Email Input',
    placeholder: 'Enter email...',
    required: false,
  },
  {
    id: 'number-input',
    type: 'number',
    label: 'Number Input',
    placeholder: 'Enter number...',
    required: false,
  },
  {
    id: 'textarea',
    type: 'textarea',
    label: 'Text Area',
    placeholder: 'Enter long text...',
    required: false,
  },
  {
    id: 'select',
    type: 'select',
    label: 'Select',
    placeholder: 'Select an option',
    required: false,
    options: ['Option 1', 'Option 2', 'Option 3'],
  },
  {
    id: 'radio',
    type: 'radio',
    label: 'Radio Group',
    required: false,
    options: ['Option 1', 'Option 2', 'Option 3'],
  },
  {
    id: 'checkbox',
    type: 'checkbox',
    label: 'Checkbox',
    required: false,
  },
  {
    id: 'date',
    type: 'date',
    label: 'Date Input',
    required: false,
  },
  {
    id: 'phone',
    type: 'phone',
    label: 'Phone Input',
    placeholder: 'Enter phone number...',
    required: false,
  },
  {
    id: 'file',
    type: 'file',
    label: 'File Upload',
    required: false,
  },
];

export const ComponentPalette = React.memo(() => {
  return (
    <div className="bg-muted/10 rounded-lg border">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Components</h2>
      </div>
      <ScrollArea className="lg:h-[calc(100vh-10rem)] h-64">
        <div className="p-4 grid grid-cols-2 lg:grid-cols-1 gap-2">
          {defaultComponents.map((component) => (
            <DraggableComponent key={component.id} component={component} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
});