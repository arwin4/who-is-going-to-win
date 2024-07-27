export const config = { runtime: 'edge' };

export default function Index() {
  return (
    <>
      <div className="grid border-yellow-400 p-4 text-center font-sans">
        <h1 className="text-[clamp(1.5rem,5vw,2rem)] font-semibold">
          Edge seems to be working?
        </h1>
      </div>
    </>
  );
}
