import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="bg-white border-b-2 border-navy">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/tecc-logo.png"
            alt="TECC"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <span className="hidden sm:inline text-sm font-medium text-navy/60">
            Newsletter Archive
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-navy/70 hover:text-navy transition-colors"
          >
            Archive
          </Link>
          <Link
            href="/admin"
            className="text-sm font-medium text-navy/70 hover:text-navy transition-colors"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
