import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-next-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-next-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07090e",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://creativecloud.agency"),
  title: {
    default: "Creative Cloud — Premier Social Media Content & Viral Agency",
    template: "%s | Creative Cloud Agency",
  },
  description:
    "Creative Cloud is a premier social media content agency producing viral TikToks, Instagram Reels, aesthetic brand feeds, and high-converting paid ad creative that turns followers into buyers.",
  keywords: [
    "social media content agency",
    "viral video agency",
    "TikTok marketing agency",
    "Instagram Reels agency",
    "YouTube Shorts production",
    "UGC ads agency",
    "viral scriptwriting",
    "paid social creative",
    "Creative Cloud",
  ],
  authors: [{ name: "Creative Cloud Agency", url: "https://creativecloud.agency" }],
  creator: "Creative Cloud Agency",
  publisher: "Creative Cloud Agency",
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
  openGraph: {
    title: "Creative Cloud — Premier Social Media Content & Viral Agency",
    description:
      "We produce viral content that turns followers into buyers. High-retention TikToks, Instagram Reels, paid UGC, and aesthetic brand feeds.",
    url: "https://creativecloud.agency",
    siteName: "Creative Cloud Agency",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Creative Cloud Social Media Agency Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Cloud — Premier Social Media Content & Viral Agency",
    description:
      "Dominating every high-attention social algorithm with cinematic 4K video, viral hooks, and high-ROAS paid UGC.",
    images: ["https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&auto=format&fit=crop&q=80"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  alternates: {
    canonical: "https://creativecloud.agency",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Creative Cloud Agency",
    description:
      "Premier social media content agency producing viral TikToks, Instagram Reels, aesthetic brand feeds, and high-converting paid ad creative.",
    url: "https://creativecloud.agency",
    telephone: "+1-802-265-0207",
    email: "hello@creativecloud.agency",
    priceRange: "$$$",
    areaServed: "Global",
    serviceType: [
      "Short-Form Video Production",
      "Viral Hook Scriptwriting",
      "Aesthetic Feed Curation",
      "Paid Social UGC Ads",
      "Podcast Repurposing",
      "Creator Seeding",
    ],
  };

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
