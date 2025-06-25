
import React from 'react';
import { User, CreditCard, Calendar, Settings } from 'lucide-react';

interface AccountSettingsProps {
  onEditProfile: () => void;
  onManageSubscription: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onEditProfile, onManageSubscription }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="font-semibold mb-6 flex items-center text-gray-900">
        <Settings className="mr-2 text-gray-600" size={20} />
        Configurações da Conta
      </h2>
      
      <div className="space-y-4">
        <button
          onClick={onEditProfile}
          className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group border border-gray-200"
        >
          <div className="flex items-center flex-1 min-w-0 pr-4">
            <User size={18} className="mr-3 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-gray-700 font-medium block truncate">
                Editar Perfil
              </span>
              <span className="text-gray-500 text-sm block">
                Alterar nome, telefone e foto
              </span>
            </div>
          </div>
          <div className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0">
            ›
          </div>
        </button>
        
        <button 
          onClick={onManageSubscription}
          className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group border border-gray-200"
        >
          <div className="flex items-center flex-1 min-w-0 pr-4">
            <CreditCard size={18} className="mr-3 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-gray-700 font-medium block truncate">
                Gerenciar Assinatura
              </span>
              <span className="text-gray-500 text-sm block">
                Planos e pagamentos
              </span>
            </div>
          </div>
          <div className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0">
            ›
          </div>
        </button>
        
        <button className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between group border border-gray-200">
          <div className="flex items-center flex-1 min-w-0 pr-4">
            <Calendar size={18} className="mr-3 text-gray-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-gray-700 font-medium block truncate">
                Notificações
              </span>
              <span className="text-gray-500 text-sm block">
                Lembretes e alertas
              </span>
            </div>
          </div>
          <div className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0">
            ›
          </div>
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
