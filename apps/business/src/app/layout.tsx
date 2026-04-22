import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kihumba — Seller Portal",
  description: "Manage your professional marketplace presence on Kihumba.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="theme-dark" suppressHydrationWarning>
      <body className="font-display bg-black text-[var(--text-main)] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
