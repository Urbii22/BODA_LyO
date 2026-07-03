import Image from "next/image";

export function InvitationArt() {
  return (
    <div className="invitation-frame paper-grain draw-in overflow-hidden rounded-[0.2rem] px-6 py-7 text-tinta">
      <div className="mx-auto flex max-w-sm flex-col items-center text-center">
        <Image
          src="/brand/escudos.png"
          alt="Escudos de Villarcayo y Burgos"
          width={240}
          height={155}
          className="h-auto w-36 opacity-90"
        />
        <Image
          src="/brand/ilustracion-novios.png"
          alt="Ilustracion de Luis y Oscar con su perro"
          width={245}
          height={320}
          priority
          className="mt-3 h-auto w-56 max-w-full"
        />
        <p className="mt-4 font-hand text-3xl font-bold text-tinta">13:00h · 4-7-2026</p>
        <p className="mt-1 font-hand text-2xl text-graphite">Hotel Plati · Villarcayo, Burgos</p>
        <Image
          src="/brand/lavanda-divider.png"
          alt=""
          width={320}
          height={70}
          className="mt-3 h-auto w-48 max-w-full"
        />
      </div>
    </div>
  );
}

export function LavenderDivider({ label }: { label?: string }) {
  return (
    <div className="lavender-divider text-lavanda" aria-hidden={!label}>
      <span className="font-hand text-2xl font-bold">{label ?? "✦"}</span>
    </div>
  );
}
