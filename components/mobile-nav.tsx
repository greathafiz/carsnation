import Link from "next/link";

export function MobileNav({
  closeMobileMenu,
}: {
  closeMobileMenu: () => void;
}) {
  return (
    <div className="md:hidden border-t border-zinc-200 bg-white">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="block px-3 py-2 text-zinc-700 hover:text-orange-600 hover:bg-zinc-50 font-medium transition-colors rounded-md"
        >
          Home
        </Link>
        <Link
          href="/cars"
          onClick={closeMobileMenu}
          className="block px-3 py-2 text-zinc-700 hover:text-orange-600 hover:bg-zinc-50 font-medium transition-colors rounded-md"
        >
          All Cars
        </Link>
        <Link
          href="/sell-your-car"
          onClick={closeMobileMenu}
          className="block px-3 py-2 text-zinc-700 hover:text-orange-600 hover:bg-zinc-50 font-medium transition-colors rounded-md"
        >
          Sell Your Car
        </Link>
        <Link
          href="/admin"
          onClick={closeMobileMenu}
          className="block px-3 py-2 text-zinc-700 hover:text-orange-600 hover:bg-zinc-50 font-medium transition-colors rounded-md"
        >
          Admin
        </Link>
      </div>
    </div>
  );
}
