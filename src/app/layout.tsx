import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export const metadata: Metadata = {
  title: "Control de Minivanes",
  description: "Cobros, gastos, mantenimientos y llantas de cada unidad, por placa.",
  applicationName: "Minivanes",
  appleWebApp: { capable: true, title: "Minivanes", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0B6E4F",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-PE">
      <body className={`${figtree.variable} antialiased`}>{children}</body>
    </html>
  );
}
