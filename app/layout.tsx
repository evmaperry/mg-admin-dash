import DeployButton from '@/components/deploy-button';
import { EnvVarWarning } from '@/components/env-var-warning';
import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';
import { Copyright } from 'lucide-react';
import { DashboardConfigStoreProvider } from '@/providers/dashboard-config-provider';
import { CreateAppStoreProvider } from '@/providers/create-app-provider';
import NavPathIndicator from '@/components/nav-path-indicator';
import Image from 'next/image';
import logo from '@/public/assets/images/logos/fiestaMaestroLogo.png';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Fiesta Maestro Admin Dash',
  description: "Create and manage your event's app",
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground font-sans h-dvh`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <CreateAppStoreProvider>
            <DashboardConfigStoreProvider>
              <main className='min-h-screen flex flex-col items-center'>
                <div className='w-full h-full flex flex-col items-center'>

                  {/* TOP NAV */}
                  <nav className='w-full flex justify-center border-b border-b-foreground/10 h-20'>
                    <div className='w-full flex justify-between items-center p-3 px-6 text-sm'>
                      <div className='flex gap-5 items-center'>
                        <Link
                          href={'/create'}
                          className={'flex flex-row items-center gap-2'}
                        >
                          <Image
                            height={56}
                            width={56}
                            alt={'FiestaMaestro logo'}
                            src={logo}
                          />
                          <div className={`flex flex-col leading-none text-base font-mono mr-3`}>
                            <span className={'font-bold'}>fiesta</span>
                            <span>MAESTRO</span>
                          </div>

                          <NavPathIndicator />
                        </Link>
                      </div>
                      {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
                    </div>
                  </nav>

                  <div className='flex w-full flex-col gap-20 items-center'>
                    {children}
                  </div>

                  <footer className='w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 h-16 z-50 bg-background'>
                    All Rights Reserved <Copyright /> EMP SOLUTIONS LLC 2025
                    <ThemeSwitcher />
                  </footer>
                </div>
              </main>
            </DashboardConfigStoreProvider>
          </CreateAppStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
