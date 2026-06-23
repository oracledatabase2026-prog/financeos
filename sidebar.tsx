// src/components/layout/sidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  ArrowUpCircle,
  ArrowDownCircle,
  Package,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui-store';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: null },
  {
    name: 'Accounting',
    items: [
      { name: 'General Ledger', href: '/ledger', icon: BookOpen },
      { name: 'Accounts Payable', href: '/payable', icon: ArrowUpCircle, badge: 5 },
      { name: 'Accounts Receivable', href: '/receivable', icon: ArrowDownCircle },
      { name: 'Inventory', href: '/inventory', icon: Package },
    ],
  },
  {
    name: 'Finance',
    items: [
      { name: 'Reports', href: '/reports', icon: FileText },
      { name: 'HR & Payroll', href: '/payroll', icon: Users },
    ],
  },
  {
    name: 'System',
    items: [{ name: 'Settings', href: '/settings', icon: Settings }],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/auth/login';
  };

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        className={cn(
          'fixed left-0 top-0 z-40 h-screen border-r bg-[hsl(var(--sidebar-bg))] transition-all duration-300',
          !sidebarOpen && 'border-0'
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-[hsl(var(--sidebar-border))] px-6">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-base font-bold text-white">F</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white">FinanceOS</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Enterprise</span>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-400 hover:bg-white/5 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
            {navigation.map((section, idx) => (
              <div key={idx}>
                {section.name && (
                  <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">{section.name}</p>
                )}
                <div className="space-y-1">
                  {section.items ? (
                    section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'group relative flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          )}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-active"
                              className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          )}
                          <Icon className="mr-3 h-5 w-5" />
                          {item.name}
                          {item.badge && (
                            <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })
                  ) : section.href ? (
                    <Link
                      href={section.href}
                      className={cn(
                        'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                        pathname === section.href
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      {section.icon && <section.icon className="mr-3 h-5 w-5" />}
                      {section.name}
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t border-[hsl(var(--sidebar-border))] p-4">
            <div className="flex items-center space-x-3 rounded-lg bg-white/5 p-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-xs font-semibold text-white">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-gray-400">{user?.role}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-gray-400 hover:bg-white/5 hover:text-white">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

// src/components/layout/header.tsx
'use client';

import { Bell, Menu, Moon, Sun, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const { sidebarOpen, toggleSidebar, theme, toggleTheme } = useUIStore();

  return (
    <header className={cn('sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60')}>
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Mobile menu button */}
        {!sidebarOpen && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Title */}
        <div className="flex-1">
          <h1 className="text-lg font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="w-64 pl-9" />
          </div>

          {/* Period Selector */}
          <Select defaultValue="q4-2024">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="q4-2024">Q4 2024</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>

          {/* Export */}
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Payment Received</p>
                  <p className="text-xs text-muted-foreground">Acme Corp paid invoice #4421</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Overdue Invoice</p>
                  <p className="text-xs text-muted-foreground">Invoice #8818 is 15 days overdue</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

// src/components/layout/main-layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function MainLayout({ children, title, description }: MainLayoutProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { sidebarOpen, theme } = useUIStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-background">
      <Sidebar />
      <div className={cn('flex min-h-screen flex-col transition-all duration-300', sidebarOpen ? 'lg:pl-[280px]' : 'pl-0')}>
        <Header title={title} description={description} />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}

// src/components/ui/avatar.tsx
import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root ref={ref} className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)} {...props} />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
