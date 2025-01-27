import type { Metadata } from "next";
import localFont from "next/font/local";
import ReduxProvider from "./store/redus";
import ReactQueryProvider from "./utils/reactQueryProvider";
import "./globals.css";
import { Pizza, ShoppingCart, User2Icon } from "lucide-react";
import  Link  from "next/link";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Wobot Recipes",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReduxProvider>
        <ReactQueryProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <header className="bg-white text-red-600 py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Wobot Recipes</h1>
          <nav>
            <ul className="flex space-x-6 items-center">
              <li>
                <Link
                  href="/recipes"
                  className="hover:text-red-700 flex items-center"
                >
                  <Pizza  className="mr-1 h-4 w-4" /> Recipes
                </Link>
              </li>
              <li>
                <Link href="/user-details" className="hover:text-red-700 flex items-center">
                  <User2Icon className="mr-1 h-4 w-4" /> User Details
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header> 
            {children}
          </body>
        </ReactQueryProvider>
      </ReduxProvider>
    </html>
  );
}
