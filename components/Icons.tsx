type IconProps = { className?: string };

const base = "h-6 w-6";

export function Icon({ name, className }: { name: string; className?: string }) {
  const cls = className ?? base;
  switch (name) {
    case "phone":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="7" y="2" width="10" height="20" rx="2.5" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      );
    case "battery":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3" y="7" width="16" height="10" rx="2" />
          <line x1="21" y1="10" x2="21" y2="14" />
          <path d="M11 9l-2 3h3l-2 3" />
        </svg>
      );
    case "bolt":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" strokeLinejoin="round" />
        </svg>
      );
    case "headphones":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M4 14v-1a8 8 0 0 1 16 0v1" />
          <rect x="3" y="14" width="4" height="6" rx="1.5" />
          <rect x="17" y="14" width="4" height="6" rx="1.5" />
        </svg>
      );
    case "laptop":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="4" y="5" width="16" height="10" rx="1.5" />
          <line x1="2" y1="19" x2="22" y2="19" />
        </svg>
      );
    case "gamepad":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M6 12h4M8 10v4" />
          <circle cx="16" cy="11" r="1" />
          <circle cx="18" cy="13" r="1" />
          <rect x="2" y="7" width="20" height="10" rx="5" />
        </svg>
      );
    case "storage":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <rect x="3" y="4" width="18" height="7" rx="1.5" />
          <rect x="3" y="13" width="18" height="7" rx="1.5" />
          <line x1="7" y1="7.5" x2="7.01" y2="7.5" />
          <line x1="7" y1="16.5" x2="7.01" y2="16.5" />
        </svg>
      );
    case "sparkles":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" strokeLinejoin="round" />
          <path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" strokeLinejoin="round" />
        </svg>
      );
    case "cart":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M3 4h2l2.4 12.5a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L21 8H6" />
        </svg>
      );
    case "search":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.9 9.9 0 0 0 4.74 1.21h.004c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2zm0 1.8c2.16 0 4.2.84 5.73 2.37a8.06 8.06 0 0 1 2.37 5.73c0 4.48-3.64 8.1-8.1 8.1a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.14.82.84-3.06-.2-.32a8.03 8.03 0 0 1-1.24-4.33c0-4.47 3.64-8.1 8.11-8.1zm4.68 11.44c-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.42-1.34-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.4-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.576.25 1.025.4 1.375.51.578.184 1.104.158 1.52.096.464-.07 1.43-.584 1.63-1.148.2-.564.2-1.048.14-1.148z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
