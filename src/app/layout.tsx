import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"
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
      <body className={inter.className}>
        <AuthProvider><div className="pb-16 lg:pb-0">{children}</div>
        <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}