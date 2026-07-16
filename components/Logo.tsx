export function Logo({
  withText = true,
  className = ""
}: {
  withText?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand shadow-[0_0_22px_rgba(246,212,0,0.35)]">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-ink-950"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.5 8.2A8 8 0 1 0 21 15.4" />
          <path d="M21 12h-4.6" />
        </svg>
      </span>
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="text-base font-extrabold tracking-tight text-white">
            G-Products
          </span>
          <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.28em] text-brand">
            and Services
          </span>
        </span>
      )}
    </span>
  );
}
