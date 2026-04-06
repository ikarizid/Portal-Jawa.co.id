export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  image: string;
  content: string;
}

export const newsData: NewsArticle[] = [];

export const categories = [
  "Beranda",
  "Lokal",
  "Politik",
  "Ekonomi",
  "Olahraga",
  "Hiburan & Budaya",
  "Teknologi",
  "Opini",
];
