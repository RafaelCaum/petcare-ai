
import React from 'react';
import { MessageCircle, Mail, Phone, FileText } from 'lucide-react';

const SupportSection: React.FC = () => {
  const supportOptions = [
    {
      icon: <MessageCircle className="text-blue-500" size={20} />,
      title: 'Chat ao Vivo',
      description: 'Converse conosco em tempo real',
      action: () => console.log('Live chat')
    },
    {
      icon: <Mail className="text-green-500" size={20} />,
      title: 'Email',
      description: 'suporte@petcare.com',
      action: () => window.open('mailto:suporte@petcare.com')
    },
    {
      icon: <Phone className="text-purple-500" size={20} />,
      title: 'Telefone',
      description: '(11) 9999-9999',
      action: () => window.open('tel:+5511999999999')
    },
    {
      icon: <FileText className="text-orange-500" size={20} />,
      title: 'FAQ',
      description: 'Perguntas frequentes',
      action: () => console.log('FAQ clicked')
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Suporte</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {supportOptions.map((option, index) => (
          <button
            key={index}
            onClick={option.action}
            className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {option.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm">{option.title}</h3>
                <p className="text-xs text-gray-600">{option.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          PetCare AI v1.0 • Feito com ❤️ para seu pet
        </p>
      </div>
    </div>
  );
};

export default SupportSection;
