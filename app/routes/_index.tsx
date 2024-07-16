import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Presidential forecast aggregator' },
    { name: 'description', content: 'Presidential forecast aggregator' },
  ];
};

export default function Index() {
  return (
    <>
      <div className="grid border-yellow-400 p-4 text-center font-sans">
        <h1 className="text-3xl">Presidential forecast aggregator</h1>
      </div>
      <main className="grid space-y-6 sm:grid-flow-col sm:space-x-6 sm:space-y-0">
        <a href="arwin.site">
          <div className="grid space-y-3 rounded border-4 border-solid border-yellow-400 bg-yellow-200 p-6 text-center shadow-lg hover:bg-yellow-300">
            <h2 className="text-xl">DecisionDeskHQ</h2>
            <div className="text-2xl font-semibold">55%</div>
            <div className="-skew-y-2 bg-red-500">Trump</div>
          </div>
        </a>{' '}
        <a href="arwin.site">
          <div className="grid space-y-3 rounded border-4 border-solid border-yellow-400 bg-yellow-200 p-6 text-center shadow-lg hover:bg-yellow-300">
            <h2 className="text-xl">Nate Silver</h2>
            <div className="text-2xl font-semibold opacity-50">paywalled</div>
            <div className="opacity-0"></div>
          </div>
        </a>
      </main>
    </>
  );
}
