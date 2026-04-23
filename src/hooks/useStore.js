import { useState, useMemo, useCallback } from "react";
import { INITIAL_PRODUCTS } from "../data/initialData";

export function useStore() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('isna_db_inventory');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('isna_db_sales');
    return saved ? JSON.parse(saved) : [];
  });
  const [notification, setNotification] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const stats = useMemo(() => {
    const todayStr = new Date().toDateString();
    const todaySales = sales.filter(s => {
      if (!s.timestamp) return false;
      return new Date(s.timestamp).toDateString() === todayStr;
    });
    return {
      total: todaySales.reduce((acc, s) => acc + (s.price * (s.quantity || 1)), 0),
      count: todaySales.length
    };
  }, [sales]);

  const registerSale = useCallback((product, quantity) => {
    let remainingToSell = quantity;
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === product.id) {
          let v = parseInt(p.stock_vitrina) || 0;
          let b = parseInt(p.stock_bodega) || 0;
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
      price: product.price,
      quantity: quantity,
      timestamp: new Date().toISOString(),
      dateStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSales(prev => {
      const updated = [newSale, ...prev];
      localStorage.setItem('isna_db_sales', JSON.stringify(updated));
      return updated;
    });
    showToast(`Venta registrada (${quantity}): ${product.name}`);
  }, [showToast]);

  const saveProduct = useCallback((editForm) => {
    const formattedProduct = {
      ...editForm,
      price: parseInt(editForm.price) || 0,
      stock_vitrina: parseInt(editForm.stock_vitrina) || 0,
      stock_bodega: parseInt(editForm.stock_bodega) || 0
    };

    setProducts(prev => {
      let updated;
      if (formattedProduct.id) {
        updated = prev.map(p => p.id === formattedProduct.id ? formattedProduct : p);
        showToast('Producto actualizado');
      } else {
        updated = [...prev, { ...formattedProduct, id: Date.now() }];
        showToast('Nuevo producto agregado');
      }
      localStorage.setItem('isna_db_inventory', JSON.stringify(updated));
      return updated;
    });
  }, [showToast]);

  return { products, sales, stats, notification, showToast, registerSale, saveProduct };
}
