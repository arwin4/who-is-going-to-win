import { Link } from '@remix-run/react';
import React from 'react';

export const config = { runtime: 'edge' };

export default function Explanation(): React.JSX.Element {
  return (
    <>
      <main className="m-4 mx-6 grid max-w-xl gap-4 rounded border-4 border-solid border-yellow-400 bg-yellow-200 p-6 text-center text-gray-600 shadow-lg">
        <div>
          This site displays an overview of the current forecasts for the 2024
          US presidential election,{' '}
          <span className="font-semibold">refreshed every hour</span>.
        </div>
        <div>
          The information is provided as a quick reference only. Please click on
          a forecast&apos;s card to see details and methodology.
        </div>
        <div className="text-sm">
          * Nate Silver&apos;s forecast is behind a paywall. Therefore, its
          prediction is updated manually only when Silver mentions its current
          prediction publicly. To see the current prediction,{' '}
          <a
            className="underline hover:text-gray-500 hover:decoration-gray-500"
            href="https://www.natesilver.net/p/nate-silver-2024-president-election-polls-model"
          >
            subscribe to his newsletter
          </a>
          .
        </div>
      </main>
      <Link
        className="mb-4 text-xl font-semibold text-gray-600 underline hover:text-gray-500 hover:decoration-gray-500"
        to="/"
        prefetch="render"
        unstable_viewTransition
      >
        Back to overview
      </Link>
    </>
  );
}
