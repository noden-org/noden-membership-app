'use client';

import './globals.css';
import { Montserrat } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const montserrat = Montserrat({ subsets: ['latin'] });

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="./manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="apple-mobile-web-app-title" content="Noden" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <link rel="icon" sizes="128x128" href="./img/noden-favicon-128.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="./img/noden-touch-icon-152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="./img/noden-touch-icon-167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="./img/noden-touch-icon-180.png" />
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 2)"
          href="./img/noden-splash-screen-phone-860.png"
        />
        <link
          rel="apple-touch-startup-image"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"
          href="./img/noden-splash-screen-tablet-1668.png"
        />

        <title>Noden Membership</title>
        <meta name="description" content="Signup and manage your Noden membership" />
        <link rel="canonical" href="https://membership.noden.org" />

        <meta property="og:title" content="Noden Membership" />
        <meta property="og:description" content="Signup and manage your Noden membership" />
        <meta property="og:image" content="https://membership.noden.org/img/noden-share-1200.png" />
        <meta property="og:url" content="https://membership.noden.org" />
        <meta property="og:type" content="website" />
      </head>
      <body className={montserrat.className}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
