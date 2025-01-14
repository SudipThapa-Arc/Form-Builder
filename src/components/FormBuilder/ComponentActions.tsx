import { Button } from '@/components/ui/button';
import { FormComponent } from '@/lib/form-schema';
import { Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ComponentEditor } from './ComponentEditor';

interface ComponentActionsProps {
  component: FormComponent;
  onRemove: (id: string) => void;
  onUpdate: (id: string, component: FormComponent) => void;
}

export function ComponentActions({ component, onRemove, onUpdate }: ComponentActionsProps) {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={() => setShowEditor(true)}>
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onRemove(component.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <ComponentEditor
        component={component}
        onUpdate={onUpdate}
        open={showEditor}
        onOpenChange={setShowEditor}
      />
    </>
  );
} 