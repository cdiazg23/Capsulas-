
import React, { useState, useRef } from 'react';
import { LegalConcept, UserStats, User } from '../types';

interface ProfileProps {
  stats: UserStats;
  user: User | null;
  onUpdateUser: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ stats, user, onUpdateUser }) => {
  const [activeModal, setActiveModal] = useState<'edit' | 'ranking' | 'badges' | null>(null);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    university: user?.university || '',
    studentLevel: user?.studentLevel || '',
    avatarUrl: user?.avatarUrl || 'https://picsum.photos/seed/lawyer/200/200'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const rankings = [
    { name: 'Carolina Paz', points: 4500, level: 8 },
    { name: 'Juan Carlos', points: 4100, level: 7 },
    { name: user?.name || 'Diego Valdés', points: stats.points, level: stats.level },
    { name: 'María Ignacia', points: 2100, level: 4 },
  ];

  const allBadges = [
    { icon: 'gavel', color: 'blue', label: 'Civil', desc: 'Dominio de Teoría de la Ley' },
    { icon: 'balance', color: 'slate', label: 'Penal', locked: true, desc: 'Próximamente' },
    { icon: 'menu_book', color: 'orange', label: 'Teoría', desc: 'Conceptos Fundamentales' },
    { icon: 'stars', color: 'purple', label: 'Pro', desc: 'Racha de 30 días' },
    { icon: 'history_edu', color: 'emerald', label: 'Escribano', locked: true, desc: 'Completa 10 quizes' },
    { icon: 'groups', color: 'indigo', label: 'Social', locked: true, desc: 'Invita a un colega' },
  ];

  const handleSaveProfile = () => {
    if (user) {
      onUpdateUser({
        ...user,
        name: editData.name,
        university: editData.university,
        studentLevel: editData.studentLevel,
        avatarUrl: editData.avatarUrl
      });
    }
    setActiveModal(null);
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

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative group">
            <div
              className="size-32 rounded-full border-4 border-white shadow-2xl bg-center bg-cover overflow-hidden"
              style={{ backgroundImage: `url("${user?.avatarUrl || 'https://picsum.photos/seed/lawyer/200/200'}")` }}
            />
            <button
              onClick={() => {
                setEditData({ ...editData, avatarUrl: user?.avatarUrl || '' });
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
            <h1 className="text-4xl font-black mb-2">{user?.name || 'Invitado'}</h1>
            <div className="flex flex-col gap-1 mb-4">
              <p className="text-gray-400 font-medium">
                {user?.role === 'admin' ? 'Administrador del Sistema' : 'Estudiante de Derecho'}
              </p>
              {user?.university && (
                <p className="text-primary text-sm font-bold flex items-center justify-center md:justify-start gap-1">
                  <span className="material-symbols-outlined text-sm">school</span>
                  {user.university}
                </p>
              )}
              {user?.studentLevel && (
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  Nivel: {user.studentLevel}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 px-4 py-2 bg-accent-gold/10 text-accent-gold rounded-xl border border-accent-gold/20">
                <span className="material-symbols-outlined text-lg fill-1">military_tech</span>
                <span className="text-xs font-bold uppercase tracking-widest">
                  {user?.role === 'admin' ? 'Consejo Superior' : 'Estudiante Inicial'}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-xl border border-blue-100">
                <span className="material-symbols-outlined text-lg fill-1">local_fire_department</span>
                <span className="text-xs font-bold uppercase tracking-widest">{stats.streak} días racha</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setEditData({
                name: user?.name || '',
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
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
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
                <p className="text-sm font-bold text-slate-800">Nivel {stats.level} (Junior Associate)</p>
                <p className="text-xs font-black text-primary">{stats.xp} / {stats.nextLevelXp} XP</p>
              </div>
              <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${(stats.xp / stats.nextLevelXp) * 100}%` }}></div>
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

        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black uppercase tracking-tight mb-8">Insignias Destacadas</h2>
          <div className="grid grid-cols-4 gap-4">
            {allBadges.slice(0, 4).map((badge, i) => (
              <div key={i} className={`flex flex-col items-center gap-2 ${badge.locked ? 'opacity-30' : ''}`}>
                <div className={`size-14 rounded-2xl bg-${badge.color}-50 text-${badge.color}-600 flex items-center justify-center border border-${badge.color}-100 shadow-sm`}>
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
            Ver todas las insignias
          </button>
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
                <button onClick={() => setActiveModal(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-sm">Cancelar</button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-[2] py-3 bg-primary text-white rounded-xl font-black text-sm shadow-lg shadow-primary/20"
                >
                  Guardar Cambios
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
              {rankings.map((r, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${r.name === user?.name ? 'bg-primary/5 border border-primary/10' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-black text-gray-300 w-4">#{i + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{r.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Nivel {r.level}</p>
                    </div>
                  </div>
                  <p className="text-primary font-black">{r.points} <span className="text-[10px] uppercase">PTS</span></p>
                </div>
              ))}
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
                <div key={i} className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-3 transition-all ${badge.locked ? 'bg-gray-50 border-gray-100 grayscale opacity-60' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className={`size-16 rounded-3xl bg-${badge.color}-50 text-${badge.color}-600 flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-3xl">{badge.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight">{badge.label}</h3>
                    <p className="text-[10px] text-gray-400 font-medium">{badge.desc}</p>
                  </div>
                  {badge.locked && (
                    <span className="material-symbols-outlined text-xs text-gray-400">lock</span>
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
