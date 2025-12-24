import type { Metadata } from "next";
import { Eagle_Lake, Roboto } from "next/font/google";
import "./globals.css";

const eagleLake = Eagle_Lake({
  weight: "400",
  variable: "--font-eagle-lake",
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
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
        className={`${eagleLake.variable} ${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
