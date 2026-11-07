import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center ${className}`}>
      <Image
        src="/logo.png"
        alt="CAREBASE"
        width={240}
        height={72}
        priority
        unoptimized
        className="h-11 w-auto max-w-[220px] object-contain object-left md:h-12"
      />
    </Link>
  );
}
