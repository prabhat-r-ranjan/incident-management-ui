import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Incident Manager",
  description: "Monitor and manage all incidents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="transition-colors duration-300">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <Sidebar />
          <main className="flex-1 overflow-y-auto lg:ml-64 transition-all duration-300 bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white',
            style: {
              background: '#ffffff',
              color: '#1f2937',
            },
          }}
        />
      </body>
    </html>
  );
}