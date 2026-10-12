"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-x py-20 text-center">
      <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
      <button onClick={reset} className="btn-primary mt-6">Try again</button>
    </div>
  );
}
