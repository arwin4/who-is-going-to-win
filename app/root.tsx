import { Analytics } from '@vercel/analytics/react';
import { Links, Meta, Outlet, Scripts, useRouteError } from '@remix-run/react';
import './tailwind.css';
import { RouteError } from './types';

export const config = { runtime: 'edge' };

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="m-0 flex min-h-screen flex-col place-items-center justify-around bg-slate-300  text-gray-800">
        <Analytics />
        <Scripts />
        {children}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "fe21e357bb5e4748a968382e35120fbb"}'
        ></script>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError() as RouteError;
  console.error(error);
  return (
    <html lang="en">
      <head>
        <title>Who Is Going To Win?</title>
        <Meta />
        <Links />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <main className="m-6 grid gap-5 text-center">
          <h1 className="text-xl">Forecasts unavailable</h1>
          <h2 className="text-base">
            Sorry, the forecasts are unavailable at the moment. Please check
            again later.
          </h2>
        </main>
        <Scripts />
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "fe21e357bb5e4748a968382e35120fbb"}'
        ></script>
      </body>
    </html>
  );
}
