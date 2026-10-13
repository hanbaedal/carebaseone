import Image from "next/image";

type Props = {
  kicker: string;
  title: string;
  lede: string;
  image: string;
};

export function PageHero({ kicker, title, lede, image }: Props) {
  return (
    <section className="relative isolate min-h-[72vh] overflow-hidden bg-navy text-cream">
      <Image
        src={image}
        alt=""
        fill
        priority
        className="object-cover opacity-55"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-navy/50" />
      <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-6 pb-16 pt-32">
        <p className="text-[11px] tracking-[0.28em] text-cream/70">{kicker}</p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-cream/80 md:text-lg">
          {lede}
        </p>
      </div>
    </section>
  );
}
