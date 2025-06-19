
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
    if (!email) return;

    setIsLoading(true);

    try {
      // Check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existingUser) {
        // User exists, log them in
        onLogin(email, existingUser);
        toast.success('Welcome back!');
      } else {
        // New user, show registration form
        if (!isNewUser) {
          setIsNewUser(true);
          setIsLoading(false);
          return;
        }

        if (!name) {
          toast.error('Please enter your name');
          setIsLoading(false);
          return;
        }

        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            email,
            name,
            phone: phone || null,
            subscription_status: 'trial',
            trial_start_date: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        onLogin(email, newUser);
        toast.success('Account created! Welcome to PetCare AI!');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error accessing your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🐾</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">PetCare AI</h1>
          <p className="text-gray-600">
            {isNewUser ? 'Create your account' : 'Enter your email to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {isNewUser && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your full name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your phone number"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              <ArrowRight className="mr-2" size={20} />
            )}
            {isLoading ? 'Processing...' : isNewUser ? 'Create Account' : 'Continue'}
          </button>

          {isNewUser && (
            <button
              type="button"
              onClick={() => setIsNewUser(false)}
              className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors"
              disabled={isLoading}
            >
              Already have an account? Sign in
            </button>
          )}
        </form>

        {!isNewUser && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>7-day free trial</strong> then $49/month. No credit card required to start.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailLogin;
