
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  userEmail: string | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, userEmail, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', description: 'Progresso em Tempo Real' },
    { id: 'scoring', label: 'Pontuar', icon: '✏️', description: 'Área Restrita' },
    { id: 'transparency', label: 'Transparência', icon: '🔍', description: 'Consulta e Auditoria' },
    { id: 'settings', label: 'Acessos', icon: '⚙️', description: 'Configurações' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-4 md:p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <span className="text-xl font-bold">H</span>
        </div>
        <div className="hidden md:block">
          <h1 className="font-bold text-slate-800 leading-none">H.I.S Houses</h1>
          <span className="text-xs text-slate-400 font-medium">Sistema de Casas</span>
        </div>
      </div>

      <nav className="flex-1 p-2 md:p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <div className="hidden md:block text-left">
              <p className="font-semibold leading-tight">{item.label}</p>
              <p className={`text-[10px] ${currentView === item.id ? 'text-indigo-400' : 'text-slate-400'}`}>
                {item.description}
              </p>
            </div>
          </button>
        ))}

        {userEmail && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group text-slate-500 hover:bg-rose-50 hover:text-rose-600 mt-4 border-t border-slate-50 md:border-none"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🚪</span>
            <div className="hidden md:block text-left">
              <p className="font-semibold leading-tight">Sair</p>
              <p className="text-[10px] text-slate-400 group-hover:text-rose-400">Encerrar Sessão</p>
            </div>
          </button>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        {userEmail ? (
          <div className="space-y-3">
            <div className="hidden md:block bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Logado como</p>
              <p className="text-xs font-medium text-slate-600 truncate" title={userEmail}>{userEmail}</p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl p-3 hidden md:block">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              <p className="text-xs font-medium text-slate-400">Modo Visitante</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
