import { useState } from 'react';
import { FormComponent } from '@/lib/form-schema';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ComponentEditorProps {
  component: FormComponent;
  onUpdate: (id: string, component: FormComponent) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComponentEditor({ 
  component, 
  onUpdate, 
  open, 
  onOpenChange 
}: ComponentEditorProps) {
  const [localComponent, setLocalComponent] = useState<FormComponent>(component);

  const handleSave = () => {
    onUpdate(component.id, localComponent);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Component</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={localComponent.label}
              onChange={(e) => setLocalComponent(prev => ({
                ...prev,
                label: e.target.value
              }))}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="width">Width</Label>
            <Select
              value={localComponent.width || 'full'}
              onValueChange={(value) => setLocalComponent(prev => ({
                ...prev,
                width: value as FormComponent['width']
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full width</SelectItem>
                <SelectItem value="1/2">Half width</SelectItem>
                <SelectItem value="1/3">One third</SelectItem>
                <SelectItem value="1/4">One quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="required"
              checked={localComponent.required}
              onCheckedChange={(checked) => setLocalComponent(prev => ({
                ...prev,
                required: checked
              }))}
            />
            <Label htmlFor="required">Required</Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 