'use client';

import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  LogOut,
  Package,
  LayoutDashboard,
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/context/auth-context';

const Navbar = () => {
  const router = useRouter();
  const { user, logout, isMounted } = useAuth();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const cart = useCart();

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/shop');
    }
  };
  const cartCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const routes = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Categories', href: '/categories' },
  ];

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        {/* Mobile Navigation */}
        <div className='flex items-center md:hidden'>
          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
              )}>
              <Menu className='h-5 w-5' />
            </SheetTrigger>
            <SheetContent side='left' className='w-[300px] sm:w-[400px]'>
              <nav className='flex flex-col gap-6 mt-8'>
                <div className='relative w-full group'>
                  <button 
                    onClick={handleSearch}
                    className="absolute left-2.5 top-2.5 hover:text-primary transition-colors z-10"
                  >
                    <Search className='h-4 w-4 text-muted-foreground' />
                  </button>
                  <Input
                    type='search'
                    placeholder='Search products...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    className='pl-8 h-10 rounded-xl bg-muted/50 border-none focus-visible:ring-1'
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        router.push('/shop');
                      }}
                      className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-primary"
                    >
                      <span className="text-sm">✕</span>
                    </button>
                  )}
                </div>

                <div className='flex flex-col gap-3'>
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className='text-xl font-bold hover:text-primary transition-colors py-2'>
                      {route.name}
                    </Link>
                  ))}
                </div>

                <div className='h-px bg-border my-2' />

                <div className='flex items-center gap-6'>
                  <Link
                    href='#'
                    className='p-2 rounded-full bg-muted/50 text-muted-foreground hover:text-primary transition-colors'>
                    <FaFacebook className='h-5 w-5' />
                  </Link>
                  <Link
                    href='#'
                    className='p-2 rounded-full bg-muted/50 text-muted-foreground hover:text-primary transition-colors'>
                    <FaTwitter className='h-5 w-5' />
                  </Link>
                  <Link
                    href='#'
                    className='p-2 rounded-full bg-muted/50 text-muted-foreground hover:text-primary transition-colors'>
                    <FaInstagram className='h-5 w-5' />
                  </Link>
                  <Link
                    href='#'
                    className='p-2 rounded-full bg-muted/50 text-muted-foreground hover:text-primary transition-colors'>
                    <FaGithub className='h-5 w-5' />
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <span className='text-3xl font-black tracking-tighter text-pink-500'>
            SherNaz
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-6'>
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'>
              {route.name}
            </Link>
          ))}
        </nav>

        {/* Search, Cart, User */}
        <div className='flex items-center gap-2'>
          <div className='hidden lg:flex relative w-64 group'>
            <button 
              onClick={handleSearch}
              className="absolute left-2.5 top-2.5 hover:text-primary transition-colors z-10"
            >
              <Search className='h-4 w-4 text-muted-foreground' />
            </button>
            <Input
              type='search'
              placeholder='Search products...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className='pl-8 h-9 rounded-full bg-muted/50 border-none focus-visible:ring-1 pr-8'
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  router.push('/shop');
                }}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-primary"
              >
                <span className="text-xs">✕</span>
              </button>
            )}
          </div>

          <Link
            href='/cart'
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'relative group',
            )}>
            <ShoppingCart className='h-5 w-5 group-hover:scale-110 transition-transform' />
            {cartCount > 0 && (
              <span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground'>
                {cartCount}
              </span>
            )}
          </Link>

          {isMounted && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      'rounded-full ring-primary/20 focus-visible:ring-2',
                    )}>
                    <User className='h-5 w-5' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='w-56 p-2 rounded-2xl shadow-xl'>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className='px-3 py-2'>
                        <div className='flex flex-col space-y-1'>
                          <p className='text-sm font-bold leading-none'>
                            {user.name}
                          </p>
                          <p className='text-xs leading-none text-muted-foreground'>
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className='my-1' />
                    <DropdownMenuItem
                      className='p-0'
                    >
                      <Link
                        href='/dashboard'
                        className='flex items-center w-full px-3 py-2 rounded-xl cursor-pointer'
                      >
                        <LayoutDashboard className='mr-2 h-4 w-4' />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='p-0'
                    >
                      <Link
                        href='/profile'
                        className='flex items-center w-full px-3 py-2 rounded-xl cursor-pointer'
                      >
                        <User className='mr-2 h-4 w-4' />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className='p-0'
                    >
                      <Link
                        href='/orders'
                        className='flex items-center w-full px-3 py-2 rounded-xl cursor-pointer'
                      >
                        <Package className='mr-2 h-4 w-4' />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    {user.role?.toUpperCase() === 'ADMIN' && (
                      <DropdownMenuItem
                        className='p-0 bg-primary/10 text-primary font-bold focus:bg-primary/20'
                      >
                        <Link
                          href='/admin'
                          className='flex items-center w-full px-3 py-2 rounded-xl cursor-pointer'
                        >
                          <LayoutDashboard className='mr-2 h-4 w-4' />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className='my-1' />
                    <DropdownMenuItem
                      className='text-destructive focus:bg-destructive/10 focus:text-destructive px-2 py-1.5 rounded-xl cursor-pointer'
                      onClick={() => {
                        logout();
                        window.location.href = '/';
                      }}>
                      <LogOut className='mr-2 h-4 w-4' />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href='/auth/login'
                  className={cn(
                    buttonVariants({ size: 'sm' }),
                    'rounded-full px-6 text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5',
                  )}>
                  Login
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
