import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "./(components)/Header";
import Footer from "./(components)/Footer";
import TanStack from "@/utils/TanStack";
import Redux from "./(components)/Redux";
import Whatapp from "./(components)/Whatapp";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "متجر هواك",
  description:
    "هي منصة المنتجات والعطور السودانية وهي وجهة مميزة تهدف إلى تسليط الضوء على المنتجات المحلية والعطور التقليدية التي تتميز بها السودان. تبرز هذه المنصة الحرف اليدوية والفنون التقليدية، كما تسعى لدعم الحرفيين المحليين وتمكينهم من الوصول إلى أسواق أوسع ، وتهدف المنصة أيضًا إلى تعزيز الوعي بالثقافة السودانية وتراثها .",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.moyasar.com/mpf/1.5.2/moyasar.css"
        ></link>
      </head>
      <body
        className={`${cairo.variable} bg-[#FBFBFC] font-sans flex flex-col min-h-screen justify-between relative`}
      >
        <TanStack>
          <Redux>
            <Header />
            <Toaster />
            {children}
          </Redux>
        </TanStack>
        <Whatapp />
        <Footer />
      </body>
    </html>
  );
}
