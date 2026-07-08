import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950/80 border-t border-slate-900 py-6 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-400 tracking-wider">GEARHUB</span>
          <span>© 2026 Smart Gaming Gear Store. JSD13 assignment.</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-purple-400 transition-colors">นโยบายความเป็นส่วนตัว</a>
          <a href="#" className="hover:text-purple-400 transition-colors">เงื่อนไขการใช้งาน</a>
          <a href="#" className="hover:text-purple-400 transition-colors">ติดต่อเรา</a>
        </div>
      </div>
    </footer>
  );
}
