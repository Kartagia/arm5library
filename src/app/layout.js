import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ars Magica 5th Edition Library",
  description: "An app storing and maintaining Ars Magica personal and covenant libraries",
  keywords: "ArsMagica rpg"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
