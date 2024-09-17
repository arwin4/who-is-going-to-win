import type { LinksFunction } from '@vercel/remix';
import { SpeedInsights } from '@vercel/speed-insights/remix';
import { Links, Outlet, Scripts } from '@remix-run/react';

import mainCss from './tailwind.css?url';
import React from 'react';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: mainCss,
    },
  ];
};

export default function App() {
  return (
    <React.StrictMode>
      <html lang="en">
        <head>
          <Links />

          <link rel="preconnect" href="https://fonts.googleapis.com"></link>
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          ></link>
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap"
            rel="stylesheet"
          ></link>

          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <title>Who Is Going To Win?</title>
        </head>
        <body className="m-0 flex min-h-screen flex-col place-items-center justify-center bg-slate-200 text-gray-800 md:gap-6 dark:bg-slate-600 dark:text-gray-300">
          <Outlet />
          <Scripts />
          <SpeedInsights />
        </body>
      </html>
    </React.StrictMode>
  );
}
