export default function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container-x max-w-3xl py-10">
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-soft [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}