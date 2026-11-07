import { Link } from "@/i18n/navigation";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "light";
};

export function CtaLink({ href, children, variant = "solid" }: Props) {
  const styles = {
    solid:
      "rounded-full bg-brand text-white shadow-[0_10px_24px_rgba(29,111,232,0.28)] hover:bg-brand-deep",
    ghost:
      "rounded-full border border-brand/70 bg-white/85 text-brand hover:bg-white",
    light:
      "rounded-full border border-brand/25 bg-white text-brand hover:border-brand hover:bg-brand/5",
  } as const;

  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center gap-2 px-6 text-[13px] font-semibold tracking-[-0.01em] transition-colors ${styles[variant]}`}
    >
      {children}
    </Link>
  );
}
