
import React, { useState, useMemo } from 'react';
import { PointRecord, House } from '../types';

interface TransparencyLogProps {
  records: PointRecord[];
  houses: House[];
  onDeleteRecord: (id: string) => void;
}

const TransparencyLog: React.FC<TransparencyLogProps> = ({ records, houses, onDeleteRecord }) => {
  const [filter, setFilter] = useState({
    search: '',
    houseId: 'all'
  });

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const houseMatches = filter.houseId === 'all' || record.houseId === filter.houseId;
      const searchLower = filter.search.toLowerCase();
      const searchMatches = 
        record.teacherName.toLowerCase().includes(searchLower) ||
        (record.studentName || '').toLowerCase().includes(searchLower) ||
        record.reason.toLowerCase().includes(searchLower);
      return houseMatches && searchMatches;
    });
  }, [records, filter]);

  const getHouseData = (id: string) => houses.find(h => h.id === id);

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Transparência</h2>
          <p className="text-slate-500">Acompanhe todos os lançamentos para garantir a justiça do processo.</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filter.houseId}
            onChange={(e) => setFilter({ ...filter, houseId: e.target.value })}
            className="p-3 rounded-xl bg-white border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Todas as Casas</option>
            {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
          <input
            type="text"
            placeholder="Pesquisar por aluno ou professor..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="p-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[250px]"
          />
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Data/Hora</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Casa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Beneficiário</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Pontos</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Justificativa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Lançado por</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRecords.length > 0 ? filteredRecords.map((record) => {
                const house = getHouseData(record.houseId);
                return (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(record.timestamp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{house?.icon || '❓'}</span>
                        <span className="font-semibold text-slate-700">{house?.name || 'Casa Excluída'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.studentName ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                        {record.studentName || 'Toda a Casa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-bold ${record.points >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {record.points > 0 ? `+${record.points}` : record.points}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-sm text-slate-600 truncate" title={record.reason}>{record.reason}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">{record.teacherName}</span>
                        <span className="text-[10px] text-slate-400 uppercase">{record.teacherRole}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => onDeleteRecord(record.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors"
                        title="Remover registro"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Nenhum registro encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransparencyLog;
