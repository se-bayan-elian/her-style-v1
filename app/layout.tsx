import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "./(components)/Header";
import Footer from "./(components)/Footer";
import TanStack from "@/utils/TanStack";
import Redux from "./(components)/Redux";
import Whatapp from "./(components)/Whatapp";
import { Toaster } from "@/components/ui/toaster";
import GoToTopButton from "./(components)/ToTopButton";

const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | متجر هواك",
    default: "متجر هواك | الصفحة الرئيسية"
  },
  description:
    "هي منصة المنتجات والعطور السودانية وهي وجهة مميزة تهدف إلى تسليط الضوء على المنتجات المحلية والعطور التقليدية التي تتميز بها السودان. تبرز هذه المنصة الحرف اليدوية والفنون التقليدية، كما تسعى لدعم الحرفيين المحليين وتمكينهم من الوصول إلى أسواق أوسع ، وتهدف المنصة أيضًا إلى تعزيز الوعي بالثقافة السودانية وتراثها .",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <head>

        <link
          rel="stylesheet"
          href="https://cdn.moyasar.com/mpf/1.5.2/moyasar.css"
        ></link>
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="متجر هواك" />
        <meta property="og:description" content="هي منصة المنتجات والعطور السودانية وهي وجهة مميزة تهدف إلى تسليط الضوء على المنتجات المحلية والعطور التقليدية التي تتميز بها السودان. تبرز هذه المنصة الحرف اليدوية والفنون التقليدية، كما تسعى لدعم الحرفيين المحليين وتمكينهم من الوصول إلى أسواق أوسع ، وتهدف المنصة أيضًا إلى تعزيز الوعي بالثقافة السودانية وتراثها ."
        />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL} />
        <meta property="og:type" content="website" />

        {/* Twitter Metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="متجر هواك" />
        <meta name="twitter:description" content="هي منصة المنتجات والعطور السودانية وهي وجهة مميزة تهدف إلى تسليط الضوء على المنتجات المحلية والعطور التقليدية التي تتميز بها السودان. تبرز هذه المنصة الحرف اليدوية والفنون التقليدية، كما تسعى لدعم الحرفيين المحليين وتمكينهم من الوصول إلى أسواق أوسع ، وتهدف المنصة أيضًا إلى تعزيز الوعي بالثقافة السودانية وتراثها ." />
        <meta name="twitter:image" content="/og-image.png" />
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
        <GoToTopButton />
        <Footer />
      </body>
    </html>
  );
}
