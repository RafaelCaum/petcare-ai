import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Navigation, AlertTriangle, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { MIAMI_VETERINARIANS, LocalVetClinic } from '../data/localVeterinarians';
import { calculateDistance, isClinicOpen } from '../utils/distanceCalculator';

interface VetClinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: number;
  rating: number;
  isOpen: boolean;
  isEmergency?: boolean;
  hours?: string;
}

interface EmergencyVetFinderProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyVetFinder: React.FC<EmergencyVetFinderProps> = ({ isOpen, onClose }) => {
  const [clinics, setClinics] = useState<VetClinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      getCurrentLocationAndSearch();
    }
  }, [isOpen]);

  const getCurrentLocationAndSearch = async () => {
    setLoading(true);
    setLocationError(null);
    setClinics([]);

    try {
      console.log('Getting user location...');
      // Get user's current location
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      console.log('User location:', latitude, longitude);
      setUserLocation({ lat: latitude, lng: longitude });
      
      // Search local veterinarians
      searchLocalVets(latitude, longitude);
      
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Unable to get your location. Showing Miami area veterinarians.');
      
      // Fallback to Miami/Brickell area if location fails
      const fallbackLat = 25.7617;
      const fallbackLng = -80.1918;
      setUserLocation({ lat: fallbackLat, lng: fallbackLng });
      searchLocalVets(fallbackLat, fallbackLng);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const searchLocalVets = (lat: number, lng: number) => {
    try {
      console.log('Searching local veterinarians near:', lat, lng);
      
      // Calculate distances and prepare clinic data
      const processedClinics: VetClinic[] = MIAMI_VETERINARIANS.map((clinic: LocalVetClinic) => {
        const distance = calculateDistance(lat, lng, clinic.latitude, clinic.longitude);
        const isCurrentlyOpen = isClinicOpen(clinic);
        
        // Get today's hours
        const dayMapping: { [key: number]: string } = {
          0: 'sunday',
          1: 'monday', 
          2: 'tuesday',
          3: 'wednesday',
          4: 'thursday',
          5: 'friday',
          6: 'saturday'
        };
        const todayKey = dayMapping[new Date().getDay()];
        const todayHours = clinic.openingHours[todayKey] || 'Closed';
        
        return {
          id: clinic.id,
          name: clinic.name,
          address: clinic.address,
          phone: clinic.phone,
          distance: distance,
          rating: clinic.rating,
          isOpen: isCurrentlyOpen,
          isEmergency: clinic.isEmergency,
          hours: todayHours
        };
      });

      // Sort by emergency first, then open clinics, then by distance
      const sortedClinics = processedClinics.sort((a, b) => {
        // Emergency clinics first
        if (a.isEmergency && !b.isEmergency) return -1;
        if (!a.isEmergency && b.isEmergency) return 1;
        
        // Open clinics before closed ones
        if (a.isOpen && !b.isOpen) return -1;
        if (!a.isOpen && b.isOpen) return 1;
        
        // Then sort by distance
        return a.distance - b.distance;
      });

      console.log('Found veterinarians:', sortedClinics);
      setClinics(sortedClinics);
      
      const emergencyClinics = sortedClinics.filter(c => c.isEmergency);
      toast.success(`Encontrados ${sortedClinics.length} veterinários (${emergencyClinics.length} de emergência 24h)`);
      
    } catch (error) {
      console.error('Error searching local vets:', error);
      toast.error('Erro ao buscar veterinários');
      setLocationError('Erro ao buscar veterinários. Tente novamente.');
    }
  };

  const handleCall = (phone: string) => {
    // Remove any formatting and call
    const cleanPhone = phone.replace(/\D/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleDirections = (address: string) => {
    // Open Google Maps with directions
    const encodedAddress = encodeURIComponent(address);
    if (userLocation) {
      window.open(
        `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${encodedAddress}`,
        '_blank'
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/${encodedAddress}`,
        '_blank'
      );
    }
  };

  const handleEmergencyCall = () => {
    // US emergency number
    window.location.href = 'tel:911';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-500 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={24} />
              <h2 className="text-lg font-semibold">SOS Veterinário</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-xl"
            >
              ×
            </button>
          </div>
          <p className="text-sm mt-1 opacity-90">
            Encontre veterinários de emergência perto de você
          </p>
        </div>

        {/* Emergency Call Button */}
        <div className="p-4 bg-red-50 border-b">
          <button
            onClick={handleEmergencyCall}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
          >
            <Phone size={20} />
            Emergência: Ligar 911
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin mr-2" size={24} />
              <span>Buscando veterinários próximos...</span>
            </div>
          ) : locationError ? (
            <div className="text-center py-4">
              <AlertTriangle className="mx-auto mb-2 text-yellow-500" size={32} />
              <p className="text-gray-600 mb-4 text-sm">{locationError}</p>
              <button
                onClick={getCurrentLocationAndSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Tentar Novamente
              </button>
            </div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="mx-auto mb-2 text-gray-400" size={48} />
              <p className="text-gray-600">Nenhum veterinário encontrado</p>
              <button
                onClick={getCurrentLocationAndSearch}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Buscar Novamente
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 mb-3">
                Veterinários Próximos ({clinics.length})
              </h3>
              
              {clinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className={`border rounded-lg p-4 ${
                    clinic.isEmergency
                      ? 'border-red-200 bg-red-50'
                      : clinic.isOpen 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{clinic.name}</h4>
                        {clinic.isEmergency && (
                          <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                            24H
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{clinic.address}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-500">
                          {clinic.distance} mi
                          {clinic.rating > 0 && ` • ⭐ ${clinic.rating}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                            clinic.isOpen
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <Clock size={12} />
                          {clinic.isOpen ? 'Aberto' : 'Fechado'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {clinic.hours}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleCall(clinic.phone)}
                      className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <Phone size={16} />
                      Ligar
                    </button>
                    <button
                      onClick={() => handleDirections(clinic.address)}
                      className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <Navigation size={16} />
                      Direções
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t">
          <p className="text-xs text-gray-500 text-center">
            Para emergências graves, procure atendimento veterinário imediato ou ligue 911
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyVetFinder;
