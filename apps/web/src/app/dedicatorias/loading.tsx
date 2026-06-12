export default function DedicatoriasLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-12 h-10 w-60 rounded-lg bg-stone-100" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-3 rounded-xl border border-stone-100 p-6">
            <div className="h-6 w-48 rounded bg-stone-100" />
            <div className="h-4 w-32 rounded bg-stone-100" />
            <div className="h-12 w-full rounded bg-stone-50" />
          </div>
        ))}
      </div>
    </div>
  );
}
