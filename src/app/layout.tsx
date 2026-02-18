import type { Metadata } from "next";
import { Space_Grotesk, Cormorant_Garamond } from "next/font/google";
import { AppThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "LUMA - Experiencia Premium de Belleza",
  description: "La experiencia de belleza más elegante y moderna. Servicios premium con profesionales certificados.",
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
        <meta name="theme-color" content="#1e1919" />
      </head>
      <body className={`${spaceGrotesk.variable} ${cormorant.variable} antialiased`}>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
