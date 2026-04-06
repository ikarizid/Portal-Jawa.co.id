import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { supabase } from "../../lib/supabase";
import { NewsArticle } from "../data/news";
import { Share2, ChevronRight } from "lucide-react";
import { NewsCard } from "../components/NewsCard";

export function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [latestArticles, setLatestArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticleAndRelated = async () => {
      setIsLoading(true);
      
      // Fetch current article
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single();

      if (articleData && !articleError) {
        setArticle(articleData as NewsArticle);

        // Fetch related articles
        const { data: relatedData } = await supabase
          .from('articles')
          .select('*')
          .eq('category', articleData.category)
          .eq('status', 'published')
          .neq('id', id)
          .order('date', { ascending: false })
          .limit(3);
        
        if (relatedData) setRelatedArticles(relatedData as NewsArticle[]);

        // Fetch latest articles
        const { data: latestData } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .order('date', { ascending: false })
          .limit(5);
        
        if (latestData) setLatestArticles(latestData as NewsArticle[]);
      }
      
      setIsLoading(false);
    };

    if (id) {
      fetchArticleAndRelated();
    }
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center p-8">Memuat artikel...</div>;
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl mb-4" style={{ fontFamily: 'Merriweather, serif' }}>Artikel tidak ditemukan</h1>
        <Link to="/" className="text-[#C00000] hover:underline" style={{ fontFamily: 'Inter, sans-serif' }}>
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
          <Link to="/" className="hover:text-[#C00000]">Beranda</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/kategori/${article.category}`} className="hover:text-[#C00000]">{article.category}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-400 line-clamp-1">{article.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-2">
            {/* Category Badge */}
            <span className="inline-block bg-[#C00000] text-white px-4 py-1 text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              {article.category}
            </span>

            {/* Headline */}
            <h1 className="text-5xl mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-700 italic mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
              {article.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div className="flex items-center gap-4">
                <img
                  src={article.authorAvatar}
                  alt={article.author}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {article.author}
                  </div>
                  <div className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {formatDate(article.date)}
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-2 text-[#C00000] hover:text-[#A00000]" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Share2 className="w-4 h-4" />
                Bagikan
              </button>
            </div>

            {/* Hero Image */}
            <div className="mb-6">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto"
              />
              <p className="text-sm text-gray-500 mt-2 italic" style={{ fontFamily: 'Inter, sans-serif' }}>
                Ilustrasi: {article.title}
              </p>
            </div>

            {/* Article Body */}
            <div className="prose max-w-none">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mt-12 pt-12 border-t">
                <h2 className="text-2xl mb-6 border-l-4 border-[#C00000] pl-4" style={{ fontFamily: 'Merriweather, serif' }}>
                  Berita Terkait
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((related) => (
                    <NewsCard key={related.id} article={related} />
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Latest News */}
            <div className="bg-gray-50 p-6 mb-6">
              <h3 className="text-xl mb-4 border-b pb-3" style={{ fontFamily: 'Merriweather, serif' }}>
                Berita Terbaru
              </h3>
              <div className="space-y-4">
                {latestArticles.map((latest) => (
                  <NewsCard key={latest.id} article={latest} variant="compact" />
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-[#C00000] text-white p-6 mb-6">
              <h3 className="text-xl mb-3" style={{ fontFamily: 'Merriweather, serif' }}>
                Newsletter Harian
              </h3>
              <p className="text-sm mb-4 text-white/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                Dapatkan ringkasan berita pilihan langsung ke email Anda setiap hari.
              </p>
              <input
                type="email"
                placeholder="Email Anda"
                className="w-full px-4 py-2 mb-3 text-black outline-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button className="w-full bg-black text-white py-2 hover:bg-gray-900 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                Berlangganan
              </button>
            </div>

            {/* Ad Placeholder */}
            <div className="bg-gray-100 p-6 text-center">
              <p className="text-sm text-gray-500 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Advertisement</p>
              <div className="bg-gray-200 h-64 flex items-center justify-center">
                <span className="text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>300 x 250</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
