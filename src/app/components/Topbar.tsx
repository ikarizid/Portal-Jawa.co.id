export function Topbar() {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white border-b-2 border-[#C00000]">
      <div className="w-full px-4 md:px-8 xl:px-12 py-2 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {currentDate}
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="text-gray-700 hover:text-[#C00000] transition-colors">
            Tentang Kami
          </a>
          <a href="#" className="text-gray-700 hover:text-[#C00000] transition-colors">
            Redaksi
          </a>
          <a href="#" className="text-gray-700 hover:text-[#C00000] transition-colors">
            Kontak
          </a>
          <a href="#" className="text-gray-700 hover:text-[#C00000] transition-colors">
            Newsletter
          </a>
        </div>
      </div>
    </div>
  );
}
