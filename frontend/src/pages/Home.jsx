import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingCart, GitCompare, Search, Filter, Layers, Laptop, Cpu, Disc } from 'lucide-react';

export default function Home() {
  const { products, loadingProducts, fetchProducts, addToCart, toggleCompare, compareList } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchProducts(selectedCategory, search);
  }, [selectedCategory, search]);

  const categories = [
    { name: 'ทั้งหมด', value: '' },
    { name: 'เมาส์ (Mouse)', value: 'Mouse' },
    { name: 'คีย์บอร์ด (Keyboard)', value: 'Keyboard' },
    { name: 'หูฟัง (Headset)', value: 'Headset' },
    { name: 'อุปกรณ์เสริม (Accessories)', value: 'Accessories' }
  ];

  // Helper to check if a product is inside comparison list
  const isCompared = (productId) => compareList.some(item => item._id === productId);

  // Helper icons for tags/categories
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Mouse': return <Cpu size={14} className="text-cyan-400" />;
      case 'Keyboard': return <Layers size={14} className="text-purple-400" />;
      case 'Headset': return <Disc size={14} className="text-pink-400" />;
      default: return <Laptop size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner / Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass border border-purple-500/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-4 max-w-xl text-center md:text-left z-10">
          <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-purple-400 border border-purple-400/20 rounded-full bg-purple-950/20">
            NEXT-GEN GAMING store
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            ยกระดับฝีมือของคุณด้วย <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">เกมมิ่งเกียร์ที่ดีที่สุด</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-light">
            เปรียบเทียบสเปกเมาส์ คีย์บอร์ด และหูฟังตัวท็อปได้สูงสุด 3 ชิ้นพร้อมกันในคลิกเดียว พร้อมราคาและส่วนลดพิเศษ
          </p>
        </div>
        
        <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0 flex items-center justify-center bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 shadow-xl glass">
          {/* Decorative Gaming Mouse Visual */}
          <div className="w-16 h-28 rounded-full border-2 border-dashed border-purple-500/30 flex items-center justify-center animate-bounce">
            <div className="w-1.5 h-3 rounded-full bg-pink-500 animate-pulse"></div>
          </div>
          <div className="absolute -top-3 -right-3 px-3 py-1 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs tracking-wider shadow-lg transform rotate-6">
            SALE NOW
          </div>
        </div>
      </section>

      {/* Filter / Search Bar */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/30 p-4 rounded-2xl border border-slate-800/60 glass">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="ค้นหาสินค้า เช่น เมาส์ไร้สาย, wooting..."
            className="w-full bg-slate-950/80 border border-slate-800/80 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 pl-9 pr-4 py-2 rounded-xl text-sm outline-none text-slate-200 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${selectedCategory === cat.value ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20' : 'bg-slate-950/80 text-slate-400 border border-slate-800/60 hover:text-slate-200 hover:border-slate-700'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </section>

      {/* Product Grid */}
      <section>
        {loadingProducts ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <span className="text-slate-500 text-sm">กำลังโหลดข้อมูลอุปกรณ์เกียร์...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/10 rounded-2xl border border-slate-900 border-dashed">
            <span className="text-slate-500 text-sm">ไม่พบสินค้าตามตัวเลือกที่ค้นหา</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const compared = isCompared(product._id);
              const compareDisabled = !compared && compareList.length >= 3;

              return (
                <div 
                  key={product._id} 
                  className={`relative flex flex-col justify-between rounded-2xl bg-slate-900/40 border transition-all overflow-hidden group shadow-xl ${compared ? 'border-purple-500/40 ring-1 ring-purple-500/40' : 'border-slate-800/80 hover:border-purple-500/30'}`}
                >
                  {/* Category Tag overlay */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg glass bg-slate-950/50">
                    {getCategoryIcon(product.category)}
                    <span>{product.category}</span>
                  </div>

                  {/* Stock tag */}
                  <div className={`absolute top-3 right-3 z-10 px-2 py-0.5 text-[9px] font-bold rounded-lg ${product.stock > 0 ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20' : 'bg-rose-950/60 text-rose-400 border border-rose-500/20'}`}>
                    {product.stock > 0 ? `มีสินค้า (${product.stock})` : 'สินค้าหมด'}
                  </div>

                  {/* Mock Image Area */}
                  <div className="h-44 bg-slate-950/90 relative flex items-center justify-center border-b border-slate-800/40 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-65"></div>
                    {/* Decorative device visualization */}
                    <div className="w-12 h-20 rounded-xl border border-purple-500/20 flex flex-col items-center justify-between p-2 group-hover:scale-110 group-hover:border-purple-500/40 transition-transform">
                      <div className="w-full h-1 bg-purple-500/30 rounded"></div>
                      <div className="w-4 h-4 rounded-full border border-pink-500/20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-100 group-hover:text-purple-400 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-slate-500 text-xs font-light mt-1.5 line-clamp-2">
                        {product.description || 'ไม่มีรายละเอียดเนื้อหาสำหรับสินค้าชนิดนี้'}
                      </p>

                      {/* Specs snippet */}
                      <div className="mt-4 space-y-1 bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/40 text-[11px] text-slate-400">
                        {product.specifications.weight && (
                          <div className="flex justify-between">
                            <span>น้ำหนัก:</span>
                            <span className="font-medium text-slate-300">{product.specifications.weight}</span>
                          </div>
                        )}
                        {product.specifications.sensor && (
                          <div className="flex justify-between gap-2">
                            <span>เซนเซอร์:</span>
                            <span className="font-medium text-slate-300 truncate">{product.specifications.sensor}</span>
                          </div>
                        )}
                        {product.specifications.switchType && (
                          <div className="flex justify-between">
                            <span>สวิตช์:</span>
                            <span className="font-medium text-slate-300 truncate">{product.specifications.switchType}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="mt-5 pt-4 border-t border-slate-800/40 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] text-slate-500 font-semibold uppercase tracking-wider">ราคา</span>
                        <span className="text-lg font-extrabold text-cyan-400">
                          ฿{product.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {/* Compare Button */}
                        <button
                          onClick={() => toggleCompare(product)}
                          disabled={compareDisabled}
                          className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all ${compared ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none'}`}
                          title="เปรียบเทียบสเปก"
                        >
                          <GitCompare size={15} />
                        </button>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => addToCart(product, 1)}
                          disabled={product.stock <= 0}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-1.5 transition-all transform active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                        >
                          <ShoppingCart size={14} />
                          <span>ใส่ตะกร้า</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
