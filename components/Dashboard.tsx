
import React, { useMemo, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { PointRecord, House } from '../types';
import { generateHouseSummary } from '../services/geminiService';

interface DashboardProps {
  records: PointRecord[];
  houses: House[];
}

const Dashboard: React.FC<DashboardProps> = ({ records, houses }) => {
  const [summaries, setSummaries] = useState<Record<string, string>>({});

  // Calculate totals
  const houseTotals = useMemo(() => {
    return houses.map(house => {
      const total = records
        .filter(r => r.houseId === house.id)
        .reduce((sum, r) => sum + r.points, 0);
      return {
        ...house,
        total
      };
    }).sort((a, b) => b.total - a.total);
  }, [records, houses]);

  // Calculate time progression (points per day or index)
  const progressionData = useMemo(() => {
    if (records.length === 0) return [];
    
    const sorted = [...records].sort((a, b) => a.timestamp - b.timestamp);
    const result: any[] = [];
    const runningTotals: Record<string, number> = {};
    
    houses.forEach(h => runningTotals[h.id] = 0);

    sorted.forEach((record, index) => {
      // Somente processa se a casa ainda existir
      if (runningTotals[record.houseId] !== undefined) {
        runningTotals[record.houseId] += record.points;
      }
      
      // Cria um ponto no gráfico esporadicamente ou no último item
      if (index % Math.max(1, Math.floor(sorted.length / 10)) === 0 || index === sorted.length - 1) {
        const entry: any = { time: new Date(record.timestamp).toLocaleDateString() };
        houses.forEach(h => {
          entry[h.name] = runningTotals[h.id];
        });
        result.push(entry);
      }
    });

    return result;
  }, [records, houses]);

  useEffect(() => {
    const loadSummaries = async () => {
      const newSummaries: Record<string, string> = {};
      for (const house of houses) {
        const houseRecords = records.filter(r => r.houseId === house.id);
        if (houseRecords.length > 0) {
          const summary = await generateHouseSummary(house.name, houseRecords);
          newSummaries[house.id] = summary;
        }
      }
      setSummaries(newSummaries);
    };

    if (records.length > 0 && houses.length > 0) {
      loadSummaries();
    }
  }, [records.length, houses.length]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Placar Geral</h2>
          <p className="text-slate-500">Acompanhe a evolução da disputa entre as casas em tempo real.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Tempo Real
        </div>
      </header>

      {/* House Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {houseTotals.map((house, index) => (
          <div 
            key={house.id} 
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-2xl bg-slate-50 text-3xl group-hover:scale-110 transition-transform">
                {house.icon}
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RANK {index + 1}</span>
                <span className={`text-2xl font-black ${index === 0 ? 'text-amber-500' : 'text-slate-700'}`}>
                  {house.total} <span className="text-xs font-medium text-slate-400">PTS</span>
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">{house.name}</h3>
              <p className="text-xs text-slate-500 italic mt-2 line-clamp-2 min-h-[2.5em]">
                {summaries[house.id] || "Aguardando atividades..."}
              </p>
            </div>
            <div 
              className="absolute bottom-0 left-0 h-1 transition-all duration-500" 
              style={{ backgroundColor: house.color, width: '100%' }}
            />
          </div>
        ))}
        {houses.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
            Nenhuma casa cadastrada. Vá em "Acessos" para criar.
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Progression Chart */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800">Evolução Histórica</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">Progresso</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                {houses.map(h => (
                  <Line 
                    key={h.id} 
                    type="monotone" 
                    dataKey={h.name} 
                    stroke={h.color} 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800">Comparação Atual</h3>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase">Totalização</span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={houseTotals}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  // tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="total" 
                  radius={[8, 8, 0, 0]}
                  fill="#6366f1"
                  label={{ position: 'top', fontSize: 12, fontWeight: 'bold', fill: '#475569' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Feed */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Atividade Recente</h3>
        <div className="space-y-4">
          {records.slice(0, 5).map(record => {
            const house = houses.find(h => h.id === record.houseId);
            return (
              <div key={record.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="text-2xl">{house?.icon || '❓'}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">
                    <span className="text-indigo-600">{record.teacherName}</span> pontuou a {house?.name || 'Casa desconhecida'}
                  </p>
                  <p className="text-xs text-slate-500">{record.reason}</p>
                </div>
                <div className="text-right">
                  <span className="block font-black text-emerald-600">+{record.points}</span>
                  <span className="text-[10px] text-slate-400 uppercase">
                    {new Date(record.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          {records.length === 0 && (
            <p className="text-center text-slate-400 py-8 italic">Nenhuma pontuação registrada ainda. Que comecem os jogos!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
