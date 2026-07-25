import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Terralume — Real Estate & Energy Project Management",
  description:
    "Terralume delivers expert real estate advisory and energy project management services, guiding clients from planning and due diligence to execution and successful project delivery.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col antialiased"
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
