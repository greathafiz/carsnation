import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarsNation - Quality Foreign Used Cars",
  description:
    "Find your perfect foreign used car with CarsNation. Quality vehicles with inspection services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50">
        <nav className="bg-white shadow-sm border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-orange-600">
                CarsNation
              </Link>
              <div className="hidden md:flex space-x-8">
                <Link
                  href="/"
                  className="text-zinc-700 hover:text-orange-600 font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/cars"
                  className="text-zinc-700 hover:text-orange-600 font-medium transition-colors"
                >
                  All Cars
                </Link>
                <Link
                  href="/admin"
                  className="text-zinc-700 hover:text-orange-600 font-medium transition-colors"
                >
                  Admin
                </Link>
              </div>
              <div className="md:hidden">
                <button className="text-zinc-700" aria-label="Menu">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main>{children}</main>

        <footer className="bg-zinc-900 text-zinc-100 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-white">
                  CarsNation
                </h3>
                <p className="text-zinc-300">
                  Your trusted partner for quality foreign used cars in Nigeria.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
                <div className="space-y-2">
                  <Link
                    href="/"
                    className="text-zinc-300 hover:text-orange-400 block transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/cars"
                    className="text-zinc-300 hover:text-orange-400 block transition-colors"
                  >
                    All Cars
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Contact</h4>
                <p className="text-zinc-300">WhatsApp: +234 902 644 6912</p>
                <p className="text-zinc-300">Email: info@carsnation.com</p>
              </div>
            </div>
            <div className="border-t border-zinc-700 mt-8 pt-8 text-center text-zinc-300">
              <p>&copy; 2025 CarsNation. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
