import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kuyheng Thoeng | Full Stack Developer",
  description:
    "Developer portfolio showcasing full stack projects, skills, and a modern tech-focused brand experience.",
  openGraph: {
    title: "Kuyheng Thoeng | Full Stack Developer",
    description:
      "Explore projects, skills, and case studies from a full stack developer focused on impactful digital products.",
    siteName: "Kuyheng Thoeng",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Kuyheng Thoeng Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuyheng Thoeng | Full Stack Developer",
    description:
      "Explore projects, skills, and case studies from a full stack developer focused on impactful digital products.",
    images: ["/og.png"],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  keywords: [
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "UI Engineering",
    "Portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${sora.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
