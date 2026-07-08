import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { KeyRound, Mail, User, AlertCircle } from 'lucide-react';

export default function Auth({ setActivePage }) {
  const { login, register } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        setActivePage('home');
      } else {
        setError(res.error || 'การเข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูลอีกครั้ง');
      }
    } else {
      if (!username) {
        setError('กรุณากรอกชื่อผู้ใช้งาน');
        setLoading(false);
        return;
      }
      const res = await register(username, email, password);
      if (res.success) {
        setActivePage('home');
      } else {
        setError(res.error || 'การลงทะเบียนล้มเหลว อีเมลหรือชื่อผู้ใช้นี้อาจมีอยู่ในระบบแล้ว');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-4">
      <div className="w-full max-w-md glass p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 mb-6">
          <button
            className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${isLogin ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            เข้าสู่ระบบ
            {isLogin && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></span>}
          </button>
          <button
            className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${!isLogin ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            สมัครสมาชิก
            {!isLogin && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"></span>}
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold tracking-wide">
            {isLogin ? 'ยินดีต้อนรับกลับสู่ GEARHUB' : 'สร้างบัญชีผู้ใช้งานใหม่'}
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            {isLogin ? 'กรุณากรอกข้อมูลของคุณเพื่อใช้งานบัญชีเดิม' : 'กรอกรายละเอียดเพื่อสัมผัสประสบการณ์ช้อปสุดล้ำ'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-3 flex items-start gap-2 text-rose-300 text-xs mb-4">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-1.5 pl-1">ชื่อผู้ใช้งาน</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="เช่น pete_esports"
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/80 pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-100 outline-none transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 pl-1">อีเมลผู้ใช้งาน</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/80 pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-100 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-semibold mb-1.5 pl-1">รหัสผ่าน</label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                placeholder="รหัสผ่านของคุณ"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/80 pl-10 pr-4 py-2.5 rounded-xl text-sm text-slate-100 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'กำลังทำงาน...' : isLogin ? 'เข้าสู่ระบบ' : 'สมัครใช้งานฟรี'}
          </button>
        </form>
      </div>
    </div>
  );
}
