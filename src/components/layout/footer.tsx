import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-navy">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/tecc-logo.png"
            alt="TECC"
            width={100}
            height={32}
            className="h-8 w-auto brightness-0 invert"
          />
          <p className="text-sm text-white/60">
            Tobacco Education Clearinghouse of California
          </p>
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} TECC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
