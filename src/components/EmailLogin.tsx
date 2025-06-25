
import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmailLoginProps {
  onLogin: (email: string, userData: any) => void;
}

const EmailLogin: React.FC<EmailLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Tentando fazer login/cadastro com email:', email);
      
      // Check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (checkError) {
        console.error('Erro ao verificar usuário existente:', checkError);
        throw new Error('Erro ao verificar usuário');
      }

      if (existingUser) {
        // User exists, log them in
        console.log('Usuário existente encontrado:', existingUser);
        onLogin(email, existingUser);
        toast.success('Bem-vindo de volta!');
      } else {
        // New user, show registration form
        if (!isNewUser) {
          setIsNewUser(true);
          setIsLoading(false);
          return;
        }

        if (!name.trim()) {
          toast.error('Por favor, insira seu nome');
          setIsLoading(false);
          return;
        }

        console.log('Criando novo usuário...');
        
        // Create new user with explicit field mapping
        const newUserData = {
          email: email.toLowerCase().trim(),
          name: name.trim(),
          phone: phone.trim() || null,
          subscription_status: 'trial',
          trial_start_date: new Date().toISOString(),
        };

        console.log('Dados do novo usuário:', newUserData);

        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert(newUserData)
          .select()
          .single();

        if (createError) {
          console.error('Erro ao criar usuário:', createError);
          
          if (createError.code === '23505') {
            toast.error('Este email já está cadastrado');
          } else {
            toast.error(`Erro ao criar conta: ${createError.message}`);
          }
          setIsLoading(false);
          return;
        }

        console.log('Usuário criado com sucesso:', newUser);
        onLogin(email, newUser);
        toast.success('Conta criada! Bem-vindo ao PetCare AI!');
      }
    } catch (error) {
      console.error('Erro no login/cadastro:', error);
      toast.error('Erro ao acessar sua conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/37225868-33f4-46a9-a18a-13e3f2174f41.png" 
              alt="PetCare AI - Two cute dogs"
              className="w-32 h-32 mx-auto rounded-2xl shadow-gentle object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">PetCare AI</h1>
          <p className="text-gray-600">
            {isNewUser ? 'Crie sua conta' : 'Digite seu email para continuar'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {isNewUser && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Seu nome completo"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone (Opcional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Seu telefone"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              <ArrowRight className="mr-2" size={20} />
            )}
            {isLoading ? 'Processando...' : isNewUser ? 'Criar Conta' : 'Continuar'}
          </button>

          {isNewUser && (
            <button
              type="button"
              onClick={() => {
                setIsNewUser(false);
                setName('');
                setPhone('');
              }}
              className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
              disabled={isLoading}
            >
              Já tem conta? Fazer login
            </button>
          )}
        </form>

        {!isNewUser && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>7 dias grátis</strong> depois R$ 49/mês. Não precisa de cartão para começar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailLogin;
