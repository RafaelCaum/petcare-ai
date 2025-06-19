
import React, { useState } from 'react';
import { MapPin, Phone, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface VetClinic {
  name: string;
  address: string;
  phone?: string;
  distance: number;
  isOpen?: boolean;
  rating?: number;
}

const EmergencyVetFinder: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [vetClinics, setVetClinics] = useState<VetClinic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não é suportada neste navegador'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              reject(new Error('Permissão de localização negada'));
              break;
            case error.POSITION_UNAVAILABLE:
              reject(new Error('Localização não disponível'));
              break;
            case error.TIMEOUT:
              reject(new Error('Tempo esgotado para obter localização'));
              break;
            default:
              reject(new Error('Erro desconhecido ao obter localização'));
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  const searchNearbyVets = async (lat: number, lng: number) => {
    // Simulando busca de veterinários próximos
    // Em produção, você usaria uma API real como Google Places API
    const mockVets: VetClinic[] = [
      {
        name: 'Hospital Veterinário 24h Pet Emergency',
        address: 'Rua das Flores, 123 - Centro',
        phone: '(11) 3456-7890',
        distance: 0.8,
        isOpen: true,
        rating: 4.8,
      },
      {
        name: 'Clínica Veterinária ProntoPet',
        address: 'Av. Principal, 456 - Jardim São Paulo',
        phone: '(11) 9876-5432',
        distance: 1.2,
        isOpen: true,
        rating: 4.5,
      },
      {
        name: 'Centro Veterinário Animal Care',
        address: 'Rua da Saúde, 789 - Vila Nova',
        phone: '(11) 2345-6789',
        distance: 2.1,
        isOpen: false,
        rating: 4.3,
      },
      {
        name: 'Hospital Veterinário São Francisco',
        address: 'Av. dos Animais, 321 - Bairro Alto',
        phone: '(11) 8765-4321',
        distance: 2.8,
        isOpen: true,
        rating: 4.6,
      },
    ];

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return mockVets.sort((a, b) => a.distance - b.distance);
  };

  const findEmergencyVets = async () => {
    setLoading(true);
    setError(null);
    setVetClinics([]);

    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      const vets = await searchNearbyVets(location.lat, location.lng);
      setVetClinics(vets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar veterinários');
    } finally {
      setLoading(false);
    }
  };

  const makePhoneCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const openDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    if (userLocation) {
      window.open(
        `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${encodedAddress}`,
        '_blank'
      );
    } else {
      window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {!vetClinics.length && !loading ? (
        <div className="text-center py-6">
          <AlertCircle className="mx-auto mb-3 text-red-500" size={48} />
          <h3 className="font-semibold text-red-800 mb-2">Emergência Veterinária</h3>
          <p className="text-red-700 text-sm mb-4">
            Encontre veterinários de emergência próximos à sua localização
          </p>
          <Button 
            onClick={findEmergencyVets}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3"
            disabled={loading}
          >
            <MapPin className="mr-2" size={16} />
            Encontrar Veterinários Próximos
          </Button>
        </div>
      ) : null}

      {loading && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-3"></div>
          <p className="text-gray-600">Buscando veterinários próximos...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <Button 
            onClick={findEmergencyVets}
            className="mt-3 bg-red-500 hover:bg-red-600 text-white"
            size="sm"
          >
            Tentar Novamente
          </Button>
        </div>
      )}

      {vetClinics.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-red-800">Veterinários Próximos</h4>
            <Button 
              onClick={findEmergencyVets}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              Atualizar
            </Button>
          </div>
          
          {vetClinics.map((vet, index) => (
            <div 
              key={index} 
              className={`border rounded-xl p-4 ${vet.isOpen ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{vet.name}</h5>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin size={14} className="mr-1" />
                    {vet.address}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {vet.distance.toFixed(1)} km
                  </span>
                  {vet.isOpen !== undefined && (
                    <div className={`text-xs mt-1 flex items-center ${vet.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                      <Clock size={12} className="mr-1" />
                      {vet.isOpen ? 'Aberto' : 'Fechado'}
                    </div>
                  )}
                </div>
              </div>
              
              {vet.rating && (
                <div className="text-sm text-gray-600 mb-3">
                  ⭐ {vet.rating}/5.0
                </div>
              )}
              
              <div className="flex space-x-2">
                {vet.phone && (
                  <Button
                    onClick={() => makePhoneCall(vet.phone!)}
                    size="sm"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Phone size={14} className="mr-1" />
                    Ligar
                  </Button>
                )}
                <Button
                  onClick={() => openDirections(vet.address)}
                  size="sm"
                  variant="outline"
                  className="flex-1"
                >
                  <MapPin size={14} className="mr-1" />
                  Direções
                </Button>
              </div>
            </div>
          ))}
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <p className="text-yellow-800 text-xs">
              ⚠️ Em caso de emergência grave, ligue imediatamente para o veterinário mais próximo ou para o serviço de emergência veterinária 24h da sua região.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyVetFinder;
