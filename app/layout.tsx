import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import "./globals.css";

const courierPrime = Courier_Prime({
  variable: "--font-typewriter",
  weight: ["400"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://georgemannphotography.com"),
  title: "George Mann | Vaudeville Photography",
  description:
    "Photographs by George Mann (1905–1977). A behind-the-scenes record of vaudeville life from the late 1920s through the early 1940s.",
  openGraph: {
    title: "George Mann | Vaudeville Photography",
    description:
      "Photographs by George Mann (1905–1977). A behind-the-scenes record of vaudeville life.",
    type: "website",
    url: "https://georgemannphotography.com",
    images: [
      {
        url: "/images/101LFWS.jpg",
        alt: "George Mann & W.C. Fields, New York, 1932",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "George Mann | Vaudeville Photography",
    description:
      "Photographs by George Mann (1905–1977). A behind-the-scenes record of vaudeville life.",
    images: ["/images/101LFWS.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${courierPrime.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
