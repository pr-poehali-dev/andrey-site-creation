import Icon from '@/components/ui/icon';

export default function SplashScreen() {
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
