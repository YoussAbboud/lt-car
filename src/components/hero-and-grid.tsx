"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  type Badge,
  type Listing,
  type Tier,
  BODY_TYPES,
  LISTINGS,
  MAKES,
  fmtKm,
  fmtPrice,
  stripe,
} from "@/lib/listings";

const TABS = ["All", "New", "Used"] as const;
type Tab = (typeof TABS)[number];

const TIER_ORDER: Record<Tier, number> = { featured: 0, plus: 1, standard: 2 };
const BADGE_COLORS: Record<Badge, string> = {
  "Great Price": "#2BB673",
  "Low Mileage": "#405FF2",
};

/** Hero (tabs + search) and the "Most Searched" grid share the condition tab,
 *  so they live in one client component. */
export function HeroAndGrid() {
  const [tab, setTab] = useState<Tab>("All");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");

  const models = useMemo(
    () => (make ? [...new Set(LISTINGS.filter((l) => l.make === make).map((l) => l.model))] : []),
    [make],
  );

  const cards = useMemo(() => {
    const pool =
      tab === "All"
        ? LISTINGS
        : LISTINGS.filter((l) => (tab === "New" ? l.year >= 2022 : l.year < 2022));
    return [...pool].sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]).slice(0, 8);
  }, [tab]);

  const searchHref = useMemo(() => {
    const q: string[] = [];
    if (make) q.push("make=" + encodeURIComponent(make));
    if (model) q.push("model=" + encodeURIComponent(model));
    if (price) q.push("maxPrice=" + price);
    if (tab !== "All") q.push("cond=" + tab.toLowerCase());
    return "/browse" + (q.length ? "?" + q.join("&") : "");
  }, [make, model, price, tab]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0B1530_0%,#101E42_55%,#0A1226_100%)] px-14 pb-[120px] pt-[150px]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(255,255,255,.022)_0_60px,rgba(255,255,255,0)_60px_120px)]" />
        {/* Placeholder marker from the design — replace with a real full-width photo. */}
        <div className="absolute bottom-3.5 right-5 font-mono text-[11px] text-white/35">
          hero: full-width cars photo, dark overlay
        </div>
        <div className="relative mx-auto max-w-[860px] text-center text-white">
          <div className="mb-3.5 text-[15px] font-medium opacity-85">
            Find it online. Meet the seller today.
          </div>
          <h1 className="mb-[30px] text-[58px] font-extrabold leading-[1.15] tracking-[-1.5px]">
            Fast, Simple and Easy
          </h1>
          <div className="mb-[22px] flex justify-center gap-[26px] text-[15px] font-semibold">
            {TABS.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => setTab(label)}
                className={`cursor-pointer border-b-2 pb-2 ${
                  tab === label ? "border-white opacity-100" : "border-transparent opacity-65"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mx-auto flex max-w-[820px] items-center rounded-full bg-white py-2 pl-7 pr-2 shadow-[0_20px_50px_rgba(5,11,32,.35)]">
            <select
              value={make}
              onChange={(e) => {
                setMake(e.target.value);
                setModel("");
              }}
              className="flex-1 cursor-pointer border-none bg-transparent text-[14.5px] font-semibold text-ink outline-none"
            >
              <option value="">Any Make</option>
              {MAKES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <div className="mx-[18px] h-[26px] w-px shrink-0 bg-line" />
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="flex-1 cursor-pointer border-none bg-transparent text-[14.5px] font-semibold text-ink outline-none"
            >
              <option value="">Any Model</option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <div className="mx-[18px] h-[26px] w-px shrink-0 bg-line" />
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 cursor-pointer border-none bg-transparent text-[14.5px] font-semibold text-ink outline-none"
            >
              <option value="">Price: All Prices</option>
              <option value="15000">Up to €15 000</option>
              <option value="25000">Up to €25 000</option>
              <option value="35000">Up to €35 000</option>
              <option value="999999">€35 000+</option>
            </select>
            <Link
              href={searchHref}
              className="ml-3.5 flex shrink-0 items-center gap-2 rounded-full bg-accent px-[34px] py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-accent-deep"
            >
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* Body type strip */}
      <section className="flex flex-wrap justify-center gap-3.5 border-b border-hairline px-14 py-[26px]">
        {BODY_TYPES.map((b) => (
          <Link
            key={b}
            href={"/browse?body=" + encodeURIComponent(b)}
            className="flex items-center gap-2.5 rounded-full border border-line px-[22px] py-[11px] text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            <span className="inline-block h-[9px] w-[9px] rounded-[3px] bg-accent" />
            {b}
          </Link>
        ))}
      </section>

      {/* Most searched */}
      <section className="mx-auto max-w-[1280px] px-10 pb-10 pt-[72px]">
        <div className="mb-[30px] flex items-baseline justify-between">
          <h2 className="text-[32px] font-extrabold tracking-[-0.8px]">
            {tab === "All" ? "The Most Searched Cars" : `The Most Searched ${tab} Cars`}
          </h2>
          <Link href="/browse" className="text-[14.5px] font-bold">
            View All ↗
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {cards.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>
    </>
  );
}

function ListingCard({ listing: l }: { listing: Listing }) {
  return (
    <Link
      href={`/listing/${l.id}`}
      className="block overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-[0_14px_34px_rgba(5,11,32,.10)]"
    >
      <div className="relative h-[170px]" style={{ background: stripe(l.id) }}>
        {l.badge && (
          <span
            className="absolute left-3 top-3 rounded-full px-3 py-[5px] text-[11.5px] font-bold text-white"
            style={{ background: BADGE_COLORS[l.badge] }}
          >
            {l.badge}
          </span>
        )}
        <span className="absolute right-2.5 top-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white text-[13px] text-muted">
          ♡
        </span>
        {/* Placeholder marker — swap for the listing's cover photo. */}
        <span className="absolute bottom-2 left-3 font-mono text-[10.5px] text-[#7A8494]">
          photo: {l.make} {l.model}
        </span>
      </div>
      <div className="px-5 pb-5 pt-[18px]">
        <div className="mb-1 text-[16.5px] font-bold">
          {l.make} {l.model} – {l.year}
        </div>
        <div className="mb-3 overflow-hidden text-ellipsis whitespace-nowrap border-b border-hairline pb-3.5 text-[13px] text-muted">
          {l.trim} · {l.city}
        </div>
        <div className="mb-3.5 grid grid-cols-3 border-b border-hairline pb-3 text-center text-[12.5px] text-muted">
          <span>{fmtKm(l.km)}</span>
          <span className="border-x border-hairline">{l.fuel}</span>
          <span>{l.gearbox}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[19px] font-extrabold">{fmtPrice(l.price)}</span>
          <span className="text-[13.5px] font-bold text-accent">View Details ↗</span>
        </div>
      </div>
    </Link>
  );
}
