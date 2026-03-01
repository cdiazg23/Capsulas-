import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStats, useConcepts, useAuth } from '../contexts';
import { useActivityLog } from '../hooks';
import { LegalConcept } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats } = useStats();
  const { concepts, loading: conceptsLoading, error: conceptsError } = useConcepts();
  const { activityLogs } = useActivityLog();

  // Safety check: ensure concepts is always an array
  const safeConcepts = useMemo(() => concepts || [], [concepts]);

  const conceptOfTheDay = useMemo(() => safeConcepts[0] || {} as LegalConcept, [safeConcepts]);

  const categories = useMemo(() => {
    const getCategoryCount = (catName: string) => {
      return safeConcepts.filter(c => {
        const conceptCat = (c.category || '').trim().toLowerCase();
        const targetCat = catName.trim().toLowerCase();
        return conceptCat === targetCat;
      }).length;
    };

    return [
      { name: 'Derecho Civil', icon: 'gavel', color: 'indigo', count: getCategoryCount('Derecho Civil') },
      { name: 'Derecho Procesal', icon: 'account_balance', color: 'blue', count: getCategoryCount('Derecho Procesal') },
      { name: 'Derecho Constitucional', icon: 'auto_stories', color: 'amber', count: getCategoryCount('Derecho Constitucional') },
      { name: 'Derecho Penal', icon: 'security', color: 'emerald', count: getCategoryCount('Derecho Penal') },
      { name: 'Derecho Administrativo', icon: 'assured_workload', color: 'cyan', count: getCategoryCount('Derecho Administrativo') },
      { name: 'Derecho Laboral', icon: 'work', color: 'orange', count: getCategoryCount('Derecho Laboral') },
      { name: 'Derecho Comercial', icon: 'payments', color: 'violet', count: getCategoryCount('Derecho Comercial') },
    ];
  }, [safeConcepts]);

  const userRank = useMemo(() => {
    if (stats.level >= 13) return { name: 'Magistrado de la Corte', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: 'gavel', border: 'border-indigo-100' };
    if (stats.level >= 8) return { name: 'Abogado de la República', color: 'text-primary', bg: 'bg-primary/5', icon: 'balance', border: 'border-primary/20' };
    if (stats.level >= 4) return { name: 'Licenciado en Derecho', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'school', border: 'border-emerald-100' };
    return { name: 'Estudiante de Derecho', color: 'text-slate-600', bg: 'bg-slate-50', icon: 'history_edu', border: 'border-slate-200' };
  }, [stats.level]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'concept': return 'task_alt';
      case 'quiz': return 'quiz';
      case 'level_up': return 'military_tech';
      case 'session': return 'style';
      default: return 'history';
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const diff = new Date().getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    return date.toLocaleDateString();
  };

  if (conceptsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-bold">Cargando conceptos...</p>
        </div>
      </div>
    );
  }

  if (conceptsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Error al cargar conceptos</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{conceptsError.message}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark">Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 dark:text-white tracking-tight">
            Hola, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            ¿Qué vamos a dominar hoy en el Derecho?
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-6 py-4 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined fill-1">verified</span>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado de Membresía</p>
            <p className="text-sm font-bold dark:text-white uppercase">{user?.role === 'admin' ? 'Administrador' : user?.role === 'founder' ? 'Socio Fundador' : 'Plan Gratuito'}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className={`p-8 bg-white dark:bg-slate-900 rounded-[2rem] border ${userRank.border} dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-all`}>
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[100px] dark:text-white">{userRank.icon}</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className={`size-12 ${userRank.bg} dark:bg-primary/20 ${userRank.color} rounded-2xl flex items-center justify-center`}>
                <span className="material-symbols-outlined text-2xl font-black">{userRank.icon}</span>
              </div>
              <div>
                <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Rango Jurídico</p>
                <p className={`text-sm font-black uppercase tracking-tight ${userRank.color}`}>{userRank.name}</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-end justify-between mb-2">
                <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">Nivel {stats.level}</p>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stats.xp} / {stats.nextLevelXp} XP</p>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-50 dark:border-slate-700 p-0.5">
                <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-primary/30"
                  style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}></div>
              </div>
            </div>
            <p className="text-primary text-[9px] font-black uppercase tracking-[0.2em] animate-pulse">
              Faltan {stats.nextLevelXp - stats.xp} XP para el siguiente grado
            </p>
          </div>
        </div>

        <div className="p-8 bg-slate-900 dark:bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl flex flex-col justify-between group hover:scale-[1.02] transition-all overflow-hidden relative">
          <div className="absolute -top-10 -right-10 size-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Puntos de Prestigio</p>
              <div className="flex items-center gap-4 mb-8">
                <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-gold shadow-inner">
                  <span className="material-symbols-outlined text-3xl fill-1 animate-float">generating_tokens</span>
                </div>
                <p className="text-4xl font-black text-white tracking-tight">{stats.points.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Insignias por Desbloquear</p>
              <div className="flex gap-2">
                {['cognition', 'workspace_premium', 'history_edu'].map((icon, i) => (
                  <div key={i} className={`size-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 opacity-30 hover:opacity-100 transition-opacity cursor-help`}>
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                  </div>
                ))}
                <div className="size-8 rounded-lg bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-slate-600 text-[8px] font-black">+12</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between group hover:scale-[1.02] transition-all overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-[100px] text-orange-500">local_fire_department</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-12 bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-2xl font-black fill-1">local_fire_department</span>
              </div>
              <div>
                <p className="text-gray-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Racha de Repaso</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-4xl font-black text-slate-900 dark:text-white">{stats.streak}</p>
                  <p className="text-xs font-black text-orange-500 uppercase tracking-widest italic">¡En Fuego! 🔥</p>
                </div>
              </div>
            </div>
            {user?.role === 'user' && (
              <div className="mt-2 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                <span>Límite Diario</span>
                <span className={stats.consultationsToday >= 10 ? 'text-red-500' : 'text-primary'}>
                  {stats.consultationsToday} / 10
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight dark:text-white">Categorías Principales</h2>
            <button onClick={() => navigate('/app/explorer')} className="text-primary text-sm font-bold hover:underline">Ver todas</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(cat => (
              <div
                key={cat.name}
                className="group flex items-center p-5 bg-white dark:bg-slate-900 rounded-2xl border border-transparent dark:border-slate-800 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                onClick={() => navigate(`/app/explorer/${encodeURIComponent(cat.name)}`)}
              >
                <div className={`size-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary mr-4 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-gray-400 dark:text-slate-500 uppercase font-bold tracking-wider">{cat.count} Conceptos</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm transition-colors">
            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-400 dark:text-slate-500">Actividad Reciente</h4>
            <div className="space-y-4">
              {activityLogs && activityLogs.length > 0 ? (
                activityLogs.slice(0, 5).map((log, i) => (
                  <div key={i} className="flex gap-3 animate-in slide-in-from-right-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="mt-1 size-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                      <span className="material-symbols-outlined text-sm">{getActivityIcon(log.type)}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold dark:text-white line-clamp-1">{log.description}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">{formatTime(log.created_at)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center opacity-20">
                  <span className="material-symbols-outlined text-4xl block mb-2">history</span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sin actividad aún</p>
                </div>
              )}
              <button onClick={() => navigate('/app/explorer')} className="w-full mt-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                Explorar Conceptos
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-indigo-600/10 dark:from-primary/20 dark:to-indigo-600/20 rounded-[2rem] p-8 border border-primary/10 dark:border-primary/20 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 size-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10">
              <span className="material-symbols-outlined text-primary mb-4 text-4xl animate-float">psychology</span>
              <h4 className="text-lg font-black dark:text-white mb-2 tracking-tight line-clamp-1">
                {conceptOfTheDay?.concept || 'Análisis de IA'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-6 line-clamp-3 leading-relaxed">
                {conceptOfTheDay?.definitionSimple || 'Sigue explorando para que la IA personalice tu aprendizaje.'}
              </p>
              <button
                onClick={() => conceptOfTheDay?.id && navigate(`/app/concept/${conceptOfTheDay.id}`)}
                className="w-full py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                Continuar Estudio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
