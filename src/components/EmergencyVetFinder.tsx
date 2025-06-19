
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Navigation, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface VetClinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: number;
  rating: number;
  isOpen: boolean;
  placeId?: string;
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

    try {
      // Get user's current location
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      setUserLocation({ lat: latitude, lng: longitude });
      
      // Search for nearby veterinarians
      await searchNearbyVets(latitude, longitude);
      
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Unable to get your location. Please check location permissions.');
      
      // Fallback to Miami location if location fails
      await searchNearbyVets(25.7617, -80.1918); // Miami coordinates
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

  const searchNearbyVets = async (lat: number, lng: number) => {
    try {
      // In a real implementation, you would use Google Places API or similar
      // For now, I'll create a mock implementation with Miami-area veterinarians
      
      // This would be your actual API call:
      // const response = await fetch(`/api/search-vets?lat=${lat}&lng=${lng}`);
      // const data = await response.json();
      
      // Mock data for Miami area demonstration (replace with real API)
      const mockClinics: VetClinic[] = [
        {
          id: '1',
          name: 'BluePearl Pet Hospital',
          address: '2600 S University Dr, Davie, FL 33328',
          phone: '(954) 473-4900',
          distance: 0.8,
          rating: 4.5,
          isOpen: true,
        },
        {
          id: '2',
          name: 'VCA Hollywood Animal Hospital',
          address: '920 N Federal Hwy, Hollywood, FL 33020',
          phone: '(954) 920-3556',
          distance: 1.2,
          rating: 4.3,
          isOpen: true,
        },
        {
          id: '3',
          name: 'Miami Emergency Veterinary Clinic',
          address: '14790 Biscayne Blvd, North Miami Beach, FL 33181',
          phone: '(305) 947-8387',
          distance: 2.1,
          rating: 4.7,
          isOpen: false,
        },
        {
          id: '4',
          name: 'Aventura Animal Hospital',
          address: '20803 Biscayne Blvd, Aventura, FL 33180',
          phone: '(305) 932-8389',
          distance: 3.2,
          rating: 4.6,
          isOpen: true,
        },
        {
          id: '5',
          name: 'Coral Gables Veterinary Hospital',
          address: '285 Aragon Ave, Coral Gables, FL 33134',
          phone: '(305) 446-4811',
          distance: 4.1,
          rating: 4.4,
          isOpen: true,
        },
      ];

      // Sort by distance
      const sortedClinics = mockClinics.sort((a, b) => a.distance - b.distance);
      setClinics(sortedClinics);
      
    } catch (error) {
      console.error('Error searching for vets:', error);
      toast.error('Error searching for nearby veterinarians');
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
              <h2 className="text-lg font-semibold">Emergency Vet SOS</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-xl"
            >
              ×
            </button>
          </div>
          <p className="text-sm mt-1 opacity-90">
            Find emergency veterinarians near you
          </p>
        </div>

        {/* Emergency Call Button */}
        <div className="p-4 bg-red-50 border-b">
          <button
            onClick={handleEmergencyCall}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
          >
            <Phone size={20} />
            Emergency: Call 911
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin mr-2" size={24} />
              <span>Finding nearby veterinarians...</span>
            </div>
          ) : locationError ? (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto mb-2 text-yellow-500" size={48} />
              <p className="text-gray-600 mb-4">{locationError}</p>
              <button
                onClick={getCurrentLocationAndSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : clinics.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="mx-auto mb-2 text-gray-400" size={48} />
              <p className="text-gray-600">No veterinarians found nearby</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 mb-3">
                Nearby Veterinarians ({clinics.length})
              </h3>
              
              {clinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className={`border rounded-lg p-4 ${
                    clinic.isOpen ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{clinic.name}</h4>
                      <p className="text-sm text-gray-600">{clinic.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {clinic.distance} mi • ⭐ {clinic.rating}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            clinic.isOpen
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {clinic.isOpen ? 'Open' : 'Closed'}
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
                      Call
                    </button>
                    <button
                      onClick={() => handleDirections(clinic.address)}
                      className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <Navigation size={16} />
                      Directions
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
            For severe emergencies, seek immediate veterinary care or call 911
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyVetFinder;
