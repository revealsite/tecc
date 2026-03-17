import Link from "next/link";

export function Header() {
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">
            t<span className="text-sky-blue">e</span>cc
          </span>
          <span className="hidden sm:inline text-sm text-white/70">
            Newsletter Archive
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Archive
          </Link>
          <Link
            href="/admin"
            className="text-sm text-white/80 hover:text-white transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
