import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type Theme = 'default' | 'dark' | 'ocean' | 'sunset';

interface HomePageProps {
  theme: Theme;
  onNavigateToChats: () => void;
}

const themes = {
  default: {
    name: 'Классическая',
  },
  dark: {
    name: 'Тёмная',
  },
  ocean: {
    name: 'Океан',
  },
  sunset: {
    name: 'Закат',
  },
};

export default function HomePage({ theme, onNavigateToChats }: HomePageProps) {
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
          <Card className="hover:shadow-lg transition-all cursor-pointer animate-fade-in" onClick={onNavigateToChats}>
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
