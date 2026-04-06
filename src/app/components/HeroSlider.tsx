import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { NewsArticle } from "../data/news";
import { motion, AnimatePresence } from "motion/react";

interface HeroSliderProps {
  articles: NewsArticle[];
}

export function HeroSlider({ articles }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const slides = articles.slice(0, 5);

  if (slides.length === 0) {
    return null;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((current) => (current + 1) % slides.length);
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const goToPrevious = () => {
    setCurrentIndex((current) => (current - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const goToNext = () => {
    setCurrentIndex((current) => (current + 1) % slides.length);
    setProgress(0);
  };

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

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <span className="inline-block bg-[#C00000] text-white px-4 py-1 text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                {slides[currentIndex].category}
              </span>
              <h1 className="text-white text-5xl mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
                {slides[currentIndex].title}
              </h1>
              <p className="text-white/90 text-lg mb-4 line-clamp-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {slides[currentIndex].excerpt}
              </p>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-white/80 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {slides[currentIndex].author}
                </span>
                <span className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {formatDate(slides[currentIndex].date)}
                </span>
              </div>
              <Link
                to={`/berita/${slides[currentIndex].id}`}
                className="inline-block bg-[#C00000] text-white px-8 py-3 hover:bg-[#A00000] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Baca Selengkapnya
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 backdrop-blur-sm transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 backdrop-blur-sm transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-[#C00000]" : "bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-[#C00000] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
