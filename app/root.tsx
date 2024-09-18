import type { LinksFunction } from '@vercel/remix';
import { SpeedInsights } from '@vercel/speed-insights/remix';
import {
  isRouteErrorResponse,
  Links,
  Outlet,
  Scripts,
  useRouteError,
} from '@remix-run/react';

import mainCss from './tailwind.css?url';
import React from 'react';
import { Analytics } from '@vercel/analytics/react';

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

          {/* Vercel Speed Insights */}
          <SpeedInsights />

          {/* Vercel Analytics */}
          <Analytics />

          {/* Cloudflare Web Analytics */}
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "0f4db6fca6cd4683a1040d53503ddf4f"}'
          ></script>
        </body>
      </html>
    </React.StrictMode>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <html lang="en">
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <Links />
        <title>Error</title>
        <body className="m-0 flex min-h-screen flex-col place-items-center justify-center bg-slate-200 text-gray-800 md:gap-6 dark:bg-slate-600 dark:text-gray-300">
          <main className="m-4 mx-6 grid max-w-xl gap-4 rounded bg-slate-300 p-5 text-center text-gray-600 shadow-md dark:bg-slate-700 dark:text-gray-300">
            <h1 className="text-lg font-semibold">
              Sorry, an error occurred while loading.
            </h1>
            <p>Please check back later.</p>
            <p>
              {error.status}: {error.data}
            </p>
          </main>
        </body>
      </html>
    );
  }
  return (
    <html lang="en">
      <head>
        <title>Error</title>
        <Links />
      </head>
      <body>
        An error occurred. Please check back later.
        <Scripts />
      </body>
    </html>
  );
}
