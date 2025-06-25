
import React from 'react';
import { User, Settings, CreditCard, HelpCircle } from 'lucide-react';

interface AccountSettingsProps {
  onEditProfile: () => void;
  onManageSubscription: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onEditProfile, onManageSubscription }) => {
  const settingsOptions = [
    {
      icon: <User className="text-blue-500" size={20} />,
      title: 'Editar Perfil',
      description: 'Atualize suas informações pessoais',
      action: onEditProfile
    },
    {
      icon: <CreditCard className="text-green-500" size={20} />,
      title: 'Gerenciar Assinatura',
      description: 'Planos, pagamento e faturamento',
      action: onManageSubscription
    },
    {
      icon: <Settings className="text-gray-500" size={20} />,
      title: 'Configurações',
      description: 'Notificações e preferências',
      action: () => console.log('Settings clicked')
    },
    {
      icon: <HelpCircle className="text-purple-500" size={20} />,
      title: 'Ajuda e Suporte',
      description: 'Central de ajuda e contato',
      action: () => console.log('Help clicked')
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Configurações da Conta</h2>
      
      <div className="space-y-1">
        {settingsOptions.map((option, index) => (
          <button
            key={index}
            onClick={option.action}
            className="w-full p-4 rounded-lg border border-transparent hover:bg-gray-50 hover:border-gray-200 transition-all text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {option.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountSettings;
