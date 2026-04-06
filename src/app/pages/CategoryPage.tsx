import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { supabase } from "../../lib/supabase";
import { NewsArticle } from "../data/news";
import { HeroSlider } from "../components/HeroSlider";
import { NewsCard } from "../components/NewsCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import Masonry from "react-responsive-masonry";

export function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [showAll, setShowAll] = useState(false);
  const [categoryNews, setCategoryNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const decodedCategory = decodeURIComponent(category || "");

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .eq('category', decodedCategory)
        .order('date', { ascending: false });
      
      if (!error && data) {
        setCategoryNews(data as NewsArticle[]);
      }
      setIsLoading(false);
    };

    fetchNews();
  }, [decodedCategory]);

  const sliderNews = categoryNews.slice(0, 5);
  const latestNews = categoryNews.slice(5, 9);
  const remainingNews = categoryNews.slice(9);

  const categoryDescriptions: { [key: string]: string } = {
    "Lokal": "Berita terkini dari berbagai daerah di Jawa dan sekitarnya",
    "Politik": "Informasi politik dan pemerintahan terbaru Indonesia",
    "Ekonomi": "Perkembangan ekonomi, bisnis, dan keuangan",
    "Olahraga": "Liputan lengkap dunia olahraga dalam dan luar negeri",
    "Hiburan & Budaya": "Kabar seni, budaya, dan hiburan nusantara",
    "Teknologi": "Inovasi dan perkembangan teknologi terkini",
    "Opini": "Sudut pandang dan analisis mendalam berbagai isu",
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center p-8">Memuat kategori...</div>;
  }

  return (
    <div>
      {/* Hero Slider */}
      {sliderNews.length > 0 && <HeroSlider articles={sliderNews} />}

      <div className="container mx-auto px-4 py-16">
        {/* Category Header */}
        <div className="mb-12">
          <h1 className="text-5xl mb-3 border-l-4 border-[#C00000] pl-4" style={{ fontFamily: 'Merriweather, serif' }}>
            {decodedCategory}
          </h1>
          <p className="text-gray-600 pl-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            {categoryDescriptions[decodedCategory] || "Kumpulan berita terbaru"}
          </p>
        </div>

        {/* Latest from Category */}
        {latestNews.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl border-l-4 border-[#C00000] pl-4" style={{ fontFamily: 'Merriweather, serif' }}>
                Berita Terbaru
              </h2>
              {remainingNews.length > 0 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center gap-2 text-[#C00000] hover:text-[#A00000] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {showAll ? (
                    <>
                      Sembunyikan <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Lihat Semua <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {/* Expanded Grid */}
            {showAll && remainingNews.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <Masonry columnsCount={3} gutter="24px">
                  {remainingNews.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </Masonry>
              </div>
            )}
          </div>
        )}

        {categoryNews.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
              Belum ada berita di kategori ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
