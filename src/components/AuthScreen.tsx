import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

type AuthStep = 'phone' | 'code' | 'authenticated';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const codeInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 'code' && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 1) return `+${numbers}`;
    if (numbers.length <= 4) return `+${numbers.slice(0, 1)} (${numbers.slice(1)}`;
    if (numbers.length <= 7) return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
    if (numbers.length <= 9) return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7)}`;
    return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(7, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleSendCode = () => {
    if (phone.replace(/\D/g, '').length >= 11) {
      setStep('code');
      setTimer(60);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) codeInputs.current[index + 1]?.focus();
    if (newCode.every(digit => digit !== '')) {
      setTimeout(() => onAuthenticated(), 500);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  const handleNumberClick = (num: string) => {
    if (step === 'phone') {
      const currentNumbers = phone.replace(/\D/g, '');
      if (currentNumbers.length < 11) {
        setPhone(formatPhone(currentNumbers + num));
      }
    }
  };

  const handleBackspace = () => {
    if (step === 'phone') {
      const currentNumbers = phone.replace(/\D/g, '');
      setPhone(formatPhone(currentNumbers.slice(0, -1)));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Icon name="MessageSquare" size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold font-serif mb-2">Добро пожаловать</h1>
          <p className="text-muted-foreground">Войдите в свой аккаунт</p>
        </div>

        <Card className="animate-fade-in shadow-xl">
          {step === 'phone' ? (
            <>
              <CardHeader>
                <CardTitle className="font-serif">Вход по номеру телефона</CardTitle>
                <CardDescription>Введите номер телефона для получения кода</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Номер телефона</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    className="text-lg"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                      key={num}
                      variant="outline"
                      size="lg"
                      onClick={() => handleNumberClick(num.toString())}
                      className="h-14 text-xl font-semibold"
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleBackspace}
                    className="h-14 text-xl font-semibold"
                  >
                    <Icon name="Delete" size={24} />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleNumberClick('0')}
                    className="h-14 text-xl font-semibold"
                  >
                    0
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    disabled
                    className="h-14 text-xl font-semibold opacity-0"
                  >
                    
                  </Button>
                </div>
                <Button onClick={handleSendCode} className="w-full mt-4" size="lg">
                  Получить код
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="font-serif">Введите код</CardTitle>
                <CardDescription>
                  Код отправлен на номер {phone}
                  <Button variant="link" className="p-0 ml-2 h-auto" onClick={() => setStep('phone')}>
                    Изменить
                  </Button>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2 justify-center">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (codeInputs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold"
                    />
                  ))}
                </div>
                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Получить новый код через {timer} сек
                    </p>
                  ) : (
                    <Button variant="link" onClick={() => { setTimer(60); setCode(['', '', '', '', '', '']); }}>
                      Отправить код повторно
                    </Button>
                  )}
                </div>
              </CardContent>
            </>
          )}
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Нажимая "Получить код", вы принимаете{' '}
          <a href="#" className="text-primary hover:underline">
            условия использования
          </a>
        </p>
      </div>
    </div>
  );
}