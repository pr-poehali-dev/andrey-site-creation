import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

type AuthStep = 'phone' | 'code' | 'authenticated';
type Page = 'home' | 'chats';
type Theme = 'default' | 'dark' | 'ocean' | 'sunset';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  read?: boolean;
}

interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

const themes = {
  default: {
    name: 'Классическая',
    bg: 'bg-background',
    sidebar: 'bg-white border-r border-border',
    header: 'bg-white border-b border-border',
    myMessage: 'bg-primary text-primary-foreground',
    otherMessage: 'bg-secondary text-foreground',
    input: 'bg-white',
  },
  dark: {
    name: 'Тёмная',
    bg: 'bg-gray-900',
    sidebar: 'bg-gray-800 border-r border-gray-700',
    header: 'bg-gray-800 border-b border-gray-700',
    myMessage: 'bg-blue-600 text-white',
    otherMessage: 'bg-gray-700 text-gray-100',
    input: 'bg-gray-800',
  },
  ocean: {
    name: 'Океан',
    bg: 'bg-gradient-to-br from-cyan-50 to-blue-100',
    sidebar: 'bg-white/80 backdrop-blur-sm border-r border-cyan-200',
    header: 'bg-white/80 backdrop-blur-sm border-b border-cyan-200',
    myMessage: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white',
    otherMessage: 'bg-white/90 text-gray-800',
    input: 'bg-white/90',
  },
  sunset: {
    name: 'Закат',
    bg: 'bg-gradient-to-br from-orange-50 via-pink-50 to-purple-100',
    sidebar: 'bg-white/80 backdrop-blur-sm border-r border-pink-200',
    header: 'bg-white/80 backdrop-blur-sm border-b border-pink-200',
    myMessage: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white',
    otherMessage: 'bg-white/90 text-gray-800',
    input: 'bg-white/90',
  },
};

const mockChats: Chat[] = [
  { id: 1, name: 'Анна Петрова', avatar: 'АП', lastMessage: 'Отлично, спасибо! Как у тебя дела?', timestamp: '14:23', unread: 2, online: true },
  { id: 2, name: 'Дмитрий Соколов', avatar: 'ДС', lastMessage: 'Отправил тебе файлы по проекту', timestamp: '13:45', unread: 0, online: true },
  { id: 3, name: 'Мария Иванова', avatar: 'МИ', lastMessage: 'Созвонимся завтра?', timestamp: 'Вчера', unread: 1, online: false },
];

const mockMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: 'Привет! Как дела?', sender: 'other', timestamp: '14:20', read: true },
    { id: 2, text: 'Привет! Всё отлично, работаю над новым проектом', sender: 'me', timestamp: '14:21', read: true },
    { id: 3, text: 'Круто! Расскажи подробнее', sender: 'other', timestamp: '14:22', read: true },
    { id: 4, text: 'Делаю чат-приложение с красивым дизайном', sender: 'me', timestamp: '14:22', read: true },
    { id: 5, text: 'Отлично, спасибо! Как у тебя дела?', sender: 'other', timestamp: '14:23', read: false },
  ],
  2: [
    { id: 1, text: 'Посмотри документацию', sender: 'other', timestamp: '13:40', read: true },
    { id: 2, text: 'Хорошо, спасибо!', sender: 'me', timestamp: '13:42', read: true },
    { id: 3, text: 'Отправил тебе файлы по проекту', sender: 'other', timestamp: '13:45', read: true },
  ],
  3: [{ id: 1, text: 'Созвонимся завтра?', sender: 'other', timestamp: 'Вчера', read: false }],
};

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [theme, setTheme] = useState<Theme>('default');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>(mockMessages[1]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const codeInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (step === 'code' && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => (prev <= 1 ? 0 : prev - 1)), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      setTimeout(() => setStep('authenticated'), 500);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputs.current[index - 1]?.focus();
    }
  };

  const handleChatSelect = (chatId: number) => {
    setSelectedChat(chatId);
    setMessages(mockMessages[chatId] || []);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  const currentChat = mockChats.find(c => c.id === selectedChat);
  const filteredChats = mockChats.filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const currentTheme = themes[theme];

  if (showSplash) {
    return (
      <div className="h-screen bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl mb-6 shadow-2xl animate-scale-in">
            <Icon name="MessageCircle" size={48} className="text-primary" />
          </div>
          <h1 className="text-5xl font-bold font-serif text-white mb-2">Чаты</h1>
          <p className="text-xl text-white/80">Общайтесь красиво</p>
        </div>
      </div>
    );
  }

  if (step !== 'authenticated') {
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
              <>
                <CardHeader>
                  <CardTitle className="font-serif">Вход по номеру телефона</CardTitle>
                  <CardDescription>Мы отправим вам SMS с кодом подтверждения</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Номер телефона</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={phone}
                      onChange={(e) => setPhone(formatPhone(e.target.value))}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendCode()}
                      maxLength={18}
                      className="text-lg"
                    />
                  </div>
                  <Button onClick={handleSendCode} className="w-full" size="lg" disabled={phone.replace(/\D/g, '').length < 11}>
                    Получить код
                    <Icon name="ArrowRight" className="ml-2" size={18} />
                  </Button>
                </CardContent>
              </>
            )}

            {step === 'code' && (
              <>
                <CardHeader>
                  <CardTitle className="font-serif">Введите код</CardTitle>
                  <CardDescription>
                    Код отправлен на номер {phone}
                    <button onClick={() => setStep('phone')} className="ml-2 text-primary hover:underline">Изменить</button>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                        Отправить код повторно через <span className="font-semibold">{timer} сек</span>
                      </p>
                    ) : (
                      <Button variant="link" className="text-primary">Отправить код повторно</Button>
                    )}
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    );
  }

  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold font-serif">Главная</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Icon name="Bell" size={20} />
              </Button>
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-primary text-primary-foreground">Я</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold font-serif mb-4">Добро пожаловать!</h2>
            <p className="text-xl text-muted-foreground">Выберите раздел для работы</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all cursor-pointer animate-fade-in" onClick={() => setCurrentPage('chats')}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <Icon name="MessageCircle" size={24} className="text-white" />
                  </div>
                  <CardTitle className="font-serif">Чаты</CardTitle>
                </div>
                <CardDescription>Общайтесь с друзьями и коллегами</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">3 новых</Badge>
                  <span>•</span>
                  <span>2 непрочитанных</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Icon name="Users" size={24} className="text-white" />
                  </div>
                  <CardTitle className="font-serif">Контакты</CardTitle>
                </div>
                <CardDescription>Управляйте вашими контактами</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>23 контакта</span>
                  <span>•</span>
                  <span>12 онлайн</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Icon name="Settings" size={24} className="text-white" />
                  </div>
                  <CardTitle className="font-serif">Настройки</CardTitle>
                </div>
                <CardDescription>Персонализируйте приложение</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Тема: {themes[theme].name}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer animate-fade-in" style={{ animationDelay: '300ms' }}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Icon name="FileText" size={24} className="text-white" />
                  </div>
                  <CardTitle className="font-serif">Заметки</CardTitle>
                </div>
                <CardDescription>Создавайте и редактируйте заметки</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>5 заметок</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Icon name="Image" size={24} className="text-white" />
                  </div>
                  <CardTitle className="font-serif">Галерея</CardTitle>
                </div>
                <CardDescription>Просматривайте медиафайлы</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>42 фото</span>
                  <span>•</span>
                  <span>8 видео</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer animate-fade-in" style={{ animationDelay: '500ms' }}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Icon name="Star" size={24} className="text-white" />
                  </div>
                  <CardTitle className="font-serif">Избранное</CardTitle>
                </div>
                <CardDescription>Важные сообщения и контакты</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>12 элементов</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                  <Icon name="Sparkles" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold font-serif text-lg mb-2">Совет дня</h3>
                  <p className="text-muted-foreground">
                    Попробуйте разные темы оформления в разделе Чаты — выберите ту, которая подходит вашему настроению!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className={`h-screen flex ${currentTheme.bg}`}>
      <div className={`w-80 ${currentTheme.sidebar} flex flex-col`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setCurrentPage('home')}>
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <h1 className="text-2xl font-bold font-serif">Чаты</h1>
            </div>
            <Select value={theme} onValueChange={(v) => setTheme(v as Theme)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(themes).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input placeholder="Поиск..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`w-full p-3 rounded-lg hover:bg-secondary/50 transition-colors text-left ${selectedChat === chat.id ? 'bg-secondary' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">{chat.avatar}</AvatarFallback>
                    </Avatar>
                    {chat.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate">{chat.name}</p>
                      <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && <Badge className="ml-2 h-5 min-w-[20px] rounded-full px-1.5">{chat.unread}</Badge>}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {currentChat && (
          <>
            <div className={`p-4 ${currentTheme.header} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">{currentChat.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{currentChat.name}</p>
                  <p className="text-sm text-muted-foreground">{currentChat.online ? 'онлайн' : 'был(а) недавно'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon"><Icon name="Phone" size={20} /></Button>
                <Button variant="ghost" size="icon"><Icon name="Video" size={20} /></Button>
                <Button variant="ghost" size="icon"><Icon name="MoreVertical" size={20} /></Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={`max-w-md px-4 py-2 rounded-2xl ${message.sender === 'me' ? `${currentTheme.myMessage} rounded-br-sm` : `${currentTheme.otherMessage} rounded-bl-sm`}`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        <span className="text-xs opacity-70">{message.timestamp}</span>
                        {message.sender === 'me' && <Icon name={message.read ? 'CheckCheck' : 'Check'} size={14} className="opacity-70" />}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className={`p-4 border-t border-border ${currentTheme.input}`}>
              <div className="max-w-4xl mx-auto flex items-end gap-2">
                <Button variant="ghost" size="icon"><Icon name="Paperclip" size={20} /></Button>
                <Input
                  placeholder="Введите сообщение..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon"><Icon name="Smile" size={20} /></Button>
                <Button onClick={handleSendMessage} size="icon"><Icon name="Send" size={20} /></Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}