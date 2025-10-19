import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

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

const mockChats: Chat[] = [
  {
    id: 1,
    name: 'Анна Петрова',
    avatar: 'АП',
    lastMessage: 'Отлично, спасибо! Как у тебя дела?',
    timestamp: '14:23',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Дмитрий Соколов',
    avatar: 'ДС',
    lastMessage: 'Отправил тебе файлы по проекту',
    timestamp: '13:45',
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: 'Мария Иванова',
    avatar: 'МИ',
    lastMessage: 'Созвонимся завтра?',
    timestamp: 'Вчера',
    unread: 1,
    online: false,
  },
  {
    id: 4,
    name: 'Команда разработки',
    avatar: 'КР',
    lastMessage: 'Алексей: Пушу в мастер',
    timestamp: 'Вчера',
    unread: 0,
    online: false,
  },
];

const mockMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: 'Привет! Как дела?', sender: 'other', timestamp: '14:20', read: true },
    { id: 2, text: 'Привет! Всё отлично, работаю над новым проектом', sender: 'me', timestamp: '14:21', read: true },
    { id: 3, text: 'Круто! Расскажи подробнее', sender: 'other', timestamp: '14:22', read: true },
    { id: 4, text: 'Делаю чат-приложение с красивым интерфейсом', sender: 'me', timestamp: '14:22', read: true },
    { id: 5, text: 'Отлично, спасибо! Как у тебя дела?', sender: 'other', timestamp: '14:23', read: false },
  ],
  2: [
    { id: 1, text: 'Посмотри документацию', sender: 'other', timestamp: '13:40', read: true },
    { id: 2, text: 'Хорошо, спасибо!', sender: 'me', timestamp: '13:42', read: true },
    { id: 3, text: 'Отправил тебе файлы по проекту', sender: 'other', timestamp: '13:45', read: true },
  ],
  3: [
    { id: 1, text: 'Созвонимся завтра?', sender: 'other', timestamp: 'Вчера', read: false },
  ],
  4: [
    { id: 1, text: 'Кто будет делать ревью?', sender: 'other', timestamp: 'Вчера', read: true },
    { id: 2, text: 'Я посмотрю', sender: 'me', timestamp: 'Вчера', read: true },
  ],
};

export default function Index() {
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>(mockMessages[1]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentChat = mockChats.find(c => c.id === selectedChat);
  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-background">
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold font-serif mb-4">Чаты</h1>
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Поиск..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`w-full p-3 rounded-lg hover:bg-secondary transition-colors text-left ${
                  selectedChat === chat.id ? 'bg-secondary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {chat.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate">{chat.name}</p>
                      <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <Badge className="ml-2 h-5 min-w-[20px] flex items-center justify-center rounded-full px-1.5">
                          {chat.unread}
                        </Badge>
                      )}
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
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {currentChat.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{currentChat.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentChat.online ? 'онлайн' : 'был(а) недавно'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
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
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'me'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-secondary text-foreground rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        <span className={`text-xs ${message.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {message.timestamp}
                        </span>
                        {message.sender === 'me' && (
                          <Icon 
                            name={message.read ? 'CheckCheck' : 'Check'} 
                            size={14} 
                            className={message.read ? 'text-blue-400' : 'text-primary-foreground/70'}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Icon name="Paperclip" size={20} />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Введите сообщение..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pr-20"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                    >
                      <Icon name="Smile" size={20} />
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} size="icon" className="shrink-0">
                    <Icon name="Send" size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
