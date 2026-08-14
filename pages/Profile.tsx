import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth, useStats } from '../contexts';
import { useNavigate } from 'react-router-dom';
import { JUDICIAL_CAREER, getUserRank } from '../utils/ranks';
import { supabase } from '../lib/supabase';


const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { stats } = useStats();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<'edit' | 'ranking' | 'badges' | null>(null);
  const [saving, setSaving] = useState(false);

  const [editData, setEditData] = useState({
    name: user?.name || 'Usuario',
    university: user?.university || '',
    studentLevel: user?.studentLevel || '',
    avatarUrl: user?.avatarUrl || 'https://picsum.photos/seed/lawyer/200/200'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const currentRank = React.useMemo(() => {
    return getUserRank(stats.level);
  }, [stats.level]);

  const allBadges = React.useMemo(() => [
    { icon: 'cognition', color: 'blue', label: 'Iniciado', desc: 'Aprende 10 conceptos', active: stats.learnedConcepts >= 10 },
    { icon: 'workspace_premium', color: 'slate', label: 'Enciclopedia', desc: 'Aprende 50 conceptos', active: stats.learnedConcepts >= 50 },
    { icon: 'history_edu', color: 'orange', label: 'Escribano', desc: 'Aprende 100 conceptos', active: stats.learnedConcepts >= 100 },
    { icon: 'local_fire_department', color: 'purple', label: 'Constancia', desc: 'Racha de 7 días', active: stats.streak >= 7 },
    { icon: 'stars', color: 'emerald', label: 'Ley de Acero', desc: 'Racha de 30 días', active: stats.streak >= 30 },
    { icon: 'military_tech', color: 'indigo', label: 'Premium', desc: 'Membresía Activa', active: user?.role === 'admin' || user?.subscription_status === 'active' || user?.subscription_status === 'trialing' },
  ], [stats.learnedConcepts, stats.streak, user?.role, user?.subscription_status]);


  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editData.name,
          avatar_url: editData.avatarUrl
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving profile to DB:', error);
      }

      updateUser({
        ...user,
        name: editData.name,
        university: editData.university,
        studentLevel: editData.studentLevel,
        avatarUrl: editData.avatarUrl
      });
      setActiveModal(null);
    } catch (err) {
      console.error('Error in handleSaveProfile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({ ...editData, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("No se pudo acceder a la cámara. Revisa los permisos.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const photoData = canvasRef.current.toDataURL('image/jpeg');
        setEditData({ ...editData, avatarUrl: photoData });
        stopCamera();
        setActiveModal('edit'); // Return to edit modal
      }
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-10 animate-in slide-in-from-right-4 duration-500">
      <Helmet>
        <title>{`${user.name} - Mi Perfil | IurisAcademy`}</title>
        <meta name="description" content="Gestiona tu perfil, carrera judicial, estadísticas de aprendizaje y logros alcanzados en IurisAcademy." />
      </Helmet>

      <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
          <div className="relative group">
            <div
              className="size-24 md:size-32 rounded-full border-4 border-white shadow-2xl bg-center bg-cover overflow-hidden"
              style={{ backgroundImage: `url("${user?.avatarUrl || 'https://picsum.photos/seed/lawyer/200/200'}")` }}
            />
            <button
              onClick={() => {
                setEditData({
                  name: user?.name || 'Usuario',
                  university: user?.university || '',
                  studentLevel: user?.studentLevel || '',
                  avatarUrl: user?.avatarUrl || ''
                });
                setActiveModal('edit');
              }}
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white hover:scale-110 transition-transform"
            >
              <span className="material-symbols-outlined text-sm">photo_camera</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black mb-2">{user?.name || 'Invitado'}</h1>
            <div className="flex flex-col gap-1 mb-4">
              <p className="text-gray-400 font-medium">
                {user?.role === 'admin' ? 'Administrador del Sistema' : (user?.subscription_status === 'active' ? 'Plan Premium' : user?.subscription_status === 'trialing' ? 'Prueba Gratuita' : 'Estudiante de Derecho')}
              </p>

              {user?.university && (
                <p className="text-primary text-sm font-bold flex items-center justify-center md:justify-start gap-1">
                  <span className="material-symbols-outlined text-sm">school</span>
                  {user?.university}
                </p>
              )}
              {user?.studentLevel && (
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  Nivel: {user?.studentLevel}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {(user?.role === 'admin' || user?.subscription_status === 'active' || user?.subscription_status === 'trialing') ? (
                <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/20 to-indigo-500/20 text-primary rounded-2xl border border-primary/30 shadow-lg shadow-primary/10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine transition-transform duration-1000"></div>
                  <span className="material-symbols-outlined text-xl fill-1 animate-float">
                    {user?.role === 'admin' ? 'military_tech' : 'workspace_premium'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em]">
                    {user?.role === 'admin' ? 'CONSEJO SUPERIOR' : (user?.subscription_status === 'active' ? 'ACCESSO PREMIUM' : 'PRUEBA GRATUITA')}
                  </span>
                </div>

              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="material-symbols-outlined text-lg fill-1 text-primary">{currentRank.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                    {currentRank.name}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-xl border border-blue-100">
                <span className="material-symbols-outlined text-lg fill-1">local_fire_department</span>
                <span className="text-xs font-bold uppercase tracking-widest">{stats.streak} días racha</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setEditData({
                  name: user?.name || 'Usuario',
                  university: user?.university || '',
                  studentLevel: user?.studentLevel || '',
                  avatarUrl: user?.avatarUrl || 'https://picsum.photos/seed/lawyer/200/200'
                });
                setActiveModal('edit');
              }}
              className="px-8 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all"
            >
              Editar Perfil
            </button>
            <button
              onClick={() => navigate('/app/billing')}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all"
            >
              Gestionar Suscripción
            </button>
          </div>

        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black uppercase tracking-tight">Estadísticas</h2>
            <button
              onClick={() => setActiveModal('ranking')}
              className="text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              Ver ranking
            </button>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold text-slate-800">{currentRank.name}</p>
                <p className="text-xs font-black text-primary">{stats.xp} / {stats.nextLevelXp} XP</p>
              </div>
              <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all duration-1000 animate-shine" style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Conceptos Aprendidos</p>
                <p className="text-2xl font-black">{stats.learnedConcepts}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Quizes Completados</p>
                <p className="text-2xl font-black">{stats.completedQuizzes}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black uppercase tracking-tight mb-8 text-center md:text-left">Insignias Destacadas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {allBadges.slice(0, 4).map((badge, i) => (
              <div key={i} className={`flex flex-col items-center gap-2 ${!badge.active ? 'opacity-30 grayscale' : ''}`}>
                <div className={`size-14 rounded-2xl bg-${badge.color}-50 text-${badge.color}-600 flex items-center justify-center border border-${badge.color}-100 shadow-sm transition-all hover:scale-110`}>
                  <span className="material-symbols-outlined text-2xl">{badge.icon}</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-center">{badge.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveModal('badges')}
            className="w-full mt-8 py-3 bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
          >
            Ver todas las insignias ({allBadges.filter(b => b.active).length}/{allBadges.length})
          </button>
        </div>
      </div>

      {/* Judicial Career Section */}
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <span className="material-symbols-outlined text-[150px]">gavel</span>
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black italic mb-2 tracking-tight">CARRERA JUDICIAL</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-12">Escalafón del Poder Judicial de IurisAcademy</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {JUDICIAL_CAREER.map((rank, i) => {
              const isLocked = stats.level < rank.level;
              return (
                <div key={i} className={`flex flex-col items-center gap-4 transition-all ${isLocked ? 'opacity-20' : 'scale-110'}`}>
                  <div className={`size-16 rounded-3xl flex items-center justify-center shadow-xl ${isLocked ? 'bg-white/5 border border-white/5' : 'bg-primary border-4 border-white/20'}`}>
                    <span className="material-symbols-outlined text-3xl">{rank.icon}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nivel {rank.level}</p>
                    <p className={`text-xs font-black uppercase mt-1 ${isLocked ? 'text-slate-600' : 'text-primary'}`}>{rank.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {activeModal === 'edit' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8 animate-in zoom-in-95">
            <h2 className="text-2xl font-black mb-6">Editar Perfil</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="size-16 rounded-full bg-center bg-cover border-2 border-gray-100"
                  style={{ backgroundImage: `url("${editData.avatarUrl}")` }}
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">upload</span>
                    Subir Archivo
                  </button>
                  <button
                    onClick={() => {
                      setActiveModal(null);
                      startCamera();
                    }}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">videocam</span>
                    Usar Cámara
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nombre Público</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full bg-gray-50 border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Universidad</label>
                <input
                  type="text"
                  value={editData.university}
                  placeholder="Ej. Pontificia Universidad Católica"
                  onChange={(e) => setEditData({ ...editData, university: e.target.value })}
                  className="w-full bg-gray-50 border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nivel / Año</label>
                <input
                  type="text"
                  value={editData.studentLevel}
                  placeholder="Ej. 5to Año"
                  onChange={(e) => setEditData({ ...editData, studentLevel: e.target.value })}
                  className="w-full bg-gray-50 border-gray-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setActiveModal(null)} 
                  disabled={saving}
                  className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex-[2] py-3 bg-primary text-white rounded-xl font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'ranking' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Top Estudiantes</h2>
              <button onClick={() => setActiveModal(null)} className="text-gray-400"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-primary/5 border border-dashed border-primary/20 rounded-2xl text-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-2">diversity_3</span>
                <p className="text-sm font-bold text-slate-800">Ranking Global en Desarrollo</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1 italic">Tus puntos actuales: {stats.points}</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-black text-primary w-4">🏆</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user?.name} (Tú)</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Nivel {stats.level} • {currentRank.name}</p>
                  </div>
                </div>
                <p className="text-primary font-black">{stats.points} <span className="text-[10px] uppercase">PTS</span></p>
              </div>

              <div className="pt-4 text-center">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  Próximamente podrás competir contra otros estudiantes de derecho de toda Latinoamérica. ¡Sigue acumulando prestigio!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'badges' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden p-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Mis Logros</h2>
              <button onClick={() => setActiveModal(null)} className="text-gray-400"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allBadges.map((badge, i) => (
                <div key={i} className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-3 transition-all ${!badge.active ? 'bg-gray-50 border-gray-100 grayscale opacity-60' : 'bg-white border-primary shadow-lg shadow-primary/5'}`}>
                  <div className={`size-16 rounded-3xl bg-${badge.color}-50 text-${badge.color}-600 flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-3xl">{badge.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight">{badge.label}</h3>
                    <p className="text-[10px] text-gray-400 font-medium">{badge.desc}</p>
                  </div>
                  {!badge.active && (
                    <span className="material-symbols-outlined text-xs text-gray-400">lock</span>
                  )}
                  {badge.active && (
                    <div className="px-2 py-1 bg-primary text-[8px] text-white font-black rounded-full uppercase">Completado</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {cameraActive && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-8 animate-in zoom-in-95">
            <h2 className="text-2xl font-black mb-6">Capturar Foto</h2>
            <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden mb-6 relative border-4 border-gray-100 shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-4">
              <button
                onClick={stopCamera}
                className="flex-1 py-4 bg-gray-100 text-slate-900 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={capturePhoto}
                className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">center_focus_strong</span>
                Capturar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
