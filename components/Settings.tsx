
import React, { useState } from 'react';
import { House, ScoringCategory, User } from '../types';
import { USER_ROLES } from '../constants';

interface SettingsProps {
  users: User[];
  setUsers: (users: User[]) => void;
  currentUser: User | null;
  houses: House[];
  setHouses: (houses: House[]) => void;
  categories: ScoringCategory[];
  setCategories: (categories: ScoringCategory[]) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  users,
  setUsers,
  currentUser,
  houses,
  setHouses,
  categories,
  setCategories
}) => {
  // Estado para usuários
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: USER_ROLES.TEACHER as string,
    password: ''
  });
  const [userError, setUserError] = useState('');

  // Estado para modal de exclusão de usuário
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, userId: string | null, userName: string }>({
    isOpen: false,
    userId: null,
    userName: ''
  });

  // Estado para casas
  const [newHouse, setNewHouse] = useState({ name: '', icon: '🏰', color: '#6366f1' });
  const [houseError, setHouseError] = useState('');

  // Estado para categorias
  const [newCategory, setNewCategory] = useState({ label: '', points: 10 });
  const [categoryError, setCategoryError] = useState('');

  // --- Lógica de Usuários ---
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const email = newUser.email.toLowerCase().trim();
    
    if (!newUser.name || !newUser.email || !newUser.password) {
      setUserError('Preencha todos os campos obrigatórios (Nome, E-mail e Senha).');
      return;
    }

    if (!email.includes('@')) {
      setUserError('Insira um e-mail válido.');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === email)) {
      setUserError('Este e-mail já está cadastrado.');
      return;
    }

    const userToAdd: User = {
      id: crypto.randomUUID(),
      name: newUser.name,
      email: email,
      role: newUser.role,
      password: newUser.password
    };

    setUsers([...users, userToAdd]);
    setNewUser({ name: '', email: '', role: USER_ROLES.TEACHER, password: '' });
    setUserError('');
  };

  const confirmRemoveUser = (user: User) => {
    if (currentUser && user.id === currentUser.id) {
      alert("Você não pode remover seu próprio usuário enquanto estiver logado.");
      return;
    }
    setDeleteModal({ isOpen: true, userId: user.id, userName: user.name });
  };

  const executeRemoveUser = () => {
    if (deleteModal.userId) {
      setUsers(users.filter(u => u.id !== deleteModal.userId));
      setDeleteModal({ isOpen: false, userId: null, userName: '' });
    }
  };

  // --- Lógica de Casas ---
  const handleAddHouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHouse.name) {
      setHouseError('O nome da casa é obrigatório.');
      return;
    }
    
    const id = newHouse.name.toLowerCase().replace(/\s+/g, '-').slice(0, 10);
    if (houses.some(h => h.id === id)) {
      setHouseError('Já existe uma casa com nome similar.');
      return;
    }

    const house: House = {
      id,
      name: newHouse.name,
      color: newHouse.color,
      icon: newHouse.icon
    };

    setHouses([...houses, house]);
    setNewHouse({ name: '', icon: '🏰', color: '#6366f1' });
    setHouseError('');
  };

  const handleRemoveHouse = (id: string) => {
    if (window.confirm('Tem certeza? Os pontos históricos desta casa não serão apagados, mas ela deixará de aparecer no placar.')) {
      setHouses(houses.filter(h => h.id !== id));
    }
  };

  // --- Lógica de Categorias ---
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.label) {
      setCategoryError('O nome da categoria é obrigatório.');
      return;
    }

    const id = newCategory.label.toLowerCase().replace(/\s+/g, '-').slice(0, 15);
    if (categories.some(c => c.id === id)) {
      setCategoryError('Já existe uma categoria similar.');
      return;
    }

    const category: ScoringCategory = {
      id,
      label: newCategory.label,
      defaultPoints: newCategory.points
    };

    setCategories([...categories, category]);
    setNewCategory({ label: '', points: 10 });
    setCategoryError('');
  };

  const handleRemoveCategory = (id: string) => {
    if (window.confirm('Remover esta categoria de ação rápida?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl space-y-8 pb-12">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Administração do Sistema</h2>
        <p className="text-slate-500">Gerencie usuários, casas e categorias de pontuação.</p>
      </header>

      {/* SEÇÃO DE USUÁRIOS */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-800">Controle de Usuários</h3>
          <p className="text-sm text-slate-500 mb-4">Cadastre usuários com permissões específicas de acesso.</p>
          
          <form onSubmit={handleAddUser} className="grid md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Nome Completo</label>
              <input
                type="text"
                placeholder="Ex: Ana Silva"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="md:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">E-mail</label>
              <input
                type="email"
                placeholder="email@escola.com"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
             <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Senha</label>
              <input
                type="text"
                placeholder="****"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="md:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Cargo</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full p-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.values(USER_ROLES).map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1">
               <button
                type="submit"
                className="w-full h-[46px] bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md active:scale-95 flex items-center justify-center"
                title="Adicionar Usuário"
              >
                +
              </button>
            </div>
            
            {userError && <p className="md:col-span-12 text-rose-500 text-[10px] font-bold uppercase tracking-tight">{userError}</p>}
          </form>
        </div>

        <div className="p-6 grid gap-3 md:grid-cols-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:shadow-md transition-all">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg shadow-sm font-bold text-indigo-600 border border-indigo-50 shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-bold uppercase">{user.role}</span>
                      {user.id === currentUser?.id && <span className="text-[10px] text-emerald-600 font-bold">● Você</span>}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => confirmRemoveUser(user)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-rose-100 hover:text-rose-500 transition-colors"
                >
                  🗑️
                </button>
              </div>
            ))}
            {users.length === 0 && <p className="text-slate-400 italic text-sm p-4">Nenhum usuário cadastrado.</p>}
        </div>
      </section>

      {/* SEÇÃO DE CASAS */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-800">Gestão de Casas</h3>
          <p className="text-sm text-slate-500 mb-4">Crie ou remova casas da competição.</p>

          <form onSubmit={handleAddHouse} className="flex flex-col md:flex-row gap-3 items-start md:items-center">
             <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Nome da Casa (Ex: Grifinória)"
                value={newHouse.name}
                onChange={(e) => setNewHouse({...newHouse, name: e.target.value})}
                className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="w-24">
              <input
                type="text"
                placeholder="Emoji"
                maxLength={2}
                value={newHouse.icon}
                onChange={(e) => setNewHouse({...newHouse, icon: e.target.value})}
                className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center"
              />
            </div>
            <div className="w-20 h-[46px]">
              <input
                type="color"
                value={newHouse.color}
                onChange={(e) => setNewHouse({...newHouse, color: e.target.value})}
                className="w-full h-full rounded-xl cursor-pointer border-0 p-0"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
              Criar Casa
            </button>
          </form>
          {houseError && <p className="text-rose-500 text-[10px] mt-2 font-bold uppercase tracking-tight">{houseError}</p>}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {houses.map((house) => (
              <div key={house.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: house.color }}></div>
                <div className="flex items-center gap-3 pl-2">
                  <span className="text-2xl">{house.icon}</span>
                  <span className="font-bold text-slate-700">{house.name}</span>
                </div>
                <button
                  onClick={() => handleRemoveHouse(house.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO DE CATEGORIAS DE PONTUAÇÃO */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-800">Categorias de Pontuação</h3>
          <p className="text-sm text-slate-500 mb-4">Crie atalhos para pontuações recorrentes (Ex: Atraso, Tarefa Completa).</p>

          <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row gap-3 items-start md:items-center">
             <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Motivo (Ex: Uniforme Incompleto)"
                value={newCategory.label}
                onChange={(e) => setNewCategory({...newCategory, label: e.target.value})}
                className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div className="w-32">
              <input
                type="number"
                placeholder="Pontos"
                value={newCategory.points}
                onChange={(e) => setNewCategory({...newCategory, points: Number(e.target.value)})}
                className="w-full p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-center"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
              Criar Categoria
            </button>
          </form>
          {categoryError && <p className="text-rose-500 text-[10px] mt-2 font-bold uppercase tracking-tight">{categoryError}</p>}
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
                <span className="font-bold text-slate-700 text-sm">{category.label}</span>
                <span className={`text-xs font-black px-2 py-1 rounded-md ${category.defaultPoints >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {category.defaultPoints > 0 ? '+' : ''}{category.defaultPoints}
                </span>
                <button
                  onClick={() => handleRemoveCategory(category.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-full text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  🗑️
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-slate-400 text-sm italic w-full text-center py-4">Nenhuma categoria criada.</p>
            )}
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto">
              🗑️
            </div>
            <h3 className="text-lg font-bold text-center text-slate-800 mb-2">Excluir Colaborador</h3>
            <p className="text-sm text-center text-slate-500 mb-6">
              Gostaria de apagar o registro desse colaborador? <br/>
              <span className="font-bold text-slate-700">{deleteModal.userName}</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
                className="py-3 px-4 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Não
              </button>
              <button 
                onClick={executeRemoveUser}
                className="py-3 px-4 rounded-xl font-bold text-sm bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
