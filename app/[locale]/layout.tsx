import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { ReactQueryProvider } from '../react-query-provider';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { PublicEnvScript, PublicEnvProvider } from 'next-runtime-env';

const geistSans = localFont({
  src: "../(resources)/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../(resources)/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mixify",
  description: "Mixify is a web app designed to allow crowd to submit songs to a DJ.",
};




export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const locale = (await params).locale;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'fr')) {
    notFound();
  }
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <head>
        <PublicEnvScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} h-screen`}>
        <PublicEnvProvider>
          <ReactQueryProvider>
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </ReactQueryProvider>
        </PublicEnvProvider>
      </body>
    </html>
  );
}