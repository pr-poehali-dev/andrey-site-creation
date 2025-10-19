import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

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

interface ChatPageProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onBack: () => void;
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

export default function ChatPage({ theme, onThemeChange, onBack }: ChatPageProps) {
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>(mockMessages[1]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  return (
    <div className={`h-screen flex ${currentTheme.bg}`}>
      <div className={`w-80 flex flex-col ${currentTheme.sidebar}`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <h1 className="text-2xl font-bold font-serif">Чаты</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Icon name="Settings" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Edit" size={20} />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск чатов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                  selectedChat === chat.id ? 'bg-primary/10' : 'hover:bg-secondary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">{chat.avatar}</AvatarFallback>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <Badge className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs shrink-0">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        <div className={`p-4 flex items-center justify-between ${currentTheme.header}`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">{currentChat?.avatar}</AvatarFallback>
              </Avatar>
              {currentChat?.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h2 className="font-bold font-serif">{currentChat?.name}</h2>
              <p className="text-xs text-muted-foreground">{currentChat?.online ? 'онлайн' : 'не в сети'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={theme} onValueChange={(value: Theme) => onThemeChange(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Классическая</SelectItem>
                <SelectItem value="dark">Тёмная</SelectItem>
                <SelectItem value="ocean">Океан</SelectItem>
                <SelectItem value="sunset">Закат</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon">
              <Icon name="Phone" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Video" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="MoreVertical" size={20} />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${message.sender === 'me' ? currentTheme.myMessage : currentTheme.otherMessage}`}>
                  <p>{message.text}</p>
                  <div className={`flex items-center gap-1 mt-1 text-xs ${message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    <span>{message.timestamp}</span>
                    {message.sender === 'me' && (
                      <Icon name={message.read ? 'CheckCheck' : 'Check'} size={14} />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="max-w-3xl mx-auto flex items-end gap-2">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Icon name="Paperclip" size={20} />
            </Button>
            <div className={`flex-1 flex items-end gap-2 rounded-2xl p-2 ${currentTheme.input} border border-border`}>
              <Input
                placeholder="Введите сообщение..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="border-0 focus-visible:ring-0 bg-transparent"
              />
              <Button variant="ghost" size="icon" className="shrink-0">
                <Icon name="Smile" size={20} />
              </Button>
            </div>
            <Button onClick={handleSendMessage} size="icon" className="shrink-0">
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
