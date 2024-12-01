import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useBrandingStore } from '../stores/brandingStore';
import { authenticateUser } from '../services/auth';
import { KeyRound, AlertCircle, Lock, Mail } from 'lucide-react';
import RegisterForm from '../components/auth/RegisterForm';
import RecoveryForm from '../components/auth/RecoveryForm';
import type { LoginCredentials } from '../types/auth';

const Login = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await authenticateUser(credentials);
      
      if (user) {
        login(user);
        navigate('/dashboard');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al intentar acceder. Por favor, inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSuccess = () => {
    setShowRegister(false);
    setError('');
  };

  const handleRecoverySuccess = () => {
    setShowRecovery(false);
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="https://i.postimg.cc/YGjF7w3Z/logo-ateca.png"
              alt="Logo"
              className="h-24 w-auto mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              Red de Innovación FP
            </h1>
            <p className="text-gray-500 mt-2">
              Accede a tu cuenta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Accediendo...' : 'Acceder'}
            </button>
          </form>

          <div className="mt-6 flex flex-col space-y-2">
            <button
              onClick={() => setShowRegister(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              ¿No tienes cuenta? Regístrate con tu código
            </button>
            <button
              onClick={() => setShowRecovery(true)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Credenciales de administrador para pruebas:
              <br />
              Email: admin@redinnovacionfp.es
              <br />
              Contraseña: admin123
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070")'
      }}>
        <div className="h-full w-full bg-blue-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-12">
          <div className="text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Red de Innovación FP</h2>
            <p className="text-lg">
              Plataforma de gestión y colaboración para centros de formación profesional
            </p>
          </div>
        </div>
      </div>

      {showRegister && (
        <RegisterForm
          onClose={() => setShowRegister(false)}
          onSuccess={handleRegistrationSuccess}
        />
      )}

      {showRecovery && (
        <RecoveryForm
          onClose={() => setShowRecovery(false)}
          onSuccess={handleRecoverySuccess}
        />
      )}
    </div>
  );
};

export default Login;