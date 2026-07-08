import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingCart, GitCompare, LogOut, User, ShoppingBag } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { user, logout, cart, compareList } = useContext(AppContext);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full glass-premium border-b border-purple-500/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => setActivePage('home')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent group-hover:opacity-85 transition-opacity">
            GEARHUB
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-cyan-400 border border-cyan-400/30 rounded bg-cyan-950/30">
            PRO
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-6">
          <button 
            onClick={() => setActivePage('home')}
            className={`text-sm font-medium transition-colors hover:text-purple-400 ${activePage === 'home' ? 'text-purple-400 font-semibold' : 'text-slate-300'}`}
          >
            หน้าแรก
          </button>
          
          <button 
            onClick={() => setActivePage('compare')}
            className={`text-sm font-medium relative flex items-center gap-1.5 transition-colors hover:text-purple-400 ${activePage === 'compare' ? 'text-purple-400 font-semibold' : 'text-slate-300'}`}
          >
            <GitCompare size={16} />
            <span>เปรียบเทียบ</span>
            {compareList.length > 0 && (
              <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] font-bold text-white ring-2 ring-slate-950 animate-pulse">
                {compareList.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => setActivePage('cart')}
            className={`text-sm font-medium relative flex items-center gap-1.5 transition-colors hover:text-purple-400 ${activePage === 'cart' ? 'text-purple-400 font-semibold' : 'text-slate-300'}`}
          >
            <ShoppingCart size={16} />
            <span>ตะกร้า</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 ring-2 ring-slate-950">
                {cartCount}
              </span>
            )}
          </button>

          {user && (
            <button 
              onClick={() => setActivePage('orders')}
              className={`text-sm font-medium flex items-center gap-1.5 transition-colors hover:text-purple-400 ${activePage === 'orders' ? 'text-purple-400 font-semibold' : 'text-slate-300'}`}
            >
              <ShoppingBag size={16} />
              <span>ประวัติการซื้อ</span>
            </button>
          )}
        </nav>

        {/* User Account Controls */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-slate-900/60 pl-3 pr-2 py-1.5 rounded-full border border-slate-800">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <User size={12} className="text-purple-400" />
                {user.username}
              </span>
              <button 
                onClick={logout} 
                className="p-1 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-all"
                title="ออกจากระบบ"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setActivePage('auth')} 
              className="px-4 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md shadow-purple-500/20 text-white transition-all transform hover:scale-105 active:scale-95"
            >
              เข้าสู่ระบบ
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
