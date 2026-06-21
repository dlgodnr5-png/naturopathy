import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Health Creator Shop",
  description: "건강 관련 상품과 콘텐츠를 제공하는 자연치유 크리에이터 홈페이지입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${outfit.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
