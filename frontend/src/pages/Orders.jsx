import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { ShoppingBag, Calendar, Truck, Tag, CreditCard } from 'lucide-react';

export default function Orders() {
  const { getMyOrders, user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        const data = await getMyOrders();
        setOrders(data);
      }
      setLoading(false);
    };
    loadOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
      case 'Delivered':
        return 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/20';
      case 'Shipped':
      case 'Processing':
        return 'bg-cyan-950/60 text-cyan-400 border border-cyan-500/20';
      case 'Cancelled':
        return 'bg-rose-950/60 text-rose-400 border border-rose-500/20';
      default:
        return 'bg-amber-950/60 text-amber-400 border border-amber-500/20';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Pending': return 'รอการชำระเงิน';
      case 'Paid': return 'ชำระเงินแล้ว';
      case 'Processing': return 'กำลังจัดเตรียมสินค้า';
      case 'Shipped': return 'จัดส่งแล้ว';
      case 'Delivered': return 'ได้รับสินค้าแล้ว';
      case 'Cancelled': return 'ยกเลิกแล้ว';
      default: return status;
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <span className="text-slate-500 text-sm">กรุณาเข้าสู่ระบบก่อนเข้าหน้านี้</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">ประวัติการสั่งซื้อของคุณ</h1>
        <p className="text-slate-500 text-xs">ข้อมูลรายละเอียดพัสดุและสินค้าที่คุณเคยซื้อกับเรา</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
          <span className="text-slate-500 text-sm">กำลังดึงประวัติการสั่งซื้อของคุณ...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/10 rounded-2xl border border-slate-900 border-dashed">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mx-auto mb-3">
            <ShoppingBag size={20} />
          </div>
          <span className="text-slate-500 text-sm">คุณยังไม่มีประวัติการทำรายการในฐานข้อมูล</span>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order._id}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 glass relative space-y-4 shadow-xl"
            >
              {/* Order Header Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">เลขใบสั่งซื้อ</span>
                    <span className="font-mono text-slate-300 font-bold">{order._id}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={13} className="text-purple-400" />
                    <span>{new Date(order.orderDate).toLocaleDateString('th-TH')}</span>
                  </div>
                </div>

                <div className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-950 border border-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-400">
                        {item.quantity}x
                      </div>
                      <span className="font-semibold text-slate-300">{item.name}</span>
                    </div>
                    <span className="font-mono text-cyan-400">฿{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer Meta */}
              <div className="pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                {/* Shipping Info */}
                <div className="space-y-1 text-slate-500 max-w-md">
                  <div className="flex items-center gap-1.5">
                    <Truck size={12} className="text-purple-400" />
                    <span className="font-semibold text-slate-300">{order.shippingAddress.receiverName}</span>
                    <span className="text-[10px]">({order.shippingAddress.phone})</span>
                  </div>
                  <p className="text-[10px] pl-4 leading-relaxed">
                    {order.shippingAddress.addressLine} ต.{order.shippingAddress.subDistrict} อ.{order.shippingAddress.district} จ.{order.shippingAddress.province} {order.shippingAddress.postalCode}
                  </p>
                  
                  {order.trackingNumber && (
                    <div className="pl-4 pt-1 flex items-center gap-1 text-[10px] text-cyan-400">
                      <Tag size={10} />
                      <span>รหัสติดตามพัสดุ: <span className="font-mono font-bold">{order.trackingNumber}</span></span>
                    </div>
                  )}
                </div>

                {/* Total amount and pay details */}
                <div className="text-right flex items-center gap-4 sm:block">
                  <div className="flex items-center gap-1.5 text-slate-500 pl-4 sm:pl-0 sm:justify-end text-[10px] mb-1">
                    <CreditCard size={12} className="text-cyan-400" />
                    <span>ชำระผ่าน: {order.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 mr-2">ราคาสุทธิ:</span>
                    <span className="text-sm font-extrabold text-cyan-400">฿{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
