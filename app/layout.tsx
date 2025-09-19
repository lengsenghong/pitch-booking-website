import "./globals.css";
import type { Metadata } from "next";
import { ChakraProvider } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "FieldPlay - Football Pitch Booking Platform",
  description:
    "Book premium football pitches, manage your team, and play the game you love. The ultimate platform for football pitch booking and management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
