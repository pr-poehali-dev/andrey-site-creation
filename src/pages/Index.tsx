import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [text, setText] = useState('https://poehali.dev');
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#222222');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const downloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (!canvas) return;

    const svg = canvas.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold font-serif tracking-tight">Генератор QR-кодов</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Настройки QR-кода</CardTitle>
                <CardDescription>Укажите данные и настройте внешний вид</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="text">Текст или URL</Label>
                  <Input
                    id="text"
                    placeholder="Введите текст или ссылку"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Размер: {size}px</Label>
                  <Slider
                    value={[size]}
                    onValueChange={(value) => setSize(value[0])}
                    min={128}
                    max={512}
                    step={32}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Уровень коррекции ошибок</Label>
                  <Select value={level} onValueChange={(val) => setLevel(val as 'L' | 'M' | 'Q' | 'H')}>
                    <SelectTrigger id="level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Низкий (7%)</SelectItem>
                      <SelectItem value="M">Средний (15%)</SelectItem>
                      <SelectItem value="Q">Высокий (25%)</SelectItem>
                      <SelectItem value="H">Максимальный (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fg-color">Цвет кода</Label>
                    <div className="flex gap-2">
                      <Input
                        id="fg-color"
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bg-color">Цвет фона</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bg-color"
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Примеры использования</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Icon name="Link" size={20} className="text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Ссылки на сайты</p>
                    <p className="text-sm text-muted-foreground">https://example.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Mail" size={20} className="text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-sm text-muted-foreground">mailto:info@example.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Phone" size={20} className="text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Телефон</p>
                    <p className="text-sm text-muted-foreground">tel:+79001234567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Wifi" size={20} className="text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">WiFi</p>
                    <p className="text-sm text-muted-foreground">WIFI:T:WPA;S:NetworkName;P:Password;;</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Ваш QR-код</CardTitle>
                <CardDescription>Предпросмотр и скачивание</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center p-8 bg-muted rounded-lg" id="qr-code">
                  {text && (
                    <QRCodeSVG
                      value={text}
                      size={size}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level={level}
                      includeMargin={true}
                    />
                  )}
                </div>

                <Button onClick={downloadQR} className="w-full" size="lg">
                  <Icon name="Download" className="mr-2" size={18} />
                  Скачать QR-код (SVG)
                </Button>

                <div className="p-4 bg-secondary rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Info" size={16} className="text-primary" />
                    <span className="font-semibold">Совет</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    QR-код сохраняется в векторном формате SVG для лучшего качества печати. 
                    Рекомендуем тестировать готовые коды перед использованием.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
