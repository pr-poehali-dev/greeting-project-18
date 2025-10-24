import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [htmlCode, setHtmlCode] = useState('<h1>Hello World!</h1>\n<p>Start coding...</p>');
  const [cssCode, setCssCode] = useState('body {\n  font-family: Arial;\n  padding: 20px;\n}\n\nh1 {\n  color: #a855f7;\n}');
  const [jsCode, setJsCode] = useState('console.log("PlutSites ready!");');

  const getPreviewContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `;
  };

  const handlePublish = () => {
    toast({
      title: "🚀 Публикация сайта",
      description: "Функция публикации скоро будет доступна! Ваш сайт будет опубликован с реальным доменом.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/20 transition-all">
                  <Icon name="Menu" className="h-6 w-6 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-card border-primary/20">
                <div className="flex flex-col gap-4 mt-8">
                  <Button 
                    onClick={handlePublish}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg neon-border transition-all hover:scale-105"
                  >
                    <Icon name="Rocket" className="mr-2 h-5 w-5" />
                    Публикация
                  </Button>
                  <Button 
                    asChild
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg transition-all hover:scale-105"
                  >
                    <a href="https://t.me/zymoyy" target="_blank" rel="noopener noreferrer">
                      <Icon name="Send" className="mr-2 h-5 w-5" />
                      Телеграмм
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            
            <h1 className="text-3xl font-bold neon-glow text-primary tracking-wider">
              PlutSites
            </h1>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Code2" className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Бесплатный хостинг</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col container mx-auto p-4 gap-4">
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

            <TabsContent value="html" className="flex-1 m-0 p-0">
              <Textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="h-full resize-none border-0 rounded-none bg-input text-foreground code-editor focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm p-4"
                placeholder="Введите HTML код..."
              />
            </TabsContent>

            <TabsContent value="css" className="flex-1 m-0 p-0">
              <Textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                className="h-full resize-none border-0 rounded-none bg-input text-foreground code-editor focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm p-4"
                placeholder="Введите CSS код..."
              />
            </TabsContent>

            <TabsContent value="js" className="flex-1 m-0 p-0">
              <Textarea
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                className="h-full resize-none border-0 rounded-none bg-input text-foreground code-editor focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm p-4"
                placeholder="Введите JavaScript код..."
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="h-[400px] bg-card border border-secondary/30 rounded-lg overflow-hidden">
          <div className="bg-muted/50 border-b border-secondary/30 px-4 py-2 flex items-center gap-2">
            <Icon name="Eye" className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold text-secondary">Превью сайта</span>
          </div>
          <iframe
            srcDoc={getPreviewContent()}
            className="w-full h-[calc(100%-40px)] bg-white"
            title="preview"
            sandbox="allow-scripts"
          />
        </div>
      </main>

      <footer className="border-t border-primary/20 bg-card/50 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>PlutSites © 2025 • Создавайте и публикуйте сайты бесплатно</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
