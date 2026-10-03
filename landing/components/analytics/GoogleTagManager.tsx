import Script from "next/script";

/**
 * Google Tag Manager container.
 *
 * The Google Ads conversion tag is configured inside GTM rather than hardcoded
 * here, so conversion IDs and labels can be changed without a redeploy — and so
 * the Ads tag fires in real time instead of arriving 24–48h late as an imported
 * GA4 key event.
 *
 * Renders nothing when NEXT_PUBLIC_GTM_ID is unset, keeping dev and preview
 * builds out of production analytics.
 */
export function GoogleTagManager() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>
    </>
  );
}

/** The <noscript> half of the container. Must sit immediately inside <body>. */
export function GoogleTagManagerNoScript() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
