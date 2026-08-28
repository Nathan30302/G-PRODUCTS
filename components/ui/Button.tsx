import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

const variants = {
  brand: "btn-brand",
  primary: "btn-primary",
  ghost: "btn-ghost",
  whatsapp: "btn-whatsapp",
  accent:
    "inline-flex items-center justify-center gap-2 rounded-pill border border-accent/35 bg-accent/10 font-bold text-white transition-all hover:border-accent/55 hover:bg-accent/20 active:scale-[0.98]",
  subtle:
    "inline-flex items-center justify-center gap-2 rounded-pill border border-white/12 bg-white/[0.04] font-semibold text-white/85 transition-all hover:border-white/20 hover:bg-white/[0.07] active:scale-[0.98]"
} as const;

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base"
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkButtonProps = CommonProps & {
  href: string;
  external?: boolean;
};

function classes(variant: Variant, size: Size, className: string) {
  const needsSize =
    variant === "accent" || variant === "subtle" ? sizes[size] : "";
  return `${variants[variant]} ${needsSize} ${className}`.trim();
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "brand", size = "md", className = "", children, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={classes(variant, size, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export function ButtonLink({
  href,
  external,
  variant = "brand",
  size = "md",
  className = "",
  children
}: LinkButtonProps) {
  const cls = classes(variant, size, className);
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
