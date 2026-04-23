import { Icons } from "./Icons";

export default function SalesHistory({ sales, onClose }) {
  const todaySales = sales.filter(s => {
    if (!s.timestamp) return false;
    return new Date(s.timestamp).toDateString() === new Date().toDateString();
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-end">
      <div className="bg-white w-full rounded-t-[3rem] max-h-[85vh] flex flex-col p-8 animate-slideUp">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold italic">Ventas de Hoy</h2>
          <button onClick={onClose} className="p-2 bg-stone-100 rounded-full"><Icons.X /></button>
        </div>
        <div className="overflow-y-auto space-y-3 pb-12">
          {todaySales.map(s => (
            <div key={s.id} className="flex justify-between items-center p-5 bg-stone-50 rounded-2xl border border-stone-100">
              <div>
                <p className="font-bold text-sm">{s.name}</p>
                <p className="text-[9px] text-stone-400 font-black uppercase">{s.dateStr} • {s.quantity || 1} un.</p>
              </div>
              <p className="font-serif font-bold text-emerald-600 text-lg">+${(s.price * (s.quantity || 1)).toLocaleString()}</p>
            </div>
          ))}
          {todaySales.length === 0 && (
            <p className="text-center text-stone-400 text-sm mt-8">No hay ventas registradas hoy.</p>
          )}
        </div>
      </div>
    </div>
  );
}
