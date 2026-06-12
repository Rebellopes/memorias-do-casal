export default function GaleriaLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 h-10 w-40 rounded-lg bg-stone-100" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-xl bg-stone-100" />
        ))}
      </div>
    </div>
  );
}
