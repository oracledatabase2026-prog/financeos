'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps { children: React.ReactNode; title: string; description?: string; }

export function MainLayout({ children, title, description }: MainLayoutProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { sidebarOpen, theme } = useUIStore();

  useEffect(() => { if (!isAuthenticated) router.push('/auth/login'); }, [isAuthenticated, router]);
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);

  if (!isAuthenticated) return null;

  return (
    <div className="relative min-h-screen bg-background">
      <Sidebar />
      <div className={cn('flex min-h-screen flex-col transition-all duration-300', sidebarOpen ? 'lg:pl-[220px]' : 'pl-0')}>
        <Header title={title} description={description} />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
