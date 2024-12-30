import "./globals.css";
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { getServerSession } from "next-auth/next";
import SessionProvider from "@/components/SessionProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduNeon - Geleceğin Eğitim Platformu",
  description:
    "Öğretmenler, öğrenciler ve yöneticiler için tasarlanmış, kullanımı kolay ve etkili bir okul yönetim sistemi.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}

