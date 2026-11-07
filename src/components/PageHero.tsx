import Image from "next/image";

type Props = {
  kicker: string;
  title: string;
  lede?: string;
  image: string;
};

export function PageHero({ kicker, title, lede, image }: Props) {
  return (
    <section className="relative isolate min-h-[56vh] overflow-hidden bg-brand-ink text-white">
      <Image
        src={image}
        alt=""
        fill
        priority
        className="object-cover opacity-55"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/80 via-brand-ink/45 to-transparent" />
      <div className="relative mx-auto flex min-h-[56vh] max-w-7xl flex-col justify-end px-6 pb-16 pt-28">
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
    </section>
  );
}
