import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Element {
  id: string;
  type: 'text' | 'link' | 'image';
  content: string;
  url?: string;
}

interface VisualBuilderProps {
  setHtmlCode: (code: string) => void;
  setCssCode: (code: string) => void;
}

const VisualBuilder = ({ setHtmlCode, setCssCode }: VisualBuilderProps) => {
  const { toast } = useToast();
  const [elements, setElements] = useState<Element[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addElement = (type: 'text' | 'link' | 'image') => {
    const newElement: Element = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? 'Новый текст' : type === 'link' ? 'Ссылка' : 'https://via.placeholder.com/400x300',
      url: type === 'link' ? 'https://example.com' : undefined
    };
    setElements([...elements, newElement]);
    setEditingId(newElement.id);
  };

  const updateElement = (id: string, updates: Partial<Element>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    toast({
      title: "🗑️ Элемент удален",
      description: "Элемент успешно удален из конструктора",
    });
  };

  const generateCode = () => {
    const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Мой сайт</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
${elements.map(el => {
  if (el.type === 'text') {
    return `        <p class="text-element">${el.content}</p>`;
  } else if (el.type === 'link') {
    return `        <a href="${el.url}" class="link-element" target="_blank">${el.content}</a>`;
  } else {
    return `        <img src="${el.content}" class="image-element" alt="Изображение">`;
  }
}).join('\n')}
    </div>
</body>
</html>`;

    const css = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.text-element {
    margin: 20px 0;
    font-size: 18px;
    line-height: 1.6;
    color: #333;
}

.link-element {
    display: inline-block;
    margin: 15px 0;
    padding: 12px 24px;
    background: #a855f7;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s;
}

.link-element:hover {
    background: #9333ea;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(168, 85, 247, 0.4);
}

.image-element {
    width: 100%;
    max-width: 600px;
    height: auto;
    margin: 20px 0;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}`;

    setHtmlCode(html);
    setCssCode(css);
    
    toast({
      title: "✨ Код сгенерирован",
      description: "Код HTML и CSS обновлен на основе конструктора",
    });
  };

  return (
    <div className="flex flex-col h-full bg-card border border-primary/20 rounded-lg overflow-hidden neon-border">
      <div className="border-b border-primary/20 bg-muted/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon name="Wand2" className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-primary">Конструктор сайта</h2>
          </div>
          <Button 
            onClick={generateCode}
            className="bg-primary hover:bg-primary/90"
          >
            <Icon name="Code2" className="mr-2 h-4 w-4" />
            Применить код
          </Button>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => addElement('text')}
            className="flex items-center gap-2"
          >
            <Icon name="Type" className="h-4 w-4" />
            Текст
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => addElement('link')}
            className="flex items-center gap-2"
          >
            <Icon name="Link" className="h-4 w-4" />
            Ссылка
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => addElement('image')}
            className="flex items-center gap-2"
          >
            <Icon name="Image" className="h-4 w-4" />
            Картинка
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Icon name="MousePointerClick" className="h-12 w-12 mb-4 text-primary/40" />
            <p className="text-center">Добавьте элементы, чтобы начать создание сайта</p>
          </div>
        ) : (
          elements.map((element) => (
            <Card key={element.id} className="p-4 bg-muted/30 border-primary/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon 
                    name={element.type === 'text' ? 'Type' : element.type === 'link' ? 'Link' : 'Image'} 
                    className="h-4 w-4 text-primary" 
                  />
                  <span className="font-semibold text-sm capitalize">{element.type === 'text' ? 'Текст' : element.type === 'link' ? 'Ссылка' : 'Картинка'}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(editingId === element.id ? null : element.id)}
                  >
                    <Icon name={editingId === element.id ? 'Check' : 'Pencil'} className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteElement(element.id)}
                  >
                    <Icon name="Trash2" className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              {editingId === element.id ? (
                <div className="space-y-2">
                  {element.type === 'text' ? (
                    <Textarea
                      value={element.content}
                      onChange={(e) => updateElement(element.id, { content: e.target.value })}
                      placeholder="Введите текст..."
                      className="text-sm"
                    />
                  ) : element.type === 'link' ? (
                    <>
                      <Input
                        value={element.content}
                        onChange={(e) => updateElement(element.id, { content: e.target.value })}
                        placeholder="Текст ссылки..."
                        className="text-sm"
                      />
                      <Input
                        value={element.url}
                        onChange={(e) => updateElement(element.id, { url: e.target.value })}
                        placeholder="URL (https://...)"
                        className="text-sm"
                      />
                    </>
                  ) : (
                    <Input
                      value={element.content}
                      onChange={(e) => updateElement(element.id, { content: e.target.value })}
                      placeholder="URL картинки (https://...)"
                      className="text-sm"
                    />
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {element.type === 'text' ? (
                    <p className="break-words">{element.content}</p>
                  ) : element.type === 'link' ? (
                    <div>
                      <p className="font-medium">{element.content}</p>
                      <p className="text-xs text-primary truncate">{element.url}</p>
                    </div>
                  ) : (
                    <img src={element.content} alt="Preview" className="max-w-full h-auto rounded" />
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default VisualBuilder;
