import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guardia | Your Scam-Detection Assistant",
  description:
    "Not sure about a message? Paste it and get a plain-language answer on whether it's safe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin=""
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;600;700&family=Manrope:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col font-body-md antialiased">
        {children}
      </body>
    </html>
  );
}
