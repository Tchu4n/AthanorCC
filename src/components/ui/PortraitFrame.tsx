import Image from "next/image";

// Silhueta neutra de busto, só traço.
const SILHUETA = "M12 12.5a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5zM4 21c0-4.4 3.6-7 8-7s8 2.6 8 7";

// Moldura em arco com borda dourada de 2 px (segue --vida, como o resto da moldura) e sombra na cor viva.
export function PortraitFrame({ retrato, className = "" }: { retrato: { src: string; alt: string } | null; className?: string }) {
  return (
    <div
      data-retrato
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-t-full border-2 border-ouro-vivo bg-surface shadow-[0_12px_32px_-12px_var(--vivo)] ${className}`}
    >
      {retrato ? (
        <Image src={retrato.src} alt={retrato.alt} fill sizes="10rem" unoptimized={retrato.src.startsWith("data:")} className="object-cover" />
      ) : (
        <svg aria-hidden viewBox="0 0 24 24" className="absolute inset-x-0 bottom-0 mx-auto w-3/4 text-muted" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round">
          <path d={SILHUETA} />
        </svg>
      )}
    </div>
  );
}
