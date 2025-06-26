
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
      toast.error('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login/signup with email:', email);
      
      // Check if user exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing user:', checkError);
        throw new Error('Error checking user');
      }

      if (existingUser) {
        // User exists, log them in
        console.log('Existing user found:', existingUser);
        onLogin(email, existingUser);
        toast.success('Welcome back!');
      } else {
        // New user, show registration form
        if (!isNewUser) {
          setIsNewUser(true);
          setIsLoading(false);
          return;
        }

        if (!name.trim()) {
          toast.error('Please enter your name');
          setIsLoading(false);
          return;
        }

        console.log('Creating new user...');
        
        // Create new user with explicit field mapping
        const newUserData = {
          email: email.toLowerCase().trim(),
          name: name.trim(),
          phone: phone.trim() || null,
          subscription_status: 'trial',
          trial_start_date: new Date().toISOString(),
          trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        };

        console.log('New user data:', newUserData);

        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert(newUserData)
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          
          if (createError.code === '23505') {
            toast.error('This email is already registered');
          } else {
            toast.error(`Error creating account: ${createError.message}`);
          }
          setIsLoading(false);
          return;
        }

        console.log('User created successfully:', newUser);
        onLogin(email, newUser);
        toast.success('Account created! Welcome to PetCare AI!');
      }
    } catch (error) {
      console.error('Error in login/signup:', error);
      toast.error('Error accessing your account. Please try again.');
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
            {isNewUser ? 'Create your account' : 'Enter your email to continue'}
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
                  Full Name *
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
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
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
              onClick={() => {
                setIsNewUser(false);
                setName('');
                setPhone('');
              }}
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
              <strong>7 days free</strong> then $9.99/month. No credit card required to start.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailLogin;
