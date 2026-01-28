
import React, { useState, useEffect } from 'react';
import { View, PointRecord, House, ScoringCategory, User } from './types';
import Sidebar from './components/Sidebar';
import ScoringForm from './components/ScoringForm';
import TransparencyLog from './components/TransparencyLog';
import Dashboard from './components/Dashboard';
import LoginGate from './components/LoginGate';
import Settings from './components/Settings';
import { INITIAL_USERS, INITIAL_HOUSES, INITIAL_SCORING_CATEGORIES, USER_ROLES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // Usuário Logado (Sessão)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('school_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Gestão de Usuários (Banco de Dados Local)
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('school_users_db');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Gestão de Casas
  const [houses, setHouses] = useState<House[]>(() => {
    const saved = localStorage.getItem('school_houses');
    return saved ? JSON.parse(saved) : INITIAL_HOUSES;
  });

  // Gestão de Categorias
  const [scoringCategories, setScoringCategories] = useState<ScoringCategory[]>(() => {
    const saved = localStorage.getItem('school_scoring_categories');
    return saved ? JSON.parse(saved) : INITIAL_SCORING_CATEGORIES;
  });

  // Registros de Pontos
  const [records, setRecords] = useState<PointRecord[]>(() => {
    const saved = localStorage.getItem('school_points_records');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem('school_points_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('school_users_db', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('school_houses', JSON.stringify(houses));
  }, [houses]);

  useEffect(() => {
    localStorage.setItem('school_scoring_categories', JSON.stringify(scoringCategories));
  }, [scoringCategories]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('school_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('school_current_user');
    }
  }, [currentUser]);

  // --- Actions ---

  const addRecord = (record: PointRecord) => {
    setRecords(prev => [record, ...prev]);
  };

  const deleteRecord = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este registro?')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    // Definição de Permissões por Cargo
    const ALL_STAFF_ROLES = [
      USER_ROLES.ADMIN, 
      USER_ROLES.COORDINATOR, 
      USER_ROLES.COORD_TEAM, 
      USER_ROLES.TEACHER, 
      USER_ROLES.INSPECTOR
    ];

    const MANAGEMENT_ROLES = [
      USER_ROLES.ADMIN,
      USER_ROLES.COORDINATOR
    ];

    switch (currentView) {
      case 'scoring':
        return (
          <LoginGate 
            currentUser={currentUser}
            users={users}
            allowedRoles={ALL_STAFF_ROLES}
            onLogin={setCurrentUser}
            title="Área de Pontuação"
            subtitle="Identifique-se com e-mail e senha para registrar pontos."
          >
            <ScoringForm 
              houses={houses}
              categories={scoringCategories}
              onAddRecord={addRecord} 
              currentUser={currentUser} 
            />
          </LoginGate>
        );
      case 'transparency':
        return (
          <LoginGate 
            currentUser={currentUser}
            users={users}
            allowedRoles={ALL_STAFF_ROLES}
            onLogin={setCurrentUser}
            title="Consulta de Auditoria"
            subtitle="Área restrita para equipe escolar."
          >
            <TransparencyLog 
              houses={houses}
              records={records} 
              onDeleteRecord={deleteRecord} 
            />
          </LoginGate>
        );
      case 'settings':
        return (
          <LoginGate 
            currentUser={currentUser}
            users={users}
            allowedRoles={MANAGEMENT_ROLES}
            onLogin={setCurrentUser}
            title="Gestão Geral"
            subtitle="Acesso restrito a Administradores e Coordenadores."
          >
            <Settings 
              users={users}
              setUsers={setUsers}
              currentUser={currentUser}
              houses={houses}
              setHouses={setHouses}
              categories={scoringCategories}
              setCategories={setScoringCategories}
            />
          </LoginGate>
        );
      case 'dashboard':
        return <Dashboard records={records} houses={houses} />;
      default:
        return <Dashboard records={records} houses={houses} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        userEmail={currentUser?.email || null}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
