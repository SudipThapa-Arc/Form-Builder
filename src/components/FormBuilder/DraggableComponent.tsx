import React from 'react';
import { useDrag } from 'react-dnd';
import { cn } from '@/lib/utils';
import { FormComponent } from '@/lib/form-schema';
import { Card } from '@/components/ui/card';

interface DraggableComponentProps {
  component: FormComponent;
}

export const DraggableComponent = React.memo(({ component }: DraggableComponentProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'form-component',
    item: component,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        'cursor-move',
        isDragging && 'opacity-50'
      )}
    >
      <Card className="p-4 hover:bg-accent">
        <h3 className="text-sm font-medium">{component.label}</h3>
        <p className="text-xs text-muted-foreground">{component.type}</p>
      </Card>
    </div>
  );
});