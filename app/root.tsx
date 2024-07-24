import { Analytics } from '@vercel/analytics/react';
import { Links, Meta, Outlet, Scripts, useRouteError } from '@remix-run/react';
import './tailwind.css';
import { RouteError } from './types';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="m-0 flex min-h-screen flex-col place-items-center justify-around bg-slate-300  text-gray-800">
        <Analytics />
        <Scripts />
        {children}
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
        <title>Presidential forecast aggregator</title>
        <Meta />
        <Links />
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
      </body>
    </html>
  );
}
