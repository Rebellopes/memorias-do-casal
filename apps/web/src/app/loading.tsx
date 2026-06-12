export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-stone-200 border-t-rose-400" />
        <p className="text-sm text-stone-400">Carregando...</p>
      </div>
    </div>
  );
}
