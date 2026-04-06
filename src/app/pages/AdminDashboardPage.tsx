import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Home, FileText, PlusCircle, LogOut, Search, Edit, Trash2, X } from "lucide-react";
import { newsData as initialNewsData, categories } from "../data/news";
import { supabase } from "../../lib/supabase";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorAvatar: string;
  date: string;
  image: string;
  content: string;
  status?: "published" | "draft";
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("overview");
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "Lokal",
    author: "",
    status: "published" as "published" | "draft",
    content: "",
    image: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
      } else {
        setAdminEmail(session.user.email || 'Admin');
        fetchArticles();
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchArticles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("date", { ascending: false });
    
    if (!error && data) {
      setArticles(data as Article[]);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || article.category === filterCategory;
    const matchesStatus = filterStatus === "all" || article.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: articles.length,
    published: articles.filter((a) => a.status === "published").length,
    draft: articles.filter((a) => a.status === "draft").length,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (editingArticle) {
      // Update existing article
      const { data, error } = await supabase
        .from("articles")
        .update({
          title: formData.title,
          excerpt: formData.excerpt,
          category: formData.category,
          author: formData.author,
          status: formData.status,
          content: formData.content,
          image: formData.image,
        })
        .eq("id", editingArticle.id)
        .select();

      if (!error && data) {
        setArticles(articles.map((a) => (a.id === editingArticle.id ? (data[0] as Article) : a)));
        setEditingArticle(null);
      } else {
        alert("Gagal mengubah artikel: " + error?.message);
      }
    } else {
      // Add new article
      const { data, error } = await supabase
        .from("articles")
        .insert([{
          title: formData.title,
          excerpt: formData.excerpt,
          category: formData.category,
          author: formData.author,
          authorAvatar: "https://i.pravatar.cc/150?img=20",
          status: formData.status,
          content: formData.content,
          image: formData.image,
          date: new Date().toISOString()
        }])
        .select();

      if (!error && data) {
        setArticles([data[0] as Article, ...articles]);
      } else {
        alert("Gagal menambah artikel: " + error?.message);
      }
    }

    setFormData({
      title: "",
      excerpt: "",
      category: "Lokal",
      author: "",
      status: "published",
      content: "",
      image: "",
    });
    setShowAddForm(false);
    setIsLoading(false);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      author: article.author,
      status: article.status || "published",
      content: article.content,
      image: article.image,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (!error) {
        setArticles(articles.filter((a) => a.id !== id));
      } else {
        alert("Gagal menghapus artikel: " + error.message);
      }
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingArticle(null);
    setFormData({
      title: "",
      excerpt: "",
      category: "Lokal",
      author: "",
      status: "published",
      content: "",
      image: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl" style={{ fontFamily: 'Merriweather, serif', color: '#C00000' }}>
              Portal Jawa
            </h1>
            <span className="text-sm text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{adminEmail}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#C00000] px-4 py-2 rounded hover:bg-[#A00000] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white h-[calc(100vh-64px)] border-r">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveMenu("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                activeMenu === "overview"
                  ? "bg-[#C00000] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Home className="w-5 h-5" />
              Beranda
            </button>
            <button
              onClick={() => setActiveMenu("manage")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                activeMenu === "manage"
                  ? "bg-[#C00000] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <FileText className="w-5 h-5" />
              Kelola Berita
            </button>
            <button
              onClick={() => {
                setActiveMenu("add");
                setShowAddForm(true);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                activeMenu === "add"
                  ? "bg-[#C00000] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <PlusCircle className="w-5 h-5" />
              Tambah Berita
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto h-[calc(100vh-64px)]">
          {activeMenu === "overview" && (
            <div>
              <h2 className="text-3xl mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Total Berita
                  </div>
                  <div className="text-4xl text-[#C00000]" style={{ fontFamily: 'Merriweather, serif' }}>
                    {stats.total}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Published
                  </div>
                  <div className="text-4xl text-green-600" style={{ fontFamily: 'Merriweather, serif' }}>
                    {stats.published}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Draft
                  </div>
                  <div className="text-4xl text-orange-600" style={{ fontFamily: 'Merriweather, serif' }}>
                    {stats.draft}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === "manage" && (
            <div>
              <h2 className="text-3xl mb-6" style={{ fontFamily: 'Merriweather, serif' }}>
                Kelola Berita
              </h2>

              {/* Filters */}
              <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari berita..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded outline-none focus:border-[#C00000]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border rounded outline-none focus:border-[#C00000]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <option value="all">Semua Kategori</option>
                    {categories.filter(c => c !== "Beranda").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border rounded outline-none focus:border-[#C00000]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <option value="all">Semua Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Articles Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs uppercase text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                        No
                      </th>
                      <th className="px-6 py-3 text-left text-xs uppercase text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Judul
                      </th>
                      <th className="px-6 py-3 text-left text-xs uppercase text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs uppercase text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs uppercase text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-xs uppercase text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredArticles.map((article, index) => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm line-clamp-2" style={{ fontFamily: 'Merriweather, serif' }}>
                            {article.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-[#C00000] text-white px-3 py-1 text-xs rounded" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {article.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 text-xs rounded ${
                              article.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {article.status === "published" ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {new Date(article.date).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(article)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(article.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add/Edit Form */}
          {showAddForm && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl" style={{ fontFamily: 'Merriweather, serif' }}>
                  {editingArticle ? "Edit Berita" : "Tambah Berita Baru"}
                </h2>
                <button
                  onClick={handleCancelForm}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
                <div>
                  <label className="block text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Judul
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded outline-none focus:border-[#C00000]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border rounded outline-none focus:border-[#C00000]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border rounded outline-none focus:border-[#C00000]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {categories.filter(c => c !== "Beranda").map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as "published" | "draft" })
                      }
                      className="w-full px-4 py-2 border rounded outline-none focus:border-[#C00000]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Penulis
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded outline-none focus:border-[#C00000]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    URL Gambar
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border rounded outline-none focus:border-[#C00000]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  {formData.image && (
                    <div className="mt-3">
                      <img src={formData.image} alt="Preview" className="w-full h-48 object-cover rounded" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Konten Artikel
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={12}
                    className="w-full px-4 py-2 border rounded outline-none focus:border-[#C00000]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#C00000] text-white py-3 rounded hover:bg-[#A00000] transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {editingArticle ? "Update Berita" : "Publish Berita"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-6 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
