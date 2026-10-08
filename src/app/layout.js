import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://soundnest.in"),
  title: "Home Automation Companies in India - Soundnest",
  description:
    "If you are looking for the best home automation companies in India. Soundnest is the best option for you it provides the best home automation solutions at the best price range.",
  keywords: [
    "Home Automation Companies in India",
    "Best Home Automation Companies",
    "Retro Fit Automation",
    "Building Automation",
    "Motorized Curtain Motor",
    "Home Cinema and Audio Video",
    "KNX Automation India",
    "Smart Home Systems Delhi",
    "Smart Home Integrator",
  ],
  authors: [{ name: "Soundnest" }],
  creator: "Soundnest",
  publisher: "Soundnest",
  alternates: {
    canonical: "https://soundnest.in/",
  },
  openGraph: {
    title: "Home Automation Companies in India - Soundnest",
    description:
      "If you are looking for the best home automation companies in India. Soundnest is the best option for you it provides the best home automation solutions at the best price range.",
    url: "https://soundnest.in/",
    siteName: "Soundnest",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/slider-1.jpg",
        width: 1200,
        height: 630,
        alt: "Soundnest - Best Home Automation Companies in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Automation Companies in India - Soundnest",
    description:
      "If you are looking for the best home automation companies in India. Soundnest is the best option for you it provides the best home automation solutions at the best price range.",
    images: ["/images/slider-1.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/images/favicon.png?v=2", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/images/favicon.png?v=2",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://soundnest.in/#organization",
      name: "Soundnest",
      url: "https://soundnest.in",
      logo: {
        "@type": "ImageObject",
        "@id": "https://soundnest.in/#logo",
        url: "https://soundnest.in/images/logo.png",
        caption: "Soundnest",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-9049295678",
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
      sameAs: ["https://www.instagram.com/soundnest.in?igsh=ZGF3djRyd29iMTdi"],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://soundnest.in/#localbusiness",
      name: "Soundnest",
      image: "https://soundnest.in/images/slider-1.jpg",
      telephone: "+91-9049295678",
      email: "sales@soundnest.in",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Q 24, Block Q, Lajpat Nagar IV, Lajpat Nagar",
        addressLocality: "New Delhi",
        addressRegion: "Delhi",
        postalCode: "110024",
        addressCountry: "IN",
      },
      url: "https://soundnest.in/",
      priceRange: "$$",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "19:00",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://soundnest.in/#website",
      url: "https://soundnest.in/",
      name: "Soundnest",
      publisher: {
        "@id": "https://soundnest.in/#organization",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://soundnest.in/#webpage",
      url: "https://soundnest.in/",
      name: "Home Automation Companies in India - Soundnest",
      isPartOf: {
        "@id": "https://soundnest.in/#website",
      },
      about: {
        "@id": "https://soundnest.in/#organization",
      },
      description:
        "If you are looking for the best home automation companies in India. Soundnest is the best option for you it provides the best home automation solutions at the best price range.",
    },
  ],
};

import { getWebsiteSettings } from "@/lib/settings";

export default async function RootLayout({ children }) {
  const settings = await getWebsiteSettings();

  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href={settings.branding?.favicon ? `${settings.branding.favicon}?v=2` : "/images/favicon.png?v=2"} />
        <link rel="icon" type="image/png" sizes="192x192" href={settings.branding?.favicon ? `${settings.branding.favicon}?v=2` : "/images/favicon.png?v=2"} />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href={settings.branding?.favicon ? `${settings.branding.favicon}?v=2` : "/images/favicon.png?v=2"} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Dynamic Header Code Injection (GTM, Analytics, Meta Tags) */}
        {settings.codeInjection?.headerScripts && (
          <div
            id="sn-header-injection"
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{ __html: settings.codeInjection.headerScripts }}
          />
        )}

        {children}

        {/* Dynamic Footer Code Injection (Tracking Pixels, Live Chat, Custom Scripts) */}
        {settings.codeInjection?.footerScripts && (
          <div
            id="sn-footer-injection"
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{ __html: settings.codeInjection.footerScripts }}
          />
        )}
      </body>
    </html>
  );
}
