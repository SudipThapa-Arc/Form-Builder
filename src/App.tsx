import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState, useCallback } from 'react';
import { FormComponent } from './lib/form-schema';
import { ComponentPalette } from './components/FormBuilder/ComponentPalette';
import { FormCanvas } from './components/FormBuilder/FormCanvas';
import { Button } from './components/ui/button';
import { Eye, Code, Save, Undo, Redo, Download, FormInput } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';
import { cn } from "@/lib/utils";

function App() {
  const [components, setComponents] = useState<FormComponent[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [history, setHistory] = useState<FormComponent[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const { toast } = useToast();

  const handleDrop = useCallback((component: FormComponent) => {
    setComponents(prev => {
      const newComponents = [...prev, component];
      // Add to history
      setHistory(h => [...h.slice(0, historyIndex + 1), newComponents]);
      setHistoryIndex(i => i + 1);
      return newComponents;
    });
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(i => i - 1);
      setComponents(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(i => i + 1);
      setComponents(history[historyIndex + 1]);
    }
  };

  const handleSave = () => {
    const formData = JSON.stringify(components, null, 2);
    const blob = new Blob([formData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-config.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Form Saved",
      description: "Your form configuration has been downloaded successfully.",
    });
  };

  const handleRemove = useCallback((id: string) => {
    setComponents(prev => {
      const newComponents = prev.filter(c => c.id !== id);
      // Add to history
      setHistory(h => [...h.slice(0, historyIndex + 1), newComponents]);
      setHistoryIndex(i => i + 1);
      return newComponents;
    });
  }, [historyIndex]);

  const handleUpdate = useCallback((id: string, component: FormComponent) => {
    setComponents(prev => {
      const newComponents = prev.map(c => c.id === id ? component : c);
      setHistory(h => [...h.slice(0, historyIndex + 1), newComponents]);
      setHistoryIndex(i => i + 1);
      return newComponents;
    });
  }, [historyIndex]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 max-w-screen-2xl items-center gap-4">
            <div className="flex items-center gap-2">
              <FormInput className="h-5 w-5" />
              <h1 className="text-xl font-semibold tracking-tight">Form Builder</h1>
            </div>
            
            <div className="flex items-center gap-2 ml-6">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2",
                  !previewMode && "bg-muted"
                )}
                onClick={() => setPreviewMode(false)}
              >
                <Code className="h-4 w-4" />
                Editor
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2",
                  previewMode && "bg-muted"
                )}
                onClick={() => setPreviewMode(true)}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleUndo}
                  disabled={historyIndex === 0}
                  className="h-8 w-8"
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRedo}
                  disabled={historyIndex === history.length - 1}
                  className="h-8 w-8"
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Form Configuration</DialogTitle>
                  </DialogHeader>
                  <pre className="mt-4 rounded-lg bg-muted p-4 overflow-auto max-h-[400px]">
                    <code>{JSON.stringify(components, null, 2)}</code>
                  </pre>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {!previewMode && <ComponentPalette />}
            <FormCanvas
              components={components}
              onDrop={handleDrop}
              onRemove={handleRemove}
              onUpdate={handleUpdate}
              previewMode={previewMode}
            />
          </div>
        </main>
      </div>
      <Toaster />
    </DndProvider>
  );
}

export default App;