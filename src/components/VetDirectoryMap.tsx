
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface Clinic {
  id: string;
  name: string;
  address: string;
  distance: number;
  phone?: string;
  rating?: number;
  hours?: string;
  lat: number;
  lon: number;
}

const VetDirectoryMap = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [selectedDistance, setSelectedDistance] = useState('5000'); // 5km default

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to a default location (São Paulo, Brazil)
          setUserLocation({ lat: -23.5505, lon: -46.6333 });
        }
      );
    } else {
      // Fallback to a default location
      setUserLocation({ lat: -23.5505, lon: -46.6333 });
    }
  };

  const fetchVeterinaryClinics = async (lat: number, lon: number, radius: string) => {
    setLoading(true);
    try {
      const apiKey = 'your-geoapify-api-key'; // You'll need to set this
      const url = `https://api.geoapify.com/v2/places?categories=healthcare.veterinary&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=20&apiKey=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features) {
        const clinicsData = data.features.map((feature: any, index: number) => ({
          id: feature.properties.place_id || `clinic-${index}`,
          name: feature.properties.name || 'Veterinary Clinic',
          address: feature.properties.formatted || feature.properties.address_line1 || 'Address not available',
          distance: Math.round(feature.properties.distance || 0),
          phone: feature.properties.contact?.phone,
          rating: feature.properties.rating,
          hours: feature.properties.opening_hours,
          lat: feature.geometry.coordinates[1],
          lon: feature.geometry.coordinates[0]
        }));
        
        setClinics(clinicsData);
      }
    } catch (error) {
      console.error('Error fetching veterinary clinics:', error);
      // Fallback data for demonstration
      setClinics([
        {
          id: '1',
          name: 'Central Veterinary Clinic',
          address: 'Rua das Flores, 123 - Centro',
          distance: 800,
          phone: '(11) 1234-5678',
          rating: 4.5,
          hours: 'Mon-Fri: 8AM-6PM',
          lat: -23.5505,
          lon: -46.6333
        },
        {
          id: '2',
          name: 'Pet Care Hospital',
          address: 'Av. Paulista, 456 - Bela Vista',
          distance: 1200,
          phone: '(11) 9876-5432',
          rating: 4.8,
          hours: '24/7 Emergency',
          lat: -23.5616,
          lon: -46.6565
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchVeterinaryClinics(userLocation.lat, userLocation.lon, selectedDistance);
    }
  }, [userLocation, selectedDistance]);

  const handleDistanceChange = (value: string) => {
    setSelectedDistance(value);
  };

  const getDistanceLabel = (meters: number) => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <div className="space-y-4">
      {/* Distance Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Nearby Veterinary Clinics</h3>
        <Select value={selectedDistance} onValueChange={handleDistanceChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1000">1km</SelectItem>
            <SelectItem value="5000">5km</SelectItem>
            <SelectItem value="10000">10km</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Map Placeholder */}
      <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Interactive Map</p>
          <p className="text-sm text-gray-400">
            {userLocation ? `Your location: ${userLocation.lat.toFixed(4)}, ${userLocation.lon.toFixed(4)}` : 'Getting your location...'}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading veterinary clinics...</p>
        </div>
      )}

      {/* Clinics List */}
      <div className="space-y-3">
        {clinics.map((clinic) => (
          <Card key={clinic.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{clinic.name}</h4>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{clinic.address}</span>
                  </div>
                  
                  {clinic.phone && (
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Phone className="h-4 w-4 mr-1" />
                      <span>{clinic.phone}</span>
                    </div>
                  )}
                  
                  {clinic.hours && (
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{clinic.hours}</span>
                    </div>
                  )}
                  
                  {clinic.rating && (
                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">{clinic.rating}/5</span>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <span className="text-sm font-medium text-blue-600">
                    {getDistanceLabel(clinic.distance)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && clinics.length === 0 && (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No veterinary clinics found in the selected area.</p>
          <p className="text-sm text-gray-400 mt-1">Try increasing the search distance.</p>
        </div>
      )}
    </div>
  );
};

export default VetDirectoryMap;
