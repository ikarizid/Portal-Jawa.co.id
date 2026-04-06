import { useState } from "react";
import { useNavigate, Link } from "react-router";

import { supabase } from "../../lib/supabase";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    if (data.session) {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl mb-2" style={{ fontFamily: 'Merriweather, serif', color: '#C00000' }}>
            Portal Jawa
          </h1>
          <p className="text-sm text-gray-600 italic mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Denyut Informasi Tanah Jawa 
          </p>
          <h2 className="text-2xl text-gray-800" style={{ fontFamily: 'Merriweather, serif' }}>
            Admin Panel By Ikariz Group 
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@portaljawa.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded outline-none focus:border-[#C00000] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              {error === "Invalid login credentials" ? "Email atau password salah." : error}
            </div>
          )}

          <div>
            <label className="block text-sm mb-2 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded outline-none focus:border-[#C00000] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#C00000] text-white py-3 rounded hover:bg-[#A00000] transition-colors disabled:opacity-50"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {isLoading ? "Memuat..." : "Masuk"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-[#C00000] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            ← Kembali ke Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
