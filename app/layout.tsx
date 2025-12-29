import CacheManager from "@/components/CacheManager";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Terminal from "@/components/Terminal";
import { TerminalProvider } from "@/context/TerminalContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import type { Metadata } from "next";
import { Fira_Code, Inter, VT323 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Data Librarian",
  description: "Web Interface for Data Librarian Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${firaCode.variable} ${vt323.variable} antialiased h-screen w-screen overflow-hidden flex flex-row bg-[var(--bg-dark)] text-[var(--text-main)]`}
      >
        <TerminalProvider>
          <CacheManager />
          <Sidebar />
          <main className="flex-1 flex flex-col h-full relative overflow-hidden">
            <Header />
            {/* Scrollable Content Wrapper */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin relative z-0">
              {children}
            </div>
            {/* Terminal Sticky Bottom */}
            <Terminal />
          </main>
        </TerminalProvider>
      </body>
    </html>
  );
}
