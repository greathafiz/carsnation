import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Cars Nation</h3>
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
          <p>&copy; 2025 Cars Nation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
