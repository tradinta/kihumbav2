import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Kihumba — Premium Social",
  description: "A premium social platform connecting creators, communities, and culture.",
  keywords: ["social media", "creator economy", "community", "Kenya"],
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
      <body className="font-display">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
