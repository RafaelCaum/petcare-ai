
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import OTPExpiryHandler from './OTPExpiryHandler';

interface EmailLoginProps {
  onSuccess: () => void;
}

const EmailLogin: React.FC<EmailLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup' | 'otp'>('signin');
  const [otpSentTime, setOtpSentTime] = useState<Date | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Email não confirmado. Verifique sua caixa de entrada.');
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos');
        } else {
          toast.error('Erro ao fazer login: ' + error.message);
        }
        return;
      }

      if (data.user && data.session) {
        toast.success('Login realizado com sucesso!');
        onSuccess();
      }
    } catch (error) {
      toast.error('Erro inesperado durante o login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Este email já está cadastrado. Tente fazer login.');
          setMode('signin');
        } else {
          toast.error('Erro ao criar conta: ' + error.message);
        }
        return;
      }

      if (data.user && !data.session) {
        setOtpSentTime(new Date());
        setMode('otp');
        toast.success('Código de confirmação enviado para seu email!');
      } else if (data.user && data.session) {
        toast.success('Conta criada com sucesso!');
        onSuccess();
      }
    } catch (error) {
      toast.error('Erro inesperado durante o cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Por favor, digite o código de 6 dígitos');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });

      if (error) {
        if (error.message.includes('expired')) {
          toast.error('Código expirado. Solicite um novo código.');
        } else if (error.message.includes('invalid')) {
          toast.error('Código inválido. Verifique e tente novamente.');
        } else {
          toast.error('Erro na verificação: ' + error.message);
        }
        return;
      }

      if (data.user && data.session) {
        toast.success('Email confirmado! Bem-vindo!');
        onSuccess();
      }
    } catch (error) {
      toast.error('Erro inesperado na verificação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      throw new Error(error.message);
    }

    setOtpSentTime(new Date());
  };

  if (mode === 'otp') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Confirme seu email
          </h2>
          <p className="text-gray-600">
            Enviamos um código de 6 dígitos para
          </p>
          <p className="text-primary font-medium">{email}</p>
        </div>

        <form onSubmit={handleOTPVerification} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Código de confirmação
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-primary focus:border-transparent"
              maxLength={6}
              required
            />
          </div>

          <OTPExpiryHandler
            onResendOTP={handleResendOTP}
            otpSentTime={otpSentTime}
            expiryMinutes={30}
          />

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verificando...' : 'Confirmar código'}
          </button>

          <button
            type="button"
            onClick={() => setMode('signup')}
            className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'signin' ? 'Entrar na conta' : 'Criar conta'}
        </h2>
        <p className="text-gray-600">
          {mode === 'signin' 
            ? 'Faça login para acessar seus pets' 
            : 'Crie sua conta para começar'
          }
        </p>
      </div>

      <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              minLength={mode === 'signup' ? 6 : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {mode === 'signup' && (
            <p className="text-xs text-gray-500 mt-1">
              Mínimo de 6 caracteres
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading 
            ? (mode === 'signin' ? 'Entrando...' : 'Criando conta...') 
            : (mode === 'signin' ? 'Entrar' : 'Criar conta')
          }
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-primary hover:text-primary-dark transition-colors"
        >
          {mode === 'signin' 
            ? 'Não tem conta? Criar conta' 
            : 'Já tem conta? Fazer login'
          }
        </button>
      </div>
    </div>
  );
};

export default EmailLogin;
