
import React, { useState } from 'react';
import { User } from '../types';

interface LoginGateProps {
  currentUser: User | null;
  users: User[];
  allowedRoles: string[];
  onLogin: (user: User) => void;
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const LoginGate: React.FC<LoginGateProps> = ({ currentUser, users, allowedRoles, onLogin, children, title, subtitle }) => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.toLowerCase().trim();
    const password = passwordInput.trim();

    const user = users.find(u => u.email.toLowerCase() === email && u.password === password);

    if (user) {
      if (allowedRoles.includes(user.role)) {
        onLogin(user);
        setAuthError('');
      } else {
        setAuthError(`O cargo "${user.role}" não tem permissão para acessar esta área.`);
      }
    } else {
      setAuthError('E-mail ou senha incorretos.');
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
              🔐
            </div>
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            <p className="text-slate-500 mt-2">{subtitle}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">E-mail</label>
              <input
                type="email"
                required
                placeholder="seu-email@escola.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Senha</label>
              <input
                type="password"
                required
                placeholder="••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            {authError && <p className="text-rose-500 text-xs font-bold bg-rose-50 p-3 rounded-lg border border-rose-100">{authError}</p>}
            
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95"
            >
              Entrar no Sistema
            </button>
          </form>
          
          <p className="text-center text-[10px] text-slate-400 mt-6 uppercase tracking-widest font-bold">
            H.I.S Houses • Acesso Protegido
          </p>
        </div>
      </div>
    );
  }

  // Verifica novamente a permissão caso o usuário já esteja logado mas tente acessar área não permitida (troca de aba)
  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-slate-800">Acesso Negado</h2>
        <p className="text-slate-500 mt-2 max-w-md">
          Seu perfil ({currentUser.role}) não tem permissão para acessar a área de <strong>{title}</strong>.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoginGate;
