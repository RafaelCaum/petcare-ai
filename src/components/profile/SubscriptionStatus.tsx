
import React from 'react';
import { User as UserType } from '../../types/pet';
import { Crown, Calendar } from 'lucide-react';

interface SubscriptionStatusProps {
  user: UserType | null;
  onManageSubscription: () => void;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ user, onManageSubscription }) => {
  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'trial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'trial':
        return 'Período de Teste';
      case 'expired':
        return 'Expirado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Crown className="text-yellow-500" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Status da Assinatura</h2>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(user.subscriptionStatus)}`}>
          {getStatusText(user.subscriptionStatus)}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-gray-600">
          <Calendar size={16} className="mr-3" />
          <span>Início do período: {new Date(user.trialStartDate).toLocaleDateString('pt-BR')}</span>
        </div>
        
        {user.subscriptionEndDate && (
          <div className="flex items-center text-gray-600">
            <Calendar size={16} className="mr-3" />
            <span>Fim do período: {new Date(user.subscriptionEndDate).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </div>

      <button
        onClick={onManageSubscription}
        className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Gerenciar Assinatura
      </button>
    </div>
  );
};

export default SubscriptionStatus;
