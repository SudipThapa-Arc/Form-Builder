import React from 'react';
import { useDrop } from 'react-dnd';
import { FormComponent } from '@/lib/form-schema';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FormPreview } from './FormPreview';
// import { FormInput } from '@/components/ui/form-input';
import { FormInput } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormCanvasProps {
  components: FormComponent[];
  onDrop: (component: FormComponent) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, component: FormComponent) => void;
  previewMode: boolean;
}

export const FormCanvas = React.memo(({ 
  components, 
  onDrop, 
  onRemove,
  onUpdate,
  previewMode 
}: FormCanvasProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'form-component',
    drop: (item: FormComponent) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={cn(
        "flex-1 p-8 border-2 border-dashed rounded-xl min-h-[calc(100vh-8rem)]",
        "bg-background/50 backdrop-blur-sm shadow-sm",
        "transition-colors duration-200",
        isOver && "border-primary/50 bg-primary/5"
      )}
    >
      <ScrollArea className="h-full">
        <div className="max-w-4xl mx-auto">
          {components.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground space-y-4">
              <div className="p-8 rounded-full bg-muted/50 ring-1 ring-border/50">
                <FormInput className="h-12 w-12" />
              </div>
              <p className="text-xl font-medium">Drag and drop components here</p>
              <p className="text-sm text-muted-foreground max-w-md text-center">
                Start building your form by dragging components from the left panel. 
                Each component can be customized after dropping.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Form Preview</h2>
                  <p className="text-sm text-muted-foreground">
                    {previewMode ? "Preview mode - see how your form looks to users" : "Edit mode - customize your form components"}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {components.length} {components.length === 1 ? 'component' : 'components'}
                </p>
              </div>
              <FormPreview
                components={components}
                onRemove={onRemove}
                onUpdate={onUpdate}
                previewMode={previewMode}
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
});