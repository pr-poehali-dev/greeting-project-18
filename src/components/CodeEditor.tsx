import { useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface CodeEditorProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  setHtmlCode: (code: string) => void;
  setCssCode: (code: string) => void;
  setJsCode: (code: string) => void;
}

const CodeEditor = ({ htmlCode, cssCode, jsCode, setHtmlCode, setCssCode, setJsCode }: CodeEditorProps) => {
  const { toast } = useToast();
  const htmlFileRef = useRef<HTMLInputElement>(null);
  const cssFileRef = useRef<HTMLInputElement>(null);
  const jsFileRef = useRef<HTMLInputElement>(null);

  const handleImportFile = (type: 'html' | 'css' | 'js', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (type === 'html') setHtmlCode(content);
      if (type === 'css') setCssCode(content);
      if (type === 'js') setJsCode(content);
      
      toast({
        title: "✅ Импорт завершен",
        description: `Файл ${file.name} успешно загружен`,
      });
    };
    reader.readAsText(file);
  };

  const handleExportFile = (type: 'html' | 'css' | 'js') => {
    let content = '';
    let filename = '';
    
    if (type === 'html') {
      content = htmlCode;
      filename = 'index.html';
    } else if (type === 'css') {
      content = cssCode;
      filename = 'styles.css';
    } else {
      content = jsCode;
      filename = 'script.js';
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "💾 Экспорт завершен",
      description: `Файл ${filename} сохранен`,
    });
  };

  return (
    <div className="flex-1 bg-card border border-primary/20 rounded-lg overflow-hidden neon-border">
      <Tabs defaultValue="html" className="h-full flex flex-col">
        <TabsList className="w-full justify-start rounded-none bg-muted/50 border-b border-primary/20 p-0">
          <TabsTrigger 
            value="html" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-base px-6 py-3 rounded-none border-r border-primary/20"
          >
            <Icon name="FileCode" className="mr-2 h-4 w-4" />
            HTML
          </TabsTrigger>
          <TabsTrigger 
            value="css"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-base px-6 py-3 rounded-none border-r border-primary/20"
          >
            <Icon name="Palette" className="mr-2 h-4 w-4" />
            CSS
          </TabsTrigger>
          <TabsTrigger 
            value="js"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold text-base px-6 py-3 rounded-none"
          >
            <Icon name="Zap" className="mr-2 h-4 w-4" />
            JS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="html" className="flex-1 m-0 p-0 flex flex-col">
          <div className="flex gap-2 p-2 border-b border-primary/20 bg-muted/30">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => htmlFileRef.current?.click()}
              className="text-xs"
            >
              <Icon name="Upload" className="mr-1 h-3 w-3" />
              Импорт
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleExportFile('html')}
              className="text-xs"
            >
              <Icon name="Download" className="mr-1 h-3 w-3" />
              Экспорт
            </Button>
            <input
              ref={htmlFileRef}
              type="file"
              accept=".html"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImportFile('html', e.target.files[0])}
            />
          </div>
          <Textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            className="flex-1 resize-none border-0 rounded-none bg-input text-foreground code-editor focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm p-4"
            placeholder="Введите HTML код..."
          />
        </TabsContent>

        <TabsContent value="css" className="flex-1 m-0 p-0 flex flex-col">
          <div className="flex gap-2 p-2 border-b border-primary/20 bg-muted/30">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => cssFileRef.current?.click()}
              className="text-xs"
            >
              <Icon name="Upload" className="mr-1 h-3 w-3" />
              Импорт
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleExportFile('css')}
              className="text-xs"
            >
              <Icon name="Download" className="mr-1 h-3 w-3" />
              Экспорт
            </Button>
            <input
              ref={cssFileRef}
              type="file"
              accept=".css"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImportFile('css', e.target.files[0])}
            />
          </div>
          <Textarea
            value={cssCode}
            onChange={(e) => setCssCode(e.target.value)}
            className="flex-1 resize-none border-0 rounded-none bg-input text-foreground code-editor focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm p-4"
            placeholder="Введите CSS код..."
          />
        </TabsContent>

        <TabsContent value="js" className="flex-1 m-0 p-0 flex flex-col">
          <div className="flex gap-2 p-2 border-b border-primary/20 bg-muted/30">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => jsFileRef.current?.click()}
              className="text-xs"
            >
              <Icon name="Upload" className="mr-1 h-3 w-3" />
              Импорт
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleExportFile('js')}
              className="text-xs"
            >
              <Icon name="Download" className="mr-1 h-3 w-3" />
              Экспорт
            </Button>
            <input
              ref={jsFileRef}
              type="file"
              accept=".js"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImportFile('js', e.target.files[0])}
            />
          </div>
          <Textarea
            value={jsCode}
            onChange={(e) => setJsCode(e.target.value)}
            className="flex-1 resize-none border-0 rounded-none bg-input text-foreground code-editor focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm p-4"
            placeholder="Введите JavaScript код..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeEditor;
