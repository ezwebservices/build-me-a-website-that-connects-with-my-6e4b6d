interface Props {
  className?: string;
}

// Hearth & Grain atelier mark — architectural monogram.
// A thin square frame (the hearth), a low horizon line (the mantle),
// an inset "H" upright and a quiet grain hairline beneath.
export function IronwakeMark({ className }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
      aria-hidden
    >
      <rect x="8" y="8" width="48" height="48" rx="1" />
      <path d="M8 22h48" opacity="0.55" />
      <path d="M22 22v24M42 22v24" />
      <path d="M22 34h20" />
      <path d="M14 52h36" opacity="0.35" strokeDasharray="1 3" />
      <circle cx="32" cy="15" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
