import { useState } from "react";
import { Icons } from "./Icons";

export default function AdminLogin({ onLogin, onClose, showToast }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      onLogin();
      showToast("Bienvenido, Administrador", "success");
    } else {
      showToast("Contraseña incorrecta", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-navy flex items-center justify-center p-6 z-[300] pattern-lines">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="bg-white w-full max-w-md rounded-[3rem] p-10 md:p-14 border border-brand-gold/10 relative shadow-2xl animate-scale-in">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 text-brand-navy/20 hover:text-brand-navy transition-colors"
        >
          <Icons.X size={20} />
        </button>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-brand-bg rounded-3xl flex items-center justify-center mx-auto mb-8 border border-brand-navy/5 shadow-sm">
            <Icons.Lock size={32} className="text-brand-navy" />
          </div>
          <h2 className="text-4xl font-serif font-bold text-brand-navy mb-3">Acceso Admin</h2>
          <p className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-black">ISNA Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-brand-navy/40 font-bold ml-2">Clave de Seguridad</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-brand-bg border border-brand-navy/5 rounded-2xl px-6 py-6 text-brand-navy placeholder:text-brand-navy/20 focus:outline-none focus:border-brand-gold/50 transition-all text-center text-xl tracking-[0.5em] font-bold shadow-inner"
              autoFocus
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-navy text-white py-6 rounded-2xl font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-brand-gold transition-all shadow-xl active:scale-95"
          >
            Entrar al Panel
          </button>
        </form>

        <div className="mt-14 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
             <div className="w-8 h-[1px] bg-brand-navy/10"></div>
             <div className="w-1 h-1 bg-brand-gold rounded-full"></div>
             <div className="w-8 h-[1px] bg-brand-navy/10"></div>
          </div>
          <p className="text-[9px] text-brand-navy/30 uppercase tracking-widest leading-relaxed font-medium">
            SISTEMA DE GESTIÓN AVANZADA<br/>
            © 2025 ISNA BOUTIQUE
          </p>
        </div>
      </div>
    </div>
  );
}
