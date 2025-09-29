import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Scissors, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProviderLoginProps {
  onSuccess: () => void;
}

export default function ProviderLogin({ onSuccess }: ProviderLoginProps) {
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigo.trim()) {
      setErro('Digite o código de acesso');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      // Validar código usando a função do banco
      const { data, error } = await supabase.rpc('validate_access_code', {
        access_code: codigo.trim()
      });

      if (error) {
        console.error('Erro na validação:', error);
        setErro('Erro ao validar código. Tente novamente.');
        return;
      }

      if (!data) {
        setErro('Código de acesso inválido');
        return;
      }

      // Salvar código na sessão local também
      sessionStorage.setItem('provider_access_code', codigo.trim());
      
      // Sucesso - liberar acesso
      onSuccess();
      
    } catch (error) {
      console.error('Erro no login:', error);
      setErro('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Painel do Prestador</h1>
          <p className="text-gray-600">Digite o código de acesso para continuar</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-2">
              Código de Acesso
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Digite o código"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {erro && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{erro}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !codigo.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Validando...</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>Entrar no Painel</span>
              </>
            )}
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Para teste:</strong> Use o código <code className="bg-blue-100 px-2 py-1 rounded">BARBEIRO123</code>
          </p>
        </div>
      </div>
    </div>
  );
}