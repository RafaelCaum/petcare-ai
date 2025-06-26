
import React from 'react';
import { Crown } from 'lucide-react';

const TrialExpiredModal: React.FC = () => {
  const handleUpgrade = () => {
    window.open('https://buy.stripe.com/aFa8wR50A5xH5eicsT67S0j', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo do PetCare AI */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Crown className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">PetCare AI</h1>
          </div>
        </div>

        {/* Título Principal */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">
            🎉 PetCare AI Premium
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Seu período de teste terminou. Continue cuidando do seu pet com acesso total às funcionalidades do PetCare AI.
          </p>
        </div>

        {/* Preço */}
        <div className="space-y-2">
          <div className="text-4xl font-bold text-gray-800">
            💰 $9.99/month
          </div>
          <p className="text-sm text-gray-500">
            Secure payment via Stripe
          </p>
          <p className="text-sm text-green-600 font-medium">
            🔒 Pagamento 100% seguro com Stripe
          </p>
        </div>

        {/* Botão de Upgrade */}
        <div className="pt-4">
          <button
            onClick={handleUpgrade}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            style={{ backgroundColor: '#6C63FF' }}
          >
            👉 Upgrade Now 👈
          </button>
        </div>

        {/* Benefícios */}
        <div className="pt-6 space-y-3">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <span className="text-green-500">✅</span>
            <span>Pets ilimitados</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <span className="text-green-500">✅</span>
            <span>Controle completo de vacinas</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <span className="text-green-500">✅</span>
            <span>Lembretes e notificações</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <span className="text-green-500">✅</span>
            <span>Controle de gastos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialExpiredModal;
