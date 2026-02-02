
import React, { useState } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onAuthSuccess?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // If Supabase returns a user but no session, it likely needs confirmation
        if (data.user && !data.session) {
          setSuccessMsg('¡Registro exitoso! Por favor, revisa tu correo para confirmar tu cuenta.');
          setLoading(false);
        }
        // If there's a session, the listener in App.tsx will take over
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setLoading(false);
        if (onAuthSuccess) onAuthSuccess();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.status === 429) {
        setError('Demasiados intentos. Por favor, intenta de nuevo en unos minutos.');
      } else {
        setError(err.message || 'Error en la autenticación');
      }
      setLoading(false);
    } finally {
      // If we are logging in, or if there was an error, we must stop loading
      // For signups that need confirmation, we stop loading inside the try block
    }
  };


  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex items-center justify-center overflow-hidden bg-primary p-20">
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("https://picsum.photos/seed/legalauth/1200/1200")' }}></div>
        <div className="relative z-10 max-w-lg">
          <h1 className="text-white text-6xl font-black leading-tight mb-8">Tu camino a la excelencia jurídica comienza aquí</h1>
          <p className="text-white/80 text-lg font-medium leading-relaxed border-l-4 border-accent-gold pl-6">
            La plataforma definitiva diseñada para transformar el futuro de los abogados. Explora casos, compite y domina la ley.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-md space-y-10">
          <div className="space-y-2">
            <h2 className="text-slate-900 text-4xl font-black tracking-tight">
              {isSignUp ? 'Crear cuenta' : 'Iniciar Sesión'}
            </h2>
            <p className="text-slate-400 font-medium">
              {isSignUp ? 'Regístrate para comenzar tu viaje.' : 'Ingresa tus credenciales para acceder a tu panel.'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleAuth}>
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-5 bg-green-50 text-green-700 rounded-2xl text-sm font-bold border border-green-100 animate-in zoom-in duration-300">
                <div className="flex items-center gap-3 mb-1">
                  <span className="material-symbols-outlined">mark_email_read</span>
                  <p>{successMsg}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 uppercase tracking-widest">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 bg-gray-50 border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all p-4"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-slate-900 uppercase tracking-widest">Contraseña</label>
                {!isSignUp && <a href="#" className="text-xs font-bold text-primary hover:underline">¿Olvidaste tu contraseña?</a>}
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-gray-50 border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all p-4 pr-12"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 bg-primary text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Cargando...' : isSignUp ? 'Registrarse' : 'Ingresar al Dashboard'}
            </button>
          </form>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-800 font-medium">
              <strong>Admin:</strong> Usa <code>carlos.sith@gmail.com</code> con clave <code>123456</code>.
            </p>
          </div>

          <p className="text-center text-sm font-medium text-gray-500">
            {isSignUp ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'} {' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-bold hover:underline"
            >
              {isSignUp ? 'Inicia sesión' : 'Crear cuenta gratis'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
