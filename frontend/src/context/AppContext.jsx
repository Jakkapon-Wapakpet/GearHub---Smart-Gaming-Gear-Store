import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const API_BASE = 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gearhub_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('gearhub_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('gearhub_compare');
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Sync to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('gearhub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gearhub_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('gearhub_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gearhub_compare', JSON.stringify(compareList));
  }, [compareList]);

  // Load products from API
  const fetchProducts = async (category = '', search = '') => {
    setLoadingProducts(true);
    try {
      let url = `${API_BASE}/products`;
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Auth Operations
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      setUser(data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setUser(data);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setCompareList([]);
  };

  // Cart Operations
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const exists = prev.find(item => item.productId === product._id);
      if (exists) {
        return prev.map(item =>
          item.productId === product._id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, {
        productId: product._id,
        name: product.name,
        price: product.price,
        images: product.images,
        stock: product.stock,
        quantity: Math.min(quantity, product.stock)
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prev => prev.map(item =>
      item.productId === productId
        ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  // Compare Operations
  const toggleCompare = (product) => {
    setCompareList(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        return prev.filter(item => item._id !== product._id);
      }
      if (prev.length >= 3) {
        alert("เปรียบเทียบสินค้าได้สูงสุด 3 ชิ้นเท่านั้นครับ");
        return prev;
      }
      return [...prev, product];
    });
  };

  const clearCompare = () => setCompareList([]);

  // Order checkout
  const checkout = async (shippingAddress, paymentMethod) => {
    if (!user || !user.token) return { success: false, error: 'กรุณาเข้าสู่ระบบก่อนชำระเงิน' };
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderData = {
      items: cart,
      shippingAddress,
      paymentMethod,
      totalAmount
    };

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to place order');
      clearCart();
      return { success: true, order: data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Get orders history
  const getMyOrders = async () => {
    if (!user || !user.token) return [];
    try {
      const res = await fetch(`${API_BASE}/orders/my-orders`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      cart,
      compareList,
      products,
      loadingProducts,
      fetchProducts,
      login,
      register,
      logout,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleCompare,
      clearCompare,
      checkout,
      getMyOrders,
      API_BASE
    }}>
      {children}
    </AppContext.Provider>
  );
};
