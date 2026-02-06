import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts';
import { supabase } from '../lib/supabase';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn, signUp, resetPassword, updatePassword } = useAuth();
  const [isResetMode, setIsResetMode] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Ingresa tu email para resetear la contraseña');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setSuccessMsg('Se ha enviado un enlace de recuperación a tu correo. Revisa tu bandeja de entrada o spam.');
      setIsResetMode(false);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  // Redirigir si ya está autenticado (y no estamos en modo recuperación)
  React.useEffect(() => {
    if (user && !authLoading && !isUpdateMode) {
      console.log('🚀 Usuario ya autenticado, redirigiendo...');
      navigate('/app/dashboard');
    }
  }, [user, authLoading, navigate, isUpdateMode]);

  // Escuchar evento de recuperación de contraseña
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsUpdateMode(true);
        setIsResetMode(false);
        setIsSignUp(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await updatePassword(password);
      setSuccessMsg('¡Contraseña actualizada con éxito! Ya puedes ingresar.');
      setIsUpdateMode(false);
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    console.log('🔐 Iniciando autenticación...', { email, isSignUp });

    if (isSignUp && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('La operación está tardando más de lo esperado. Por favor, revisa tu conexión o intenta recargar la página.');
      console.warn('⚠️ [Auth] La operación excedió el tiempo límite (45s)');
    }, 45000);

    try {
      if (isSignUp) {
        await signUp(email, password);
        clearTimeout(timeoutId);
        setSuccessMsg('¡Registro exitoso! Por favor, revisa tu correo para confirmar tu cuenta.');
        setLoading(false);
      } else {
        await signIn(email, password);
        clearTimeout(timeoutId);
        setLoading(false);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('❌ Auth error:', err);
      setError(err.message || 'Error en la autenticación. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Columna Izquierda: Decorativa */}
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-slate-900 dark:bg-slate-950 p-20 transition-colors duration-300">
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200")' }}></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-gold/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-8">
            <span className="material-symbols-outlined text-sm text-accent-gold">volunteer_activism</span>
            <span className="text-[12px] font-bold text-white uppercase tracking-wider">Unidos por la educación legal</span>
          </div>
          <h1 className="text-white text-6xl font-black leading-tight mb-8">
            Tu estudio, <br />
            <span className="text-primary italic">nuestra comunidad</span>
          </h1>
          <p className="text-white/70 text-lg font-medium leading-relaxed border-l-4 border-primary pl-6">
            IurisAcademy es un proyecto independiente mantenido por estudiantes y abogados. Únete para potenciar tu estudio y ayudar a que la educación legal llegue a todos.
          </p>

          <div className="mt-12 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
            <div className="size-12 bg-primary/20 rounded-xl flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-primary text-2xl">brand_awareness</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">@capsulasdederecho</p>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none">Creador del Proyecto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Formulario */}
      <div className="flex items-center justify-center p-8 md:p-16 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2">
            <h2 className="text-slate-900 dark:text-white text-4xl font-black tracking-tight">
              {isUpdateMode ? 'Crea tu nueva clave' : isResetMode ? 'Recuperar clave' : isSignUp ? 'Únete a la comunidad' : 'Bienvenido de vuelta'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {isUpdateMode
                ? 'Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.'
                : isResetMode
                  ? 'Te enviaremos un correo con las instrucciones para crear una nueva contraseña.'
                  : isSignUp
                    ? 'Crea tu cuenta gratuita y empieza a dominar el código hoy mismo.'
                    : 'Ingresa tus credenciales para continuar con tu progreso de aprendizaje.'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={isUpdateMode ? handleUpdatePassword : (isResetMode ? handleResetPassword : handleAuth)}>
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/20 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              </div>
            )}

            {successMsg && (
              <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 rounded-2xl text-sm font-bold border border-emerald-100 dark:border-emerald-900/20 animate-in zoom-in duration-300">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl">mark_email_read</span>
                  <p>{successMsg}</p>
                </div>
              </div>
            )}

            {!isUpdateMode && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest ml-1">Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all p-4 text-slate-900 dark:text-white"
                  required
                />
              </div>
            )}

            {!isResetMode && (
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest">
                    {isUpdateMode ? 'Nueva Contraseña' : 'Contraseña'}
                  </label>
                  {!isSignUp && !isUpdateMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true);
                        setError('');
                        setSuccessMsg('');
                      }}
                      className="text-[10px] font-black text-primary uppercase tracking-wider hover:underline"
                    >
                      ¿Olvidaste tu clave?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all p-4 text-slate-900 dark:text-white pr-12"
                    required={!isResetMode}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
            )}

            {(isSignUp || isUpdateMode) && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest ml-1">Repetir Contraseña</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-14 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all p-4 text-slate-900 dark:text-white pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading
                ? 'Procesando...'
                : isUpdateMode
                  ? 'Actualizar Contraseña'
                  : isResetMode
                    ? 'Enviar enlace de recuperación'
                    : isSignUp
                      ? 'Unirse Ahora'
                      : 'Ingresar al Dashboard'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-black">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-300 dark:text-slate-600 transition-colors">Comunidad</span>
            </div>
          </div>

          <p className="text-center text-sm font-semibold text-slate-400 dark:text-slate-500">
            {isResetMode || isUpdateMode ? (
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setIsUpdateMode(false);
                }}
                className="text-primary font-black hover:underline"
              >
                Volver al inicio de sesión
              </button>
            ) : (
              <>
                {isSignUp ? '¿Ya eres parte de nosotros?' : '¿Aún no tienes cuenta?'} {' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary font-black hover:underline"
                >
                  {isSignUp ? 'Inicia sesión' : 'Crear cuenta gratis'}
                </button>
              </>
            )}
          </p>

          {!isSignUp && !isUpdateMode && (
            <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100/50 dark:border-amber-900/20 text-center">
              <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                IurisAcademy es libre gracias a sus aportantes.
                <button onClick={() => navigate('/pricing')} className="ml-2 underline font-bold">Ver cómo apoyar</button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
