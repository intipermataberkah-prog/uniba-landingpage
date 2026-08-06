import { getBaseUrl, siteConfig } from "@/lib/site";
import { contactInfo, faqItems, faculties, studyPrograms } from "@/data/unibaData";

/**
 * Server-rendered JSON-LD structured data. Two graphs:
 *  - CollegeOrUniversity: identity, contact, socials, program catalog → Knowledge Panel eligibility.
 *  - FAQPage: mirrors the on-page FAQ verbatim → eligible for FAQ rich results.
 * All FAQ answers are visible on the page, per Google's structured-data policy.
 */
export function StructuredData() {
  const baseUrl = getBaseUrl();
  const logoUrl = `${baseUrl}/logo-uniba.jpg`;

  const organization = {
    "@type": "CollegeOrUniversity",
    "@id": `${baseUrl}/#organization`,
    name: contactInfo.universityName,
    alternateName: contactInfo.shortName,
    url: baseUrl,
    logo: logoUrl,
    image: logoUrl,
    description: siteConfig.description,
    email: contactInfo.email,
    telephone: contactInfo.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. KH. Agus Salim No. 10, Sondakan",
      addressLocality: "Laweyan, Kota Surakarta",
      addressRegion: "Jawa Tengah",
      postalCode: "57147",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "admissions",
      telephone: `+${contactInfo.whatsapp}`,
      email: contactInfo.email,
      areaServed: "ID",
      availableLanguage: ["Indonesian"],
    },
    sameAs: [
      ...contactInfo.socials.map((s) => s.href),
      contactInfo.pmbInstagram,
    ],
    department: faculties.map((faculty) => ({
      "@type": "CollegeOrUniversity",
      name: faculty.name,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Program Studi UNIBA Surakarta",
      itemListElement: studyPrograms.map((program) => ({
        "@type": "Course",
        name: program.name,
        description: `${program.name} (${program.accreditation}) — Universitas Islam Batik Surakarta.`,
        provider: {
          "@type": "CollegeOrUniversity",
          name: contactInfo.universityName,
          sameAs: baseUrl,
        },
      })),
    },
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, faqPage],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here (no user input); required for JSON-LD injection.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
