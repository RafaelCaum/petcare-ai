
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
  const [selectedDistance, setSelectedDistance] = useState('3219'); // 2 miles in meters
  const [apiKey, setApiKey] = useState('');

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
          // Fallback to Miami, FL
          setUserLocation({ lat: 25.7617, lon: -80.1918 });
        }
      );
    } else {
      // Fallback to Miami, FL
      setUserLocation({ lat: 25.7617, lon: -80.1918 });
    }
  };

  const fetchVeterinaryClinics = async (lat: number, lon: number, radius: string) => {
    if (!apiKey) {
      console.log('No API key provided. Using fallback data.');
      // Fallback data for demonstration
      setClinics([
        {
          id: '1',
          name: 'Miami Veterinary Clinic',
          address: '123 Biscayne Blvd, Miami, FL 33132',
          distance: 0.5,
          phone: '(305) 123-4567',
          rating: 4.5,
          hours: 'Mon-Fri: 8AM-6PM',
          lat: 25.7617,
          lon: -80.1918
        },
        {
          id: '2',
          name: 'Coral Gables Animal Hospital',
          address: '456 Miracle Mile, Coral Gables, FL 33134',
          distance: 1.2,
          phone: '(305) 987-6543',
          rating: 4.8,
          hours: '24/7 Emergency',
          lat: 25.7214,
          lon: -80.2683
        }
      ]);
      return;
    }

    setLoading(true);
    try {
      const url = `https://api.geoapify.com/v2/places?categories=healthcare.veterinary&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=20&apiKey=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features) {
        const clinicsData = data.features.map((feature: any, index: number) => ({
          id: feature.properties.place_id || `clinic-${index}`,
          name: feature.properties.name || 'Veterinary Clinic',
          address: feature.properties.formatted || feature.properties.address_line1 || 'Address not available',
          distance: Math.round((feature.properties.distance || 0) * 0.000621371), // Convert meters to miles
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
          name: 'Miami Veterinary Clinic',
          address: '123 Biscayne Blvd, Miami, FL 33132',
          distance: 0.5,
          phone: '(305) 123-4567',
          rating: 4.5,
          hours: 'Mon-Fri: 8AM-6PM',
          lat: 25.7617,
          lon: -80.1918
        },
        {
          id: '2',
          name: 'Coral Gables Animal Hospital',
          address: '456 Miracle Mile, Coral Gables, FL 33134',
          distance: 1.2,
          phone: '(305) 987-6543',
          rating: 4.8,
          hours: '24/7 Emergency',
          lat: 25.7214,
          lon: -80.2683
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
  }, [userLocation, selectedDistance, apiKey]);

  const handleDistanceChange = (value: string) => {
    setSelectedDistance(value);
  };

  const getDistanceLabel = (miles: number) => {
    if (miles < 1) {
      return `${(miles * 5280).toFixed(0)}ft`;
    }
    return `${miles.toFixed(1)}mi`;
  };

  return (
    <div className="space-y-4">
      {/* API Key Input */}
      {!apiKey && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 mb-2">
            Enter your Geoapify API key to fetch real veterinary clinics:
          </p>
          <input
            type="text"
            placeholder="Enter your Geoapify API key"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-yellow-600 mt-1">
            Get your free API key at <a href="https://geoapify.com" target="_blank" rel="noopener noreferrer" className="underline">geoapify.com</a>
          </p>
        </div>
      )}

      {/* Distance Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Nearby Veterinary Clinics</h3>
        <Select value={selectedDistance} onValueChange={handleDistanceChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1609">1mi</SelectItem>
            <SelectItem value="3219">2mi</SelectItem>
            <SelectItem value="8047">5mi</SelectItem>
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
