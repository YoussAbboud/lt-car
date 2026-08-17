import Link from "next/link";
import { MAKES } from "@/lib/listings";

export function DualCta() {
  return (
    <section className="mx-auto grid max-w-[1280px] grid-cols-2 gap-6 px-10 py-8">
      <div className="rounded-2xl bg-panel-blue px-11 pb-12 pt-11">
        <h3 className="mb-2.5 text-[26px] font-extrabold leading-[1.2] tracking-[-0.5px]">
          Are You Looking
          <br />
          For a Car?
        </h3>
        <p className="mb-[26px] max-w-[300px] text-sm leading-[1.6] text-muted">
          Browse thousands of verified listings from private sellers and dealers across Lithuania.
        </p>
        <Link
          href="/browse"
          className="inline-block rounded-xl bg-accent px-[26px] py-[13px] text-[14.5px] font-bold text-white transition-colors hover:bg-accent-deep"
        >
          Get Started ↗
        </Link>
      </div>
      <div className="rounded-2xl bg-panel-pink px-11 pb-12 pt-11">
        <h3 className="mb-2.5 text-[26px] font-extrabold leading-[1.2] tracking-[-0.5px]">
          Do You Want to
          <br />
          Sell a Car?
        </h3>
        <p className="mb-[26px] max-w-[300px] text-sm leading-[1.6] text-muted">
          List in minutes, reach buyers nationwide, and pay one fair fee — or nothing on a
          subscription.
        </p>
        <Link
          href="/sell"
          className="inline-block rounded-xl bg-ink px-[26px] py-[13px] text-[14.5px] font-bold text-white transition-colors hover:bg-[#1a2340]"
        >
          Get Started ↗
        </Link>
      </div>
    </section>
  );
}

const VALUE_PROPS = [
  {
    title: "Verified Sellers",
    body: "Every dealer is checked and private sellers confirm identity before listing goes live.",
  },
  {
    title: "Fair, Transparent Fees",
    body: "One flat fee per listing or a subscription that waives it. No commission on the sale.",
  },
  {
    title: "LT-wide Coverage",
    body: "Listings from Vilnius to Klaipėda with TA validity and Euro class shown up front.",
  },
  {
    title: "Secure Messaging",
    body: "Chat with buyers and sellers in-app. No phone number needed until you choose.",
  },
];

export function ValueProps() {
  return (
    <section className="mx-auto grid max-w-[1280px] grid-cols-[1fr_1.4fr] items-start gap-[60px] px-10 pb-[88px] pt-16">
      <h2 className="text-[32px] font-extrabold leading-[1.25] tracking-[-0.8px]">
        We&apos;re BIG on what
        <br />
        matters to you
      </h2>
      <div className="grid grid-cols-2 gap-x-14 gap-y-11">
        {VALUE_PROPS.map((p) => (
          <div key={p.title}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-panel-blue">
              <span className="inline-block h-3.5 w-3.5 rounded-full border-[3px] border-accent" />
            </div>
            <div className="mb-2 text-[16.5px] font-bold">{p.title}</div>
            <div className="text-[13.5px] leading-[1.6] text-muted">{p.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <section className="bg-ink px-14 pb-10 pt-[72px] text-white">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-7 flex items-baseline justify-between">
          <h2 className="text-[28px] font-extrabold tracking-[-0.6px]">Popular Makes</h2>
          <Link href="/browse" className="text-sm font-bold text-white">
            View All ↗
          </Link>
        </div>
        <div className="flex flex-wrap gap-3 border-b border-white/12 pb-14">
          {MAKES.slice(0, 12).map((m) => (
            <Link
              key={m}
              href={"/browse?make=" + encodeURIComponent(m)}
              className="rounded-full border border-white/22 px-[22px] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
            >
              {m}
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-between pt-7 text-[13px] text-white/55">
          <span className="text-[17px] font-extrabold text-white">
            Auto<span className="text-logo-accent">Rinka</span>
          </span>
          <div className="flex gap-7">
            <Link href="/pricing" className="text-white/70">
              Pricing
            </Link>
            <Link href="/sell" className="text-white/70">
              Sell a car
            </Link>
            <Link href="/admin" className="text-white/70">
              Admin
            </Link>
          </div>
          <span>© 2026 AutoRinka · Vilnius, Lietuva</span>
        </div>
      </div>
    </section>
  );
}
