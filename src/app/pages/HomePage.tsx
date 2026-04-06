import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { NewsArticle } from "../data/news";
import { HeroSlider } from "../components/HeroSlider";
import { NewsCard } from "../components/NewsCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import Masonry from "react-responsive-masonry";
import { Link } from "react-router";

export function HomePage() {
  const [showAllLatest, setShowAllLatest] = useState(false);
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('date', { ascending: false });
      
      if (!error && data) {
        setAllNews(data as NewsArticle[]);
      }
      setIsLoading(false);
    };

    fetchNews();
  }, []);

  const trendingNews = allNews.slice(0, 5);
  const latestNews = allNews.slice(5, 9);
  const expandedNews = allNews.slice(9);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center p-8">Memuat berita...</div>;
  }

  return (
    <div>
      {/* Hero Slider */}
      {trendingNews.length > 0 && <HeroSlider articles={trendingNews} />}

      <div className="container mx-auto px-4 py-16">
        {/* Latest News Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl border-l-4 border-[#C00000] pl-4" style={{ fontFamily: 'Merriweather, serif' }}>
              Berita Terbaru
            </h2>
            <button
              onClick={() => setShowAllLatest(!showAllLatest)}
              className="flex items-center gap-2 text-[#C00000] hover:text-[#A00000] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {showAllLatest ? (
                <>
                  Sembunyikan <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Lihat Semua <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {latestNews.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {/* Expanded Grid */}
          {showAllLatest && (
            <div className="mt-8 pt-8 border-t">
              <Masonry columnsCount={3} gutter="24px">
                {expandedNews.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </Masonry>
            </div>
          )}
        </div>

        {/* Trending Section */}
        <div>
          <h2 className="text-3xl border-l-4 border-[#C00000] pl-4 mb-8" style={{ fontFamily: 'Merriweather, serif' }}>
            Terpopuler
          </h2>

          <div className="bg-gray-50 p-8">
            <div className="space-y-6">
              {trendingNews.map((article, index) => (
                <Link
                  key={article.id}
                  to={`/berita/${article.id}`}
                  className="flex gap-6 items-start group pb-6 border-b last:border-b-0"
                >
                  <div className="text-5xl text-[#C00000] flex-shrink-0 w-16" style={{ fontFamily: 'Merriweather, serif' }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <span className="inline-block text-xs text-[#C00000] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {article.category}
                    </span>
                    <h3 className="text-xl mb-2 group-hover:text-[#C00000] transition-colors" style={{ fontFamily: 'Merriweather, serif' }}>
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {formatDate(article.date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
