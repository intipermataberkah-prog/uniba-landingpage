import Image from "next/image";
import Link from "next/link";

import { kontak, menuUtama, pengaturanSitus, tautanWaS2 } from "@/lib/situs";

const judulKolom = "text-sm font-semibold text-uniba-sky";
const tautan = "text-white/75 transition-colors hover:text-white";

export function SiteFooter() {
  return (
    <footer className="relative isolate bg-uniba-navy-950 text-sm text-white">
      <div aria-hidden="true" className="batik-kawung-inverse absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/logo-uniba-white.png" alt="" width={44} height={44} className="size-11" />
              <p className="text-base leading-tight font-semibold">{kontak.nama}</p>
            </div>
            <address className="mt-6 max-w-xs leading-relaxed text-white/75 not-italic">
              {kontak.alamat}
              <br />
              <a href={kontak.teleponHref} className={tautan}>
                {kontak.telepon}
              </a>
              <br />
              <a href={`mailto:${kontak.email}`} className={tautan}>
                {kontak.email}
              </a>
            </address>
          </div>

          <nav aria-label="Tautan footer">
            <h2 className={judulKolom}>Jelajahi</h2>
            <ul className="mt-4 space-y-3">
              {menuUtama.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={tautan}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid content-start gap-10">
            <div>
              <h2 className={judulKolom}>Pendaftaran</h2>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href={pengaturanSitus.urlPmb} className={tautan}>
                    Portal PMB
                  </a>
                </li>
                <li>
                  <a href={tautanWaS2} className={tautan}>
                    Admisi S2 (WhatsApp)
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className={judulKolom}>Media sosial</h2>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                {kontak.sosial.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className={tautan}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-14 border-t border-white/10 pt-6 text-white/60">
          © {new Date().getFullYear()} {kontak.nama}
        </p>
      </div>
    </footer>
  );
}
