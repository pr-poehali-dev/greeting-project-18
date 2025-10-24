import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface FaviconUploaderProps {
  faviconUrl: string;
  setFaviconUrl: (url: string) => void;
}

const FaviconUploader = ({ faviconUrl, setFaviconUrl }: FaviconUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ Ошибка",
        description: "Пожалуйста, выберите изображение",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setFaviconUrl(dataUrl);
      setIsConverting(false);
      
      toast({
        title: "✅ Favicon загружен",
        description: "Иконка сайта успешно установлена",
      });
    };
    
    reader.onerror = () => {
      setIsConverting(false);
      toast({
        title: "❌ Ошибка",
        description: "Не удалось загрузить файл",
        variant: "destructive"
      });
    };
    
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (faviconUrl && faviconUrl.startsWith('http')) {
      toast({
        title: "✅ Favicon установлен",
        description: "Иконка сайта установлена по URL",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-primary/20">
      <div className="flex items-center gap-2">
        <Icon name="Image" className="h-5 w-5 text-primary" />
        <Label className="text-sm font-semibold">Иконка сайта (Favicon)</Label>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="https://example.com/favicon.ico или вставьте Data URL"
            value={faviconUrl}
            onChange={(e) => setFaviconUrl(e.target.value)}
            onBlur={handleUrlSubmit}
            className="flex-1 text-sm"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isConverting}
          >
            <Icon name="Upload" className="h-4 w-4 mr-1" />
            {isConverting ? 'Загрузка...' : 'Файл'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          />
        </div>

        {faviconUrl && (
          <div className="flex items-center gap-3 p-3 bg-background rounded border border-primary/20">
            <div className="w-8 h-8 flex items-center justify-center bg-card rounded border border-primary/10">
              {faviconUrl.startsWith('data:') || faviconUrl.startsWith('http') ? (
                <img src={faviconUrl} alt="Favicon preview" className="w-6 h-6 object-contain" />
              ) : (
                <Icon name="ImageOff" className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <span className="text-xs text-muted-foreground flex-1 truncate">
              {faviconUrl.startsWith('data:') ? 'Data URL (файл загружен)' : faviconUrl}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setFaviconUrl('')}
            >
              <Icon name="X" className="h-4 w-4" />
            </Button>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Загрузите изображение или укажите URL. Рекомендуемый размер: 16x16 или 32x32 пикселей.
        </p>
      </div>
    </div>
  );
};

export default FaviconUploader;
