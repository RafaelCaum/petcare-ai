
import React from 'react';
import { User as UserType } from '../../types/pet';
import { Star, Heart, Bell, Camera, Calendar, Shield } from 'lucide-react';

interface PremiumFeaturesProps {
  user: UserType | null;
}

const PremiumFeatures: React.FC<PremiumFeaturesProps> = ({ user }) => {
  const features = [
    {
      icon: <Heart className="text-red-500" size={20} />,
      title: 'Múltiplos Pets',
      description: 'Gerencie quantos pets você quiser',
      available: user?.subscriptionStatus === 'active'
    },
    {
      icon: <Bell className="text-blue-500" size={20} />,
      title: 'Lembretes Avançados',
      description: 'Notificações por email e SMS',
      available: user?.subscriptionStatus === 'active'
    },
    {
      icon: <Camera className="text-green-500" size={20} />,
      title: 'Fotos Ilimitadas',
      description: 'Armazenamento ilimitado de fotos',
      available: user?.subscriptionStatus === 'active'
    },
    {
      icon: <Calendar className="text-purple-500" size={20} />,
      title: 'Agenda Veterinária',
      description: 'Sincronização com calendário',
      available: user?.subscriptionStatus === 'active'
    },
    {
      icon: <Shield className="text-orange-500" size={20} />,
      title: 'Backup na Nuvem',
      description: 'Seus dados sempre seguros',
      available: user?.subscriptionStatus === 'active'
    },
    {
      icon: <Star className="text-yellow-500" size={20} />,
      title: 'Suporte Prioritário',
      description: 'Atendimento especializado 24/7',
      available: user?.subscriptionStatus === 'active'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Recursos Premium</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all ${
              feature.available
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {feature.available ? feature.icon : <div className="w-5 h-5 bg-gray-400 rounded opacity-50" />}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${feature.available ? 'text-gray-800' : 'text-gray-500'}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${feature.available ? 'text-gray-600' : 'text-gray-400'}`}>
                  {feature.description}
                </p>
              </div>
              {feature.available && (
                <div className="flex-shrink-0">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Ativo
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumFeatures;
