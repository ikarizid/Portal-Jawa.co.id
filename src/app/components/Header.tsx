import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { supabase } from "../../lib/supabase";
import { categories, NewsArticle } from "../data/news";

export function Header() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("Beranda");
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<NewsArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ left: 0, width: 0 });
  const menuRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveMenu("Beranda");
    } else if (path.startsWith("/kategori/")) {
      const category = decodeURIComponent(path.split("/kategori/")[1]);
      setActiveMenu(category);
    }
  }, [location]);

  useEffect(() => {
    const activeRef = menuRefs.current[activeMenu];
    if (activeRef) {
      setMenuPosition({
        left: activeRef.offsetLeft,
        width: activeRef.offsetWidth,
      });
    }
  }, [activeMenu]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        const { data } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .ilike('title', `%${searchQuery}%`)
          .limit(5);
        if (data) setSearchResults(data as NewsArticle[]);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [searchQuery]);

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="w-full px-4 md:px-8 xl:px-12 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img
              src="/BUAT_HEADLINE.png"
              alt="Portal Jawa"
              className="h-14 w-auto object-contain"
            />
          </Link>

          {/* Navigation Menu */}
          <nav className="flex-1 mx-12">
            <div className="relative flex justify-center gap-1">
              <motion.div
                className="absolute bg-[#C00000] rounded-full h-9"
                initial={false}
                animate={{
                  left: menuPosition.left,
                  width: menuPosition.width,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ top: 0 }}
              />
              {categories.map((category) => (
                <Link
                  key={category}
                  to={category === "Beranda" ? "/" : `/kategori/${category}`}
                  ref={(el) => {menuRefs.current[category] = el}}
                  className={`relative px-4 py-2 text-sm transition-colors rounded-full ${
                    activeMenu === category
                      ? "text-white"
                      : "text-black hover:text-[#C00000]"
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {category}
                </Link>
              ))}
            </div>
          </nav>

          {/* Search */}
          <div className="relative" ref={searchRef}>
            <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => searchQuery && setShowResults(true)}
                className="px-4 py-2 bg-transparent outline-none text-sm w-64"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button className="bg-[#C00000] p-2 hover:bg-[#A00000] transition-colors">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchQuery && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border overflow-hidden">
                {isSearching ? (
                  <div className="p-4 text-sm text-gray-500 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Mencari...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.map((article) => (
                      <Link
                        key={article.id}
                        to={`/berita/${article.id}`}
                        onClick={() => {
                          setShowResults(false);
                          setSearchQuery("");
                        }}
                        className="flex gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                      >
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-20 h-14 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-[#C00000] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {article.category}
                          </div>
                          <div className="text-sm line-clamp-2" style={{ fontFamily: 'Merriweather, serif' }}>
                            {article.title}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-sm text-gray-500 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Tidak ada hasil ditemukan
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}