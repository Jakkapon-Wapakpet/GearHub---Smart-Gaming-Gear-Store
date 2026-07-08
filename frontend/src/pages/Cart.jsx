import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Trash2, Plus, Minus, CreditCard, CheckCircle, Smartphone } from 'lucide-react';

export default function Cart({ setActivePage }) {
  const { cart, updateQuantity, removeFromCart, checkout, user } = useContext(AppContext);
  const [receiverName, setReceiverName] = useState(user ? user.username : '');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [subDistrict, setSubDistrict] = useState('');
  const [district, setDistrict] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PromptPay');
  const [checkoutResult, setCheckoutResult] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนชำระเงินครับ");
      setActivePage('auth');
      return;
    }

    if (cart.length === 0) return;

    setLoading(true);

    const shippingAddress = {
      receiverName,
      phone,
      addressLine,
      subDistrict,
      district,
      province,
      postalCode
    };

    const res = await checkout(shippingAddress, paymentMethod);
    setLoading(false);

    if (res.success) {
      setCheckoutResult(res.order);
      if (paymentMethod === 'PromptPay') {
        setIsPaying(true);
      } else {
        // Direct complete for card/installment
        setIsPaying(false);
      }
    } else {
      alert("ไม่สามารถสร้างคำสั่งซื้อได้: " + res.error);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaying(false);
    setCheckoutResult(null);
    setActivePage('orders');
  };

  if (isPaying && checkoutResult) {
    return (
      <div className="flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md glass p-8 rounded-2xl border border-purple-500/20 text-center space-y-6">
          <span className="px-3 py-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 rounded-full uppercase tracking-wider animate-pulse">
            Awaiting PromptPay Payment
          </span>
          
          <h2 className="text-xl font-bold tracking-tight">ชำระเงินด่วนด้วย PromptPay</h2>
          
          {/* Simulated QR Code Container */}
          <div className="bg-white p-6 rounded-2xl max-w-[240px] mx-auto shadow-2xl relative group">
            {/* Outer brand box */}
            <div className="absolute top-1 left-0 right-0 text-[7px] text-center text-blue-900 font-bold tracking-widest uppercase">
              PROMPTPAY BILLER
            </div>
            {/* Draw QR Code grid simulation */}
            <div className="w-48 h-48 bg-slate-900 flex flex-col items-center justify-center rounded-xl p-2 gap-2 text-purple-400 text-xs font-mono">
              <Smartphone size={24} className="animate-pulse" />
              <span>GEARHUB PAY</span>
              <span className="text-[10px] text-slate-500">฿{checkoutResult.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-400">
              กรุณาเปิดแอปธนาคารของคุณ และสแกน QR Code ด้านบนเพื่อโอนเงินจำนวน:
            </p>
            <p className="text-2xl font-black text-cyan-400">
              ฿{checkoutResult.totalAmount.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-500">
              เลขใบสั่งซื้อ: {checkoutResult._id}
            </p>
          </div>

          <button
            onClick={handlePaymentSuccess}
            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 font-bold rounded-xl text-xs text-slate-950 transition-colors"
          >
            ฉันโอนเงินเรียบร้อยแล้ว
          </button>
        </div>
      </div>
    );
  }

  if (checkoutResult && paymentMethod !== 'PromptPay') {
    return (
      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md glass p-8 rounded-2xl border border-purple-500/20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle size={32} />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold">สั่งซื้อสินค้าสำเร็จ!</h2>
            <p className="text-slate-500 text-xs">
              ระบบได้รับการชำระเงินผ่าน {paymentMethod} และเปิดใบประกันสินค้าให้คุณเรียบร้อยแล้ว
            </p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-left text-xs text-slate-400 space-y-1.5">
            <div><span className="font-semibold text-slate-300">เลขคำสั่งซื้อ:</span> {checkoutResult._id}</div>
            <div><span className="font-semibold text-slate-300">ราคาสุทธิ:</span> ฿{checkoutResult.totalAmount.toLocaleString()}</div>
            <div><span className="font-semibold text-slate-300">ผู้รับ:</span> {checkoutResult.shippingAddress.receiverName}</div>
          </div>

          <button
            onClick={handlePaymentSuccess}
            className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 font-bold rounded-xl text-xs text-white transition-colors"
          >
            ดูประวัติการซื้อของฉัน
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
          <Trash2 size={24} />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold">ไม่มีสินค้าในตะกร้า</h2>
          <p className="text-slate-500 text-xs">
            คุณยังไม่ได้หยิบสินค้าใส่ตะกร้า ลองเพิ่มอุปกรณ์เกมมิ่งเกียร์ที่คุณถูกใจเพื่อสั่งซื้อ
          </p>
        </div>
        <button
          onClick={() => setActivePage('home')}
          className="mt-2 px-4 py-2 text-xs font-bold bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
        >
          ไปช้อปปิ้งกันเลย
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Cart List */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold tracking-tight">ตะกร้าสินค้าของคุณ ({cart.length} รายการ)</h2>
        
        <div className="space-y-3">
          {cart.map((item) => (
            <div 
              key={item.productId} 
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 glass justify-between"
            >
              {/* Product Info Mock Image */}
              <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center text-[10px] text-purple-400 font-bold shrink-0">
                GEAR
              </div>

              {/* Title & Price */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-slate-100 truncate">{item.name}</h4>
                <span className="text-xs text-cyan-400 font-extrabold">฿{item.price.toLocaleString()}</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  <Minus size={12} />
                </button>
                <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => removeFromCart(item.productId)}
                className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                title="ลบออกจากตะกร้า"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Checkout Form */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">สรุปการสั่งซื้อ</h2>

        <form onSubmit={handleCheckout} className="glass border border-slate-800 rounded-2xl p-6 space-y-5 relative">
          
          {/* Total Price */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-semibold uppercase">ราคารวมทั้งสิ้น</span>
            <span className="text-2xl font-black text-cyan-400">฿{cartTotal.toLocaleString()}</span>
          </div>

          {/* Shipping Address Forms */}
          <div className="space-y-3">
            <span className="block text-[10px] text-purple-400 uppercase font-bold tracking-wider mb-1">ที่อยู่สำหรับการจัดส่ง</span>

            <div>
              <input
                type="text"
                placeholder="ชื่อผู้รับสินค้า"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500 pl-3 pr-3 py-2 rounded-lg text-xs outline-none text-slate-200"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="เบอร์โทรศัพท์ติดต่อ"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500 pl-3 pr-3 py-2 rounded-lg text-xs outline-none text-slate-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="บ้านเลขที่, ถนน, ซอย"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500 pl-3 pr-3 py-2 rounded-lg text-xs outline-none text-slate-200"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="แขวง / ตำบล"
                className="bg-slate-950/80 border border-slate-800 focus:border-purple-500 pl-3 pr-3 py-2 rounded-lg text-xs outline-none text-slate-200"
                value={subDistrict}
                onChange={(e) => setSubDistrict(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="เขต / อำเภอ"
                className="bg-slate-950/80 border border-slate-800 focus:border-purple-500 pl-3 pr-3 py-2 rounded-lg text-xs outline-none text-slate-200"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="จังหวัด"
                className="bg-slate-950/80 border border-slate-800 focus:border-purple-500 pl-3 pr-3 py-2 rounded-lg text-xs outline-none text-slate-200"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="รหัสไปรษณีย์"
                className="bg-slate-950/80 border border-slate-800 focus:border-purple-500 pl-3 pr-3 py-2 rounded-lg text-xs outline-none text-slate-200"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                pattern="^[0-9]{5}$"
                required
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <span className="block text-[10px] text-purple-400 uppercase font-bold tracking-wider mb-1">วิธีการชำระเงิน</span>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('PromptPay')}
                className={`py-2 rounded-lg text-[10px] font-bold border flex items-center justify-center gap-1 transition-all ${paymentMethod === 'PromptPay' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-slate-950/80 border-slate-800 text-slate-400'}`}
              >
                <span>PromptPay QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CreditCard')}
                className={`py-2 rounded-lg text-[10px] font-bold border flex items-center justify-center gap-1 transition-all ${paymentMethod === 'CreditCard' ? 'bg-purple-500/20 border-purple-400 text-purple-400' : 'bg-slate-950/80 border-slate-800 text-slate-400'}`}
              >
                <CreditCard size={10} />
                <span>บัตรเครดิต</span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'กำลังประมวลผล...' : user ? 'ยืนยันสั่งซื้อสินค้า' : 'กรุณาเข้าสู่ระบบเพื่อสั่งซื้อ'}
          </button>

        </form>
      </div>
    </div>
  );
}
