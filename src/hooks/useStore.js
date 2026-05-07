import { useState, useMemo, useCallback, useEffect } from "react";
import { INITIAL_PRODUCTS } from "../data/initialData";

export function useStore() {
  const safeLoad = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved || saved === "undefined" || saved === "null") return defaultValue;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) || typeof parsed === 'object' ? parsed : defaultValue;
    } catch (e) {
      console.error(`Error loading ${key}:`, e);
      return defaultValue;
    }
  };

  const [notification, setNotification] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const [isWholesale, setIsWholesale] = useState(() => localStorage.getItem('isna_wholesale_active') === 'true');
  const [cart, setCart] = useState(() => safeLoad('isna_db_cart', []));

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem('isna_db_cart');
  }, []);

  const [products, setProducts] = useState(() => {
    const data = safeLoad('isna_db_inventory', INITIAL_PRODUCTS);
    return (data || []).map(p => ({
      ...p,
      price: Number(p?.price) || 0,
      wholesale_price: Number(p?.wholesale_price || p?.price) || 0,
      stock_vitrina: Number(p?.stock_vitrina) || 0,
      stock_bodega: Number(p?.stock_bodega) || 0
    }));
  });

  const [sales, setSales] = useState(() => safeLoad('isna_db_sales', []));
  const [categories, setCategories] = useState(() => safeLoad('isna_db_categories', ['Todos', 'Relojes', 'Perfumes', 'Accesorios']));

  const toggleWholesale = useCallback((code) => {
    const WHOLESALE_CODE = "ISNAMAYORISTA";
    const cleanCode = (code || "").trim().toUpperCase();
    if (isWholesale) {
      setIsWholesale(false);
      localStorage.setItem('isna_wholesale_active', 'false');
      showToast('Modo minorista activado', 'info');
      return true;
    }
    if (cleanCode === WHOLESALE_CODE) {
      setIsWholesale(true);
      localStorage.setItem('isna_wholesale_active', 'true');
      showToast('¡Modo MAYORISTA activado!', 'success');
      return true;
    } else {
      showToast('Código de mayorista incorrecto', 'error');
      return false;
    }
  }, [isWholesale, showToast]);

  const stats = useMemo(() => {
    try {
      const todayStr = new Date().toDateString();
      const todaySales = (sales || []).filter(s => s && s.timestamp && new Date(s.timestamp).toDateString() === todayStr);
      return {
        total: todaySales.reduce((acc, s) => acc + (Number(s?.price || 0) * (Number(s?.quantity) || 1)), 0),
        count: todaySales.length
      };
    } catch (e) {
      return { total: 0, count: 0 };
    }
  }, [sales]);

  const registerSale = useCallback((product, quantity, customerName = 'Cliente General') => {
    if (!product) return;
    const qty = Number(quantity) || 1;
    const salePrice = isWholesale ? (Number(product.wholesale_price) || Number(product.price)) : Number(product.price);

    setProducts(prev => {
      let remainingToSell = qty;
      const updated = (prev || []).map(p => {
        if (p && p.id === product.id) {
          let v = Number(p.stock_vitrina) || 0;
          let b = Number(p.stock_bodega) || 0;
          const fromVitrina = Math.min(v, remainingToSell);
          v -= fromVitrina;
          remainingToSell -= fromVitrina;
          const fromBodega = Math.min(b, remainingToSell);
          b -= fromBodega;
          return { ...p, stock_vitrina: v, stock_bodega: b };
        }
        return p;
      });
      localStorage.setItem('isna_db_inventory', JSON.stringify(updated));
      return updated;
    });

    const newSale = {
      id: Date.now(),
      name: product.name,
      customer: customerName,
      customerData: { name: customerName, phone: 'N/A', address: 'Venta Directa', city: 'N/A' },
      price: salePrice,
      quantity: qty,
      isWholesaleSale: isWholesale,
      status: 'Pendiente',
      timestamp: new Date().toISOString(),
      dateStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSales(prev => {
      const updated = [newSale, ...(prev || [])];
      localStorage.setItem('isna_db_sales', JSON.stringify(updated));
      return updated;
    });
    showToast(`Venta registrada: ${product.name}`);
  }, [showToast, isWholesale]);

  const processOnlineOrder = useCallback((customerData) => {
    const safeCart = cart || [];
    if (safeCart.length === 0) return;
    const newSales = safeCart.map(item => ({
      id: Date.now() + Math.random(),
      name: item?.name || "Producto",
      customer: customerData?.name || "Cliente",
      customerData: customerData,
      price: isWholesale ? (Number(item?.wholesale_price) || Number(item?.price)) : Number(item?.price),
      quantity: Number(item?.quantity) || 1,
      isWholesaleSale: isWholesale,
      status: 'Pendiente',
      timestamp: new Date().toISOString(),
      dateStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    setSales(prev => {
      const updated = [...newSales, ...(prev || [])];
      localStorage.setItem('isna_db_sales', JSON.stringify(updated));
      return updated;
    });

    setProducts(prev => {
      let updated = [...(prev || [])];
      safeCart.forEach(item => {
        let remaining = Number(item?.quantity) || 0;
        updated = updated.map(p => {
          if (p && p.id === item.id) {
            let v = Number(p.stock_vitrina) || 0;
            let b = Number(p.stock_bodega) || 0;
            const fromV = Math.min(v, remaining);
            v -= fromV;
            remaining -= fromV;
            const fromB = Math.min(b, remaining);
            b -= fromB;
            return { ...p, stock_vitrina: v, stock_bodega: b };
          }
          return p;
        });
      });
      localStorage.setItem('isna_db_inventory', JSON.stringify(updated));
      return updated;
    });
    clearCart();
    showToast('¡Pedido realizado con éxito!');
  }, [cart, isWholesale, showToast, clearCart]);

  const updateSaleStatus = useCallback((saleId, newStatus) => {
    setSales(prev => {
      const updated = (prev || []).map(s => s && s.id === saleId ? { ...s, status: newStatus } : s);
      localStorage.setItem('isna_db_sales', JSON.stringify(updated));
      return updated;
    });
    showToast(`Venta actualizada a: ${newStatus}`);
  }, [showToast]);

  const clearSalesHistory = useCallback(() => {
    setSales([]);
    localStorage.setItem('isna_db_sales', JSON.stringify([]));
    showToast('Historial de ventas reiniciado', 'info');
  }, [showToast]);

  const saveProduct = useCallback((editForm) => {
    if (!editForm) return;
    const formattedProduct = {
      ...editForm,
      price: Number(editForm.price) || 0,
      wholesale_price: Number(editForm.wholesale_price) || 0,
      stock_vitrina: Number(editForm.stock_vitrina) || 0,
      stock_bodega: Number(editForm.stock_bodega) || 0
    };
    setProducts(prev => {
      let updated;
      if (formattedProduct.id) {
        updated = (prev || []).map(p => p && p.id === formattedProduct.id ? formattedProduct : p);
        showToast('Producto actualizado');
      } else {
        updated = [...(prev || []), { ...formattedProduct, id: Date.now() }];
        showToast('Nuevo producto agregado');
      }
      localStorage.setItem('isna_db_inventory', JSON.stringify(updated));
      return updated;
    });
  }, [showToast]);

  const saveCategory = useCallback((newCat) => {
    if (!newCat || (categories && categories.includes(newCat))) return;
    setCategories(prev => {
      const updated = [...(prev || []), newCat];
      localStorage.setItem('isna_db_categories', JSON.stringify(updated));
      return updated;
    });
    showToast('Categoría agregada');
  }, [categories, showToast]);

  const deleteCategory = useCallback((catToDelete) => {
    if (catToDelete === 'Todos') return;
    setCategories(prev => {
      const updated = (prev || []).filter(c => c !== catToDelete);
      localStorage.setItem('isna_db_categories', JSON.stringify(updated));
      return updated;
    });
    showToast('Categoría eliminada');
  }, [showToast]);

  const addToCart = useCallback((product) => {
    if (!product) return;
    setCart(prev => {
      const existing = (prev || []).find(item => item && item.id === product.id);
      let updated;
      if (existing) {
        updated = (prev || []).map(item => item && item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item);
      } else {
        updated = [...(prev || []), { ...product, quantity: 1 }];
      }
      localStorage.setItem('isna_db_cart', JSON.stringify(updated));
      return updated;
    });
    showToast(`Agregado: ${product.name}`);
  }, [showToast]);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => {
      const updated = (prev || []).filter(item => item && item.id !== productId);
      localStorage.setItem('isna_db_cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateCartQuantity = useCallback((productId, delta) => {
    setCart(prev => {
      const updated = (prev || []).map(item => {
        if (item && item.id === productId) {
          const newQty = Math.max(1, (item.quantity || 1) + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      });
      localStorage.setItem('isna_db_cart', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const cartTotal = useMemo(() => {
    return (cart || []).reduce((acc, item) => {
      const price = isWholesale ? (Number(item?.wholesale_price) || Number(item?.price)) : Number(item?.price);
      return acc + (price * (item?.quantity || 1));
    }, 0);
  }, [cart, isWholesale]);

  return { products, sales, stats, notification, isWholesale, categories, cart, cartTotal, toggleWholesale, showToast, registerSale, saveProduct, saveCategory, deleteCategory, addToCart, removeFromCart, updateCartQuantity, clearCart, updateSaleStatus, processOnlineOrder, clearSalesHistory };
}
