import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AppThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Luma Beauty Studio - Premium Beauty Services",
  description: "Experience luxury beauty booking with Luma Beauty Studio. Professional beauty services at your convenience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7C3AED" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`} data-bs-theme="light">
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
