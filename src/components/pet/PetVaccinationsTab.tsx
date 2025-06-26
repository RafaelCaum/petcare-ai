
import React from 'react';
import { Vaccination } from '../../types/pet';
import { Plus, Syringe, Calendar, Clock, Users, Trash2 } from 'lucide-react';

interface PetVaccinationsTabProps {
  vaccinations: Vaccination[];
  onAddVaccination: () => void;
  onDeleteVaccination: (id: string) => Promise<void>;
}

const PetVaccinationsTab: React.FC<PetVaccinationsTabProps> = ({
  vaccinations,
  onAddVaccination,
  onDeleteVaccination
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleDeleteVaccination = async (vaccinationId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta vacinação?')) {
      await onDeleteVaccination(vaccinationId);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Syringe className="mr-2 text-primary" size={20} />
            Vacinações
          </h3>
          <button
            onClick={onAddVaccination}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus size={16} />
            Adicionar
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {vaccinations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">💉</div>
            <p className="text-gray-500 mb-4">Nenhuma vacinação registrada</p>
            <button
              onClick={onAddVaccination}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Adicionar Primeira Vacinação
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {vaccinations.map((vaccination) => (
              <div key={vaccination.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <Syringe size={16} className="mr-2 text-blue-500" />
                    {vaccination.vaccineName}
                  </h4>
                  <button
                    onClick={() => handleDeleteVaccination(vaccination.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 text-green-500" />
                    <span>Aplicada: {formatDate(vaccination.dateGiven)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock size={14} className="mr-2 text-orange-500" />
                    <span>Próxima: {formatDate(vaccination.nextDueDate)}</span>
                  </div>
                  
                  {vaccination.veterinarian && (
                    <div className="flex items-center">
                      <Users size={14} className="mr-2 text-purple-500" />
                      <span>Dr(a). {vaccination.veterinarian}</span>
                    </div>
                  )}
                  
                  {vaccination.notes && (
                    <div className="col-span-full">
                      <p className="text-gray-600 bg-gray-50 p-2 rounded text-sm shadow-sm">
                        <strong>Observações:</strong> {vaccination.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetVaccinationsTab;
