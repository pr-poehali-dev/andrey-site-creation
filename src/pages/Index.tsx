import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

type AuthStep = 'phone' | 'code' | 'success';

export default function Index() {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const codeInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 'code' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSendCode = () => {
    if (phone.replace(/\D/g, '').length >= 11) {
      setStep('code');
      setTimer(60);
      setCanResend(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      codeInputs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '') && newCode.join('').length === 6) {
      setTimeout(() => {
        setStep('success');
      }, 500);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    setCode(['', '', '', '', '', '']);
    setTimer(60);
    setCanResend(false);
    codeInputs.current[0]?.focus();
  };

  const handlePhoneKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && phone.replace(/\D/g, '').length >= 11) {
      handleSendCode();
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
          {step === 'phone' && (
            <CardHeader>
              <CardTitle className="font-serif">Вход по номеру телефона</CardTitle>
              <CardDescription>Мы отправим вам SMS с кодом подтверждения</CardDescription>
            </CardHeader>
          )}
          {step === 'code' && (
            <CardHeader>
              <CardTitle className="font-serif">Введите код</CardTitle>
              <CardDescription>
                Код отправлен на номер {phone}
                <button
                  onClick={() => setStep('phone')}
                  className="ml-2 text-primary hover:underline"
                >
                  Изменить
                </button>
              </CardDescription>
            </CardHeader>
          )}
          {step === 'success' && (
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-full">
                  <Icon name="CheckCircle" size={28} className="text-green-500" />
                </div>
                <CardTitle className="font-serif">Успешно!</CardTitle>
              </div>
              <CardDescription>Вы успешно вошли в систему</CardDescription>
            </CardHeader>
          )}

          <CardContent className="space-y-6">
            {step === 'phone' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">Номер телефона</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={handlePhoneChange}
                    onKeyPress={handlePhoneKeyPress}
                    maxLength={18}
                    className="text-lg"
                  />
                </div>
                <Button
                  onClick={handleSendCode}
                  className="w-full"
                  size="lg"
                  disabled={phone.replace(/\D/g, '').length < 11}
                >
                  Получить код
                  <Icon name="ArrowRight" className="ml-2" size={18} />
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Продолжая, вы соглашаетесь с{' '}
                  <a href="#" className="text-primary hover:underline">
                    условиями использования
                  </a>
                </div>
              </>
            )}

            {step === 'code' && (
              <>
                <div className="space-y-4">
                  <Label className="text-center block">Код из SMS</Label>
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
                        className="w-12 h-14 text-center text-xl font-bold"
                      />
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Отправить код повторно через{' '}
                      <span className="font-semibold text-foreground">{timer} сек</span>
                    </p>
                  ) : (
                    <Button
                      variant="link"
                      onClick={handleResendCode}
                      className="text-primary"
                    >
                      Отправить код повторно
                    </Button>
                  )}
                </div>

                <div className="flex items-start gap-2 p-4 bg-secondary/50 rounded-lg">
                  <Icon name="Info" size={18} className="text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    SMS может прийти в течение 1-2 минут. Проверьте папку спам, если не видите сообщение.
                  </p>
                </div>
              </>
            )}

            {step === 'success' && (
              <div className="space-y-4 py-6">
                <div className="flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-fade-in">
                    <Icon name="Check" size={48} className="text-white" />
                  </div>
                </div>
                <p className="text-center text-muted-foreground">
                  Перенаправляем вас в приложение...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Нужна помощь? <a href="#" className="text-primary hover:underline">Поддержка</a></p>
        </div>
      </div>
    </div>
  );
}
