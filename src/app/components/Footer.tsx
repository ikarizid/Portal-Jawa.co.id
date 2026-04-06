import { Link } from "react-router";
import { categories } from "../data/news";

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-6">
            <img
              src="/LOGO_UTAMA_.png"
              alt="Portal Jawa"
              className="h-24 w-auto mx-auto"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex justify-center gap-6 my-8 flex-wrap">
            {categories.map((category) => (
              <Link
                key={category}
                to={category === "Beranda" ? "/" : `/kategori/${category}`}
                className="text-sm text-gray-300 hover:text-white transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {category}
              </Link>
            ))}
          </div>

          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              Tentang Kami
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              Redaksi
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              Kontak
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              Newsletter
            </a>
            <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              Kebijakan Privasi
            </a>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-6">
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              © 2026 Portal Jawa. Seluruh hak cipta dilindungi.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}