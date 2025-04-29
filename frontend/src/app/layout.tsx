import "./globals.css";
import { ReactNode, Suspense } from "react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Changi Airport Weather Scanner",
  description: "Real-time weather reports for Changi Airport",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-hidden">
        <Navbar />
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <main className="p-6">
            <Suspense>{children}</Suspense>
          </main>
        </div>
      </body>
    </html>
  );
}
