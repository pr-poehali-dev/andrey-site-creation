import { useState, useEffect } from 'react';
import SplashScreen from '@/components/SplashScreen';
import AuthScreen from '@/components/AuthScreen';
import HomePage from '@/components/HomePage';
import ChatPage from '@/components/ChatPage';

type Page = 'home' | 'chats';
type Theme = 'default' | 'dark' | 'ocean' | 'sunset';

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [theme, setTheme] = useState<Theme>('default');

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(splashTimer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  if (currentPage === 'home') {
    return <HomePage theme={theme} onNavigateToChats={() => setCurrentPage('chats')} />;
  }

  return (
    <ChatPage
      theme={theme}
      onThemeChange={setTheme}
      onBack={() => setCurrentPage('home')}
    />
  );
}
