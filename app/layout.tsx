import type { Metadata } from "next";
import "@/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Мир Вкуса",
  description: "Доставка роллов, закусок, салатов и горячих блюд в Бодайбо.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="bg-neutral-50 text-neutral-950">
        <div className="min-h-screen">
          <Header />
          <main className="pb-8 pt-4 sm:pt-6">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}