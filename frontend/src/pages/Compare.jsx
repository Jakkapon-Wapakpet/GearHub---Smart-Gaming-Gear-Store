import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingCart, Trash2, ArrowLeft, GitCompare } from 'lucide-react';

export default function Compare({ setActivePage }) {
  const { compareList, toggleCompare, clearCompare, addToCart } = useContext(AppContext);

  // Specs helper list to iterate
  const specFields = [
    { label: 'ประเภทสินค้า', key: 'category' },
    { label: 'ราคา', key: 'price', format: (val) => `฿${val.toLocaleString()}` },
    { label: 'สี', key: 'color', specPath: 'color' },
    { label: 'การเชื่อมต่อ', key: 'connection', specPath: 'connection' },
    { label: 'น้ำหนัก', key: 'weight', specPath: 'weight' },
    { label: 'เซนเซอร์ (เมาส์)', key: 'sensor', specPath: 'sensor' },
    { label: 'Polling Rate', key: 'pollingRate', specPath: 'pollingRate' },
    { label: 'ประเภทสวิตช์ (คีย์บอร์ด)', key: 'switchType', specPath: 'switchType' },
    { label: 'อายุแบตเตอรี่', key: 'batteryLife', specPath: 'batteryLife' },
    { label: 'Hot-Swappable (คีย์บอร์ด)', key: 'hotSwappable', specPath: 'hotSwappable', format: (val) => val === true ? 'รองรับ (Yes)' : val === false ? 'ไม่รองรับ (No)' : '-' }
  ];

  const getSpecValue = (product, field) => {
    if (field.specPath) {
      const val = product.specifications?.[field.specPath];
      if (val === undefined || val === null) return '-';
      return field.format ? field.format(val) : val;
    }
    const val = product[field.key];
    if (val === undefined || val === null) return '-';
    return field.format ? field.format(val) : val;
  };

  if (compareList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
          <GitCompare size={28} />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold">ไม่มีสินค้าในรายการเปรียบเทียบ</h2>
          <p className="text-slate-500 text-xs max-w-sm">
            กรุณากลับไปที่หน้าแรกและกดไอคอนเปรียบเทียบสเปก (Compare) บนสินค้าที่คุณต้องการประเมินคุณสมบัติ
          </p>
        </div>
        <button
          onClick={() => setActivePage('home')}
          className="mt-2 px-4 py-2 text-xs font-bold bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
        >
          กลับไปเลือกสินค้า
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActivePage('home')}
            className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span>เปรียบเทียบสเปกสินค้า</span>
              <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/10">
                {compareList.length} / 3 รุ่น
              </span>
            </h1>
            <p className="text-slate-500 text-xs">วิเคราะห์และเปรียบเทียบคุณสมบัติเชิงลึกแบบเคียงข้างกัน</p>
          </div>
        </div>

        <button 
          onClick={clearCompare}
          className="px-3.5 py-1.5 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-950/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Trash2 size={13} />
          <span>ลบทั้งหมด</span>
        </button>
      </div>

      {/* Comparison Grid Sheet */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800/60 glass shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="p-4 text-xs font-bold text-slate-500 bg-slate-900/40 w-1/4">ข้อมูลจำเพาะ (Spec Key)</th>
              
              {compareList.map((product) => (
                <th key={product._id} className="p-4 bg-slate-900/20 w-1/4 align-top">
                  <div className="space-y-3 relative group">
                    
                    {/* Delete item button */}
                    <button 
                      onClick={() => toggleCompare(product)}
                      className="absolute top-0 right-0 p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                      title="ลบออกจากรายการเทียบ"
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* Simple visualization mock */}
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] text-purple-400 font-bold">
                      {product.category.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{product.name}</h4>
                      <span className="block text-[10px] text-purple-400 uppercase font-bold tracking-widest">{product.category}</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-cyan-400">฿{product.price.toLocaleString()}</span>
                      
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="p-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                        title="หยิบใส่ตะกร้า"
                      >
                        <ShoppingCart size={13} />
                      </button>
                    </div>

                  </div>
                </th>
              ))}

              {/* Pad columns to fill 3 if less than 3 compared */}
              {compareList.length < 3 && Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                <th key={`empty-${idx}`} className="p-4 text-slate-600 bg-slate-900/10 text-center align-middle w-1/4">
                  <span className="text-xs font-light italic">ว่างเปล่า</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specFields.map((field) => (
              <tr key={field.label} className="border-b border-slate-900 hover:bg-slate-900/10 transition-colors">
                <td className="p-4 text-xs font-bold text-slate-400 bg-slate-950/20">{field.label}</td>
                
                {compareList.map((product) => (
                  <td key={product._id} className="p-4 text-xs font-semibold text-slate-200">
                    {getSpecValue(product, field)}
                  </td>
                ))}

                {/* Pad columns for table shape */}
                {compareList.length < 3 && Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                  <td key={`empty-cell-${idx}`} className="p-4 text-center text-slate-600">-</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
