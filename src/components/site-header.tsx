import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-14 py-[22px] text-white">
      <Link href="/" className="text-[22px] font-extrabold tracking-[-0.5px]">
        Auto<span className="text-logo-accent">Rinka</span>
      </Link>
      <nav className="flex gap-8 text-[14.5px] font-semibold">
        <Link href="/browse">Browse</Link>
        <Link href="/sell">Sell</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/messages">Messages</Link>
      </nav>
      <div className="flex items-center gap-5 text-sm font-semibold">
        {/* Locale toggle is visual-only for now — EN build per current scope. */}
        <span className="cursor-pointer opacity-85">
          LT <span className="opacity-50">/</span> <span className="underline">EN</span>
        </span>
        <Link href="/dashboard">Sign in</Link>
        <Link
          href="/sell"
          className="rounded-full border-[1.5px] border-white/50 px-5 py-[9px] transition-colors hover:bg-white hover:text-ink"
        >
          Sell your car
        </Link>
      </div>
    </header>
  );
}
