import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { PostProvider } from "@/context/PostContext";
import { AblyProvider } from "@/context/AblyContext";
import { UploadProvider } from "@/context/UploadContext";
import { SnackbarProvider } from "@/context/SnackbarContext";
import { NotificationProvider } from "@/context/NotificationContext";
import SnackbarContainer from "@/components/shared/SnackbarContainer";
import FloatingUploader from "@/components/shared/FloatingUploader";
import CreatePostModal from "@/components/feed/CreatePostModal";
import OnboardingCheck from "@/components/auth/OnboardingCheck";
import PostOnboardingModal from "@/components/auth/PostOnboardingModal";
import { Suspense } from "react";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

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
    <html lang="en" className={`theme-dark ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <AuthProvider>
            <PostProvider>
              <SnackbarProvider>
                <AblyProvider>
                  <NotificationProvider>
                    <UploadProvider>
                      {children}
                      <CreatePostModal />
                      <OnboardingCheck />
                      <Suspense fallback={null}>
                        <PostOnboardingModal />
                      </Suspense>
                      <FloatingUploader />
                      <SnackbarContainer />
                    </UploadProvider>
                  </NotificationProvider>
                </AblyProvider>
              </SnackbarProvider>
            </PostProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

