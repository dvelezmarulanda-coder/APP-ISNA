import { useState } from "react";
import { LOGO_URL } from "../data/initialData";

export default function AdminLogin({ onLogin, onClose, showToast }) {
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') { 
      onLogin(); 
    } else { 
      showToast('PIN Incorrecto', 'error'); 
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8 relative overflow-hidden">
      {/* Vetas amarillas sutiles en login */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-900/20 via-transparent to-yellow-900/20"></div>
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-yellow-500 blur-[150px] opacity-10 rotate-45"></div>
      </div>

      <div className="w-full max-w-sm text-center relative z-10">
        <img src={LOGO_URL} className="w-24 h-24 rounded-full object-cover mx-auto mb-8 shadow-2xl border-2 border-white/10" alt="Logo" />
        <h2 className="text-5xl font-serif text-white mb-12 italic tracking-tighter">ISNA</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="password" 
            placeholder="PIN" 
            className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl text-white outline-none text-center tracking-[0.8em] text-2xl font-bold" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            autoFocus 
          />
          <button type="submit" className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-stone-200 transition-colors">
            Autenticar
          </button>
          <button type="button" onClick={onClose} className="text-stone-600 text-[10px] font-black uppercase mt-8 block mx-auto tracking-widest">
            Regresar
          </button>
        </form>
      </div>
    </div>
  );
}
