import Image from "next/image";
import { MapPin, Phone, Mail, Globe, FileText, Heart } from "lucide-react";

import { Container } from "@/components/Container";
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
      <div aria-hidden="true" className="h-1 w-full bg-uniba-gold-gradient" />
      <Container className="py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* University identity */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <Image
                  src="/logo-uniba.jpg"
                  alt="Logo UNIBA Surakarta"
                  width={36}
                  height={36}
                  className="shrink-0"
                />
                <span className="font-heading text-xl font-bold">
                  UNIBA <span className="text-uniba-gold">Surakarta</span>
                </span>
              </div>
              <p className="mt-3 max-w-sm text-sm text-white/60">
                Kuliah kualitas tinggi, biaya terjangkau, dan pembayaran fleksibel — untuk
                masa depan Solo Raya yang lebih cerah.
              </p>
            </div>

            <ul className="flex flex-col gap-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-uniba-gold" aria-hidden="true" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 shrink-0 text-uniba-gold" aria-hidden="true" />
                <a
                  href={contactInfo.phoneHref}
                  className="transition-colors hover:text-white"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 shrink-0 text-uniba-gold" aria-hidden="true" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="transition-colors hover:text-white"
                >
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-sm font-semibold tracking-wide text-white uppercase">
              Tautan Cepat
            </h3>
            <nav aria-label="Tautan cepat footer">
              <ul className="flex flex-col gap-3 text-sm text-white/70">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Social + website */}
          <div className="flex flex-col gap-4">
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
                    className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-uniba-gold hover:text-uniba-navy"
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
                <Globe className="size-4 shrink-0 text-uniba-gold" aria-hidden="true" />
                {contactInfo.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
              <a
                href={contactInfo.pmbWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
              >
                <FileText className="size-4 shrink-0 text-uniba-gold" aria-hidden="true" />
                {contactInfo.pmbWebsite.replace(/^https?:\/\//, "").replace(/\/$/, "")} (Portal
                PMB)
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Universitas Islam Batik Surakarta. Seluruh hak cipta
            dilindungi.
          </p>
          <p className="flex items-center gap-1.5">
            Dibuat dengan
            <Heart className="size-3.5 shrink-0 fill-uniba-gold text-uniba-gold" aria-hidden="true" />
            untuk PMB UNIBA Surakarta
          </p>
        </div>
      </Container>
    </footer>
  );
}
