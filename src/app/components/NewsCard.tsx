import { Link } from "react-router";
import { NewsArticle } from "../data/news";

interface NewsCardProps {
  article: NewsArticle;
  variant?: "default" | "compact";
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (variant === "compact") {
    return (
      <Link to={`/berita/${article.id}`} className="flex gap-3 group">
        <img
          src={article.image}
          alt={article.title}
          className="w-24 h-20 object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <span className="text-xs text-[#C00000] mb-1 block" style={{ fontFamily: 'Inter, sans-serif' }}>
            {article.category}
          </span>
          <h3 className="text-sm line-clamp-2 group-hover:text-[#C00000] transition-colors" style={{ fontFamily: 'Merriweather, serif' }}>
            {article.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            {formatDate(article.date)}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/berita/${article.id}`} className="group block">
      <div className="overflow-hidden mb-3">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <span className="inline-block bg-[#C00000] text-white px-3 py-1 text-xs mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        {article.category}
      </span>
      <h3 className="text-xl mb-2 line-clamp-2 group-hover:text-[#C00000] transition-colors" style={{ fontFamily: 'Merriweather, serif' }}>
        {article.title}
      </h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2" style={{ fontFamily: 'Inter, sans-serif' }}>
        {article.excerpt}
      </p>
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span style={{ fontFamily: 'Inter, sans-serif' }}>{article.author}</span>
        <span style={{ fontFamily: 'Inter, sans-serif' }}>•</span>
        <span style={{ fontFamily: 'Inter, sans-serif' }}>{formatDate(article.date)}</span>
      </div>
    </Link>
  );
}
