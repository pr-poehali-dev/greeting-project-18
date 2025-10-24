import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import CodeEditor from '@/components/CodeEditor';
import VisualBuilder from '@/components/VisualBuilder';
import FaviconUploader from '@/components/FaviconUploader';

const Index = () => {
  const { toast } = useToast();
  const [htmlCode, setHtmlCode] = useState('<h1>Hello World!</h1>\n<p>Start coding...</p>');
  const [cssCode, setCssCode] = useState('body {\n  font-family: Arial;\n  padding: 20px;\n}\n\nh1 {\n  color: #a855f7;\n}');
  const [jsCode, setJsCode] = useState('console.log("PlutSites ready!");');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [showProjects, setShowProjects] = useState(false);
  const [userId] = useState(() => localStorage.getItem('plutsites_user_id') || `user_${Date.now()}`);

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

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const response = await fetch('https://functions.poehali.dev/c4698a17-171d-4da7-b5ce-7df72c87f5a6', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: htmlCode,
          css: cssCode,
          js: jsCode,
          favicon: faviconUrl
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPublishedUrl(`https://functions.poehali.dev/c4698a17-171d-4da7-b5ce-7df72c87f5a6?domain=${data.domain}`);
        toast({
          title: "🚀 Сайт опубликован!",
          description: `Ваш сайт доступен по домену: ${data.domain}`,
        });
      }
    } catch (error) {
      toast({
        title: "❌ Ошибка публикации",
        description: "Не удалось опубликовать сайт. Попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const saveProject = async (name: string) => {
    try {
      localStorage.setItem('plutsites_user_id', userId);
      
      const url = currentProjectId 
        ? 'https://functions.poehali.dev/9c8b0454-cfe3-4052-95c1-8890f5cd34d6'
        : 'https://functions.poehali.dev/9c8b0454-cfe3-4052-95c1-8890f5cd34d6';
      
      const method = currentProjectId ? 'PUT' : 'POST';
      const body = currentProjectId 
        ? { id: currentProjectId, name, html: htmlCode, css: cssCode, js: jsCode, favicon: faviconUrl }
        : { name, html: htmlCode, css: cssCode, js: jsCode, favicon: faviconUrl };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId
        },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (!currentProjectId && data.id) {
          setCurrentProjectId(data.id);
        }
        toast({
          title: "✅ Проект сохранен",
          description: `Проект "${name}" успешно сохранен`,
        });
        loadProjects();
      }
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Не удалось сохранить проект",
        variant: "destructive"
      });
    }
  };

  const loadProjects = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/9c8b0454-cfe3-4052-95c1-8890f5cd34d6', {
        headers: {
          'X-User-Id': userId
        }
      });
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to load projects', error);
    }
  };

  const loadProject = async (id: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/9c8b0454-cfe3-4052-95c1-8890f5cd34d6?id=${id}`, {
        headers: {
          'X-User-Id': userId
        }
      });
      const data = await response.json();
      
      setHtmlCode(data.html);
      setCssCode(data.css);
      setJsCode(data.js);
      setFaviconUrl(data.favicon || '');
      setCurrentProjectId(id);
      setShowProjects(false);
      
      toast({
        title: "📂 Проект загружен",
        description: `Проект "${data.name}" успешно загружен`,
      });
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Не удалось загрузить проект",
        variant: "destructive"
      });
    }
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
              <SheetContent side="left" className="w-80 bg-card border-primary/20 overflow-y-auto">
                <div className="flex flex-col gap-4 mt-8">
                  <Button 
                    onClick={() => setShowBuilder(true)}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg transition-all hover:scale-105"
                  >
                    <Icon name="Wand2" className="mr-2 h-5 w-5" />
                    Конструктор
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setShowProjects(true);
                      loadProjects();
                    }}
                    className="w-full bg-muted hover:bg-muted/80 text-foreground font-semibold text-lg transition-all hover:scale-105"
                  >
                    <Icon name="FolderOpen" className="mr-2 h-5 w-5" />
                    Проекты
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      const name = prompt('Название проекта:', currentProjectId ? 'Текущий проект' : 'Новый проект');
                      if (name) saveProject(name);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg transition-all hover:scale-105"
                  >
                    <Icon name="Save" className="mr-2 h-5 w-5" />
                    Сохранить
                  </Button>
                  
                  <FaviconUploader faviconUrl={faviconUrl} setFaviconUrl={setFaviconUrl} />
                  
                  <Button 
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg neon-border transition-all hover:scale-105"
                  >
                    <Icon name="Rocket" className="mr-2 h-5 w-5" />
                    {isPublishing ? 'Публикация...' : 'Публикация'}
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
                  {publishedUrl && (
                    <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/30">
                      <p className="text-xs text-muted-foreground mb-2">Опубликованный сайт:</p>
                      <a 
                        href={publishedUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline break-all"
                      >
                        {publishedUrl}
                      </a>
                    </div>
                  )}
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
        <CodeEditor 
          htmlCode={htmlCode}
          cssCode={cssCode}
          jsCode={jsCode}
          setHtmlCode={setHtmlCode}
          setCssCode={setCssCode}
          setJsCode={setJsCode}
        />

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

      <Dialog open={showBuilder} onOpenChange={setShowBuilder}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Icon name="Wand2" className="h-6 w-6" />
              Визуальный конструктор
            </DialogTitle>
            <DialogDescription>
              Создавайте сайт визуально, добавляя текст, ссылки и картинки
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <VisualBuilder setHtmlCode={setHtmlCode} setCssCode={setCssCode} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProjects} onOpenChange={setShowProjects}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Icon name="FolderOpen" className="h-6 w-6" />
              Мои проекты
            </DialogTitle>
            <DialogDescription>
              Выберите проект для загрузки
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {projects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Inbox" className="h-12 w-12 mx-auto mb-4 text-primary/40" />
                <p>У вас пока нет сохраненных проектов</p>
              </div>
            ) : (
              projects.map((project) => (
                <Card 
                  key={project.id}
                  className="p-4 hover:bg-muted/50 cursor-pointer transition-colors border-primary/20"
                  onClick={() => loadProject(project.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Обновлен: {new Date(project.updated_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <Icon name="ChevronRight" className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;