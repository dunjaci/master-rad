export default function LoadingState({
  title = "Vizualizacija se učitava",
  message = "Molimo sačekajte nekoliko sekundi.",
}) {
  return (
    <div className="mx-auto mt-5 flex w-full max-w-4xl items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-900">
      <div
        aria-hidden="true"
        className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700"
      />
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-sm leading-6 text-blue-800">{message}</p>
      </div>
    </div>
  );
}
