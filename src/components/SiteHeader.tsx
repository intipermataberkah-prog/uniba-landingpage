import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { menuUtama } from "@/lib/situs";

const tombolDaftar =
  "items-center justify-center rounded-full bg-uniba-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-uniba-navy-deep";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-uniba-navy/10 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo-uniba.png" alt="" width={40} height={40} className="size-10" />
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold text-uniba-navy">UNIBA Surakarta</span>
            <span className="hidden text-xs text-slate-600 sm:block">Universitas Islam Batik</span>
          </span>
        </Link>

        <nav aria-label="Menu utama" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm text-slate-700">
            {menuUtama.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-uniba-navy">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/pendaftaran" className={`hidden sm:inline-flex ${tombolDaftar}`}>
            Pendaftaran
          </Link>

          {/* Menu ponsel tanpa JS: <details> sudah aksesibel sebagai disclosure. */}
          <details className="lg:hidden">
            <summary
              aria-label="Menu"
              className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full text-uniba-navy hover:bg-uniba-cloud [&::-webkit-details-marker]:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </summary>
            <nav
              aria-label="Menu utama"
              className="absolute inset-x-0 top-16 border-b border-uniba-navy/10 bg-white px-4 pt-2 pb-4 shadow-card sm:px-6"
            >
              <ul className="divide-y divide-uniba-navy/10">
                {menuUtama.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block py-3 text-slate-800 hover:text-uniba-navy">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/pendaftaran" className={`mt-3 flex w-full sm:hidden ${tombolDaftar}`}>
                Pendaftaran
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
