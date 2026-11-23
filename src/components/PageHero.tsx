import Image from "next/image";
import { GUEST_HERO_FRAME, GUEST_HERO_IMAGE_SIZES } from "@/lib/guest-layout";

type Props = {
  kicker: string;
  title: string;
  lede?: string;
  image: string;
};

export function PageHero({ kicker, title, lede, image }: Props) {
  return (
    <section className="bg-paper">
      <div className={`${GUEST_HERO_FRAME} min-h-[56vh] bg-brand-ink text-white`}>
        <Image
          src={image}
          alt=""
          fill
          priority
          className="object-cover opacity-55"
          sizes={GUEST_HERO_IMAGE_SIZES}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/80 via-brand-ink/45 to-transparent" />
        <div className="relative flex min-h-[56vh] w-full flex-col justify-end px-guest-gutter pb-16 pt-28">
          <p className="text-[12px] font-semibold tracking-[0.22em] text-white/80">
            {kicker}
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">
            {title}
          </h1>
          {lede ? (
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 md:text-lg">{lede}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
