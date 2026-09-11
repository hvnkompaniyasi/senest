import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"
import SWRegister from "@/components/SWRegister"
import InstallPWA from "@/components/InstallPWA"
import MobileNav from "@/components/MobileNav"
;
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Senest - Ko'chmas mulk platformasi",
  description: "O'zbekistonning eng zamonaviy ko'chmas mulk platformasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="uz" className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("senest-theme")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}`,
          }}
        />
      </head>
              <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fb923c" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Senest" />
      <body className={inter.className}>
        <AuthProvider><div className="pb-16 lg:pb-0">{children}</div>
        <MobileNav />
        <SWRegister />
        <InstallPWA />
        </AuthProvider>
      </body>
    </html>
  );
}