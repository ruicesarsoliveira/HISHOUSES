
import React, { useState, useEffect } from 'react';
import { TEACHER_ROLES } from '../constants';
import { PointRecord, House, ScoringCategory, User } from '../types';
import { checkReasonValidity } from '../services/geminiService';

interface ScoringFormProps {
  onAddRecord: (record: PointRecord) => void;
  currentUser: User | null;
  houses: House[];
  categories: ScoringCategory[];
}

const ScoringForm: React.FC<ScoringFormProps> = ({ onAddRecord, currentUser, houses, categories }) => {
  // Use first house ID as default if available, otherwise empty string
  const [formData, setFormData] = useState({
    houseId: houses.length > 0 ? houses[0].id : '',
    studentName: '',
    points: 10,
    reason: '',
    teacherName: '',
    teacherRole: TEACHER_ROLES[0] as string
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Autofill com dados do usuário logado
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        teacherName: currentUser.name,
        teacherRole: currentUser.role
      }));
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (houses.length === 0) {
      setFeedback({ type: 'error', message: 'Nenhuma casa cadastrada no sistema. Contate a administração.' });
      return;
    }

    if (!formData.reason || !formData.teacherName || !formData.houseId) {
      setFeedback({ type: 'error', message: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const isValid = await checkReasonValidity(formData.reason);
    if (!isValid) {
      setFeedback({ type: 'error', message: 'A justificativa parece inadequada. Por favor, revise.' });
      setIsSubmitting(false);
      return;
    }

    const newRecord: PointRecord = {
      ...formData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    onAddRecord(newRecord);
    setFeedback({ type: 'success', message: 'Pontos registrados com sucesso!' });
    setFormData(prev => ({ ...prev, studentName: '', points: 10, reason: '' }));
    setIsSubmitting(false);

    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCategoryClick = (category: ScoringCategory) => {
    setFormData(prev => ({
      ...prev,
      points: category.defaultPoints,
      reason: category.label
    }));
  };

  if (houses.length === 0) {
    return (
       <div className="flex flex-col items-center justify-center h-64 text-center">
         <div className="text-4xl mb-4">🏠</div>
         <h3 className="text-xl font-bold text-slate-700">Nenhuma Casa Configurada</h3>
         <p className="text-slate-500 max-w-md mt-2">É necessário cadastrar as casas participantes na aba "Acessos" antes de lançar pontos.</p>
       </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Registrar Pontuação</h2>
          <p className="text-slate-500">Logado como: <span className="font-semibold text-indigo-600">{currentUser?.name || currentUser?.email}</span> ({currentUser?.role})</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          
          {/* Quick Actions */}
          {categories && categories.length > 0 && (
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">Ações Rápidas</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm border ${
                      cat.defaultPoints >= 0 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100' 
                      : 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100'
                    }`}
                  >
                    {cat.label} <span className="opacity-70 ml-1">({cat.defaultPoints > 0 ? '+' : ''}{cat.defaultPoints})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
            {feedback && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                <span>{feedback.type === 'success' ? '✅' : '⚠️'}</span>
                <p className="font-medium">{feedback.message}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Selecione a Casa</label>
                <div className="grid grid-cols-2 gap-3">
                  {houses.map((house) => (
                    <button
                      key={house.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, houseId: house.id })}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                        formData.houseId === house.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <span className="text-xl">{house.icon}</span>
                      <span className="text-xs font-bold text-slate-700 text-left leading-none">{house.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Identificação do Lançador</label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-100 border border-slate-200 focus:outline-none cursor-not-allowed text-slate-500"
                  readOnly
                  title="Identificação automática baseada no login"
                />
                <select
                  value={formData.teacherRole}
                  onChange={(e) => setFormData({ ...formData, teacherRole: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={!!currentUser} // Se tiver logado, bloqueia para não alterar o cargo
                >
                  {TEACHER_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Aluno (Opcional - deixe em branco para a Casa)</label>
                <input
                  type="text"
                  placeholder="Ex: João Silva"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Pontos</label>
                  <input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                    className={`w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 text-center font-bold text-xl ${
                      formData.points >= 0 
                      ? 'bg-emerald-50 text-emerald-700 focus:ring-emerald-500' 
                      : 'bg-rose-50 text-rose-700 focus:ring-rose-500'
                    }`}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Justificativa</label>
                  <textarea
                    placeholder="Ex: Ajuda na limpeza do pátio / Nota exemplar no simulado"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={1}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Validando com IA...
                </>
              ) : (
                'Confirmar Lançamento'
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
            <h3 className="font-bold text-lg mb-2">Segurança Ativa</h3>
            <p className="text-indigo-100 text-sm">Seu usuário <strong>{currentUser?.name}</strong> está autenticado. Toda pontuação é auditada para manter a transparência da gincana.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Lembrete Ético</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              O sistema utiliza inteligência artificial para monitorar a linguagem e a coerência das justificativas. 
              Pontuações abusivas ou injustificadas serão revisadas pela coordenação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringForm;
