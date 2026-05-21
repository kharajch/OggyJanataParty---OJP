import { Fredoka, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport = {
  themeColor: "#0088ff",
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL("https://oggy-janata-party.vercel.app"),
  title: "Oggy Janata Party (OJP) — Voice of the Fridge Guardians",
  description: "Tired of the Cockroach Janata Party (CJP)? Join the OJP! We demand a clean kitchen, zero fridge raids, and 4-hour afternoon naps. Swat cockroaches now!",
  keywords: ["Oggy and the Cockroaches", "Oggy Janata Party", "OJP", "Satire", "Meme", "Instagram Trend", "Cockroach Janata Party", "Fridge Security"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Oggy Janata Party (OJP) — For a Cockroach-Free Kitchen!",
    description: "Satirical political front of the cat owners, by the cats, for the fridge. Swat cockroaches and get your OJP Flyswatter License!",
    url: "https://oggy-janata-party.vercel.app",
    siteName: "Oggy Janata Party",
    images: [
      {
        url: "/ojp_campaign_poster.png",
        width: 1200,
        height: 630,
        alt: "OJP Campaign Poster — Splat Today, Sleep Tomorrow!",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oggy Janata Party (OJP) — Voice of the Fridge Guardians",
    description: "Tired of the Cockroach Janata Party (CJP)? Join the OJP! We demand a clean kitchen, zero fridge raids, and 4-hour afternoon naps. Swat cockroaches now!",
    images: ["/ojp_campaign_poster.png"],
  },
  verification: {
    google: "googlefa51c644e0f5dc14",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${outfit.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
