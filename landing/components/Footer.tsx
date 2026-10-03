import Image from "next/image";
import { MapPin, Phone, Mail, Globe, FileText, Heart } from "lucide-react";

import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import {
  InstagramGlyph,
  YoutubeGlyph,
  FacebookGlyph,
  TiktokGlyph,
} from "@/components/SocialIcons";
import { navLinks, contactInfo } from "@/data/unibaData";

const socialIconMap: Record<string, typeof InstagramGlyph> = {
  Instagram: InstagramGlyph,
  YouTube: YoutubeGlyph,
  Facebook: FacebookGlyph,
  TikTok: TiktokGlyph,
};

export default function Footer() {
  return (
    <footer id="kontak" className="relative bg-slate-dark text-white">
      <div aria-hidden="true" className="h-1 w-full bg-uniba-sky-gradient" />
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* University identity */}
          <Reveal index={0} className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <Image
                  src="/logo-uniba-white.png"
                  alt="Logo UNIBA Surakarta"
                  width={36}
                  height={36}
                  className="shrink-0"
                />
                <span className="font-heading text-xl font-bold">
                  UNIBA <span className="text-uniba-sky">Surakarta</span>
                </span>
              </div>
              <p className="mt-3 max-w-sm text-sm text-white/60">
                Kuliah kualitas tinggi, biaya terjangkau, dan pembayaran fleksibel — untuk
                masa depan Solo Raya yang lebih cerah.
              </p>
            </div>

            <ul className="flex flex-col gap-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-uniba-sky" aria-hidden="true" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-uniba-sky" aria-hidden="true" />
                <a
                  href={contactInfo.phoneHref}
                  className="transition-colors hover:text-white"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-uniba-sky" aria-hidden="true" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="transition-colors hover:text-white"
                >
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </Reveal>

          {/* Quick links */}
          <Reveal index={1} className="flex flex-col gap-4">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
              Tautan Cepat
            </h3>
            <nav aria-label="Tautan cepat footer">
              <ul className="flex flex-col gap-3 text-sm text-white/70">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    {/* Anchors get an absolute prefix so they still resolve from a
                        sub-route, where a bare "#section" would point at a section that
                        isn't on the page. Real routes are already absolute -- prefixing
                        those turned "/s2" into "//s2", which a browser reads as a
                        protocol-relative URL and sends to the host "s2". */}
                    <a
                      href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          {/* Social + website */}
          <Reveal index={2} className="flex flex-col gap-4">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
              Ikuti Kami
            </h3>
            <div className="flex items-center gap-3">
              {contactInfo.socials.map((social) => {
                const Icon = socialIconMap[social.label];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-uniba-sky hover:text-uniba-navy"
                  >
                    {Icon ? <Icon className="size-4.5" /> : null}
                  </a>
                );
              })}
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
              >
                <Globe className="size-4 shrink-0 text-uniba-sky" aria-hidden="true" />
                {contactInfo.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
              <a
                href={contactInfo.pmbWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
              >
                <FileText className="size-4 shrink-0 text-uniba-sky" aria-hidden="true" />
                {contactInfo.pmbWebsite.replace(/^https?:\/\//, "").replace(/\/$/, "")} (Portal
                PMB)
              </a>
            </div>
          </Reveal>
        </div>

        {/* Bottom bar */}
        <Reveal index={3} y={12} className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Universitas Islam Batik Surakarta. Seluruh hak cipta
            dilindungi.
          </p>
          <p className="flex items-center gap-1.5">
            Dibuat dengan
            <Heart className="size-3.5 shrink-0 fill-uniba-sky text-uniba-sky" aria-hidden="true" />
            untuk PMB UNIBA Surakarta
          </p>
        </Reveal>
      </Container>
    </footer>
  );
}
