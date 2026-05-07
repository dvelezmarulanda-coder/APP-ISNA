import { useState } from "react";
import { useStore } from "./hooks/useStore";
import ShopView from "./components/ShopView";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const store = useStore();
  const [view, setView] = useState("shop"); // 'shop' | 'login' | 'admin'

  if (view === "admin") {
    return <AdminPanel store={store} onExit={() => setView("shop")} />;
  }

  if (view === "login") {
    return (
      <AdminLogin 
        onLogin={() => setView("admin")} 
        onClose={() => setView("shop")} 
        showToast={store.showToast}
      />
    );
  }

  return <ShopView store={store} onAdminClick={() => setView("login")} />;
}
