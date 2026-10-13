import { Link } from "@/i18n/navigation";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "light";
};

export function CtaLink({ href, children, variant = "solid" }: Props) {
  const styles = {
    solid: "bg-sage text-cream hover:bg-moss",
    ghost: "border border-cream/70 text-cream hover:bg-cream/10",
    light: "border border-ink/20 text-ink hover:bg-sand",
  } as const;

  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center px-6 text-[12px] tracking-[0.18em] transition-colors ${styles[variant]}`}
    >
      {children}
    </Link>
  );
}
