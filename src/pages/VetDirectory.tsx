import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MapPin, Phone, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VetClinic {
  properties: {
    name: string;
    formatted: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    phone?: string;
    website?: string;
    lat: number;
    lon: number;
    distance: number;
  };
  geometry: {
    coordinates: [number, number];
  };
}

const VetDirectory = () => {
  const [clinics, setClinics] = useState<VetClinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState<VetClinic | null>(null);
  const [userLocation, setUserLocation] = useState({ lat: 25.7617, lng: -80.1918 }); // Default to Miami
  const [distance, setDistance] = useState('5000'); // 5km default
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Keep default Miami location
        }
      );
    }
  }, []);

  // Fetch veterinary clinics
  const fetchClinics = async () => {
    setLoading(true);
    try {
      const apiKey = '38696eb96fa74efbf5201301e3ba783d';
      const url = `https://api.geoapify.com/v2/places?categories=healthcare.veterinary&filter=circle:${userLocation.lng},${userLocation.lat},${distance}&limit=20&apiKey=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.features) {
        setClinics(data.features);
      }
    } catch (error) {
      console.error('Error fetching clinics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Simple map implementation without external dependencies
    const initMap = () => {
      if (map.current) return;
      
      // Create a simple map container
      const mapElement = mapContainer.current;
      if (mapElement) {
        mapElement.innerHTML = `
          <div class="w-full h-full bg-blue-50 rounded-lg flex items-center justify-center border-2 border-blue-200">
            <div class="text-center p-4">
              <div class="text-blue-600 text-lg font-semibold mb-2">Map View</div>
              <div class="text-sm text-gray-600">Location: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}</div>
              <div class="text-xs text-gray-500 mt-2">Showing ${clinics.length} veterinary clinics nearby</div>
            </div>
          </div>
        `;
      }
    };

    initMap();
  }, [userLocation, clinics]);

  // Fetch clinics when location or distance changes
  useEffect(() => {
    fetchClinics();
  }, [userLocation, distance]);

  const getDistanceLabel = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return 'Not available';
    return phone;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center gap-3 mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Veterinary Clinics Near You</h1>
          </div>
          
          {/* Distance Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <Select value={distance} onValueChange={setDistance}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1000">1 km</SelectItem>
                <SelectItem value="5000">5 km</SelectItem>
                <SelectItem value="10000">10 km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Map Container */}
        <div className="h-64 mx-4 mb-4">
          <div ref={mapContainer} className="w-full h-full rounded-lg shadow-sm" />
        </div>

        {/* Clinics List */}
        <div className="px-4 pb-20">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading veterinary clinics...</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Found {clinics.length} veterinary clinics within {parseInt(distance) / 1000}km
                </p>
              </div>
              
              <div className="space-y-3">
                {clinics.map((clinic, index) => (
                  <Card 
                    key={index} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedClinic(clinic)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-start gap-2">
                        <MapPin size={18} className="text-primary mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {clinic.properties.name || 'Veterinary Clinic'}
                          </div>
                          <div className="text-sm font-normal text-gray-600">
                            {getDistanceLabel(clinic.properties.distance)} away
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="text-gray-400 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            {clinic.properties.formatted || 
                             `${clinic.properties.address_line1 || ''} ${clinic.properties.city || ''}`}
                          </span>
                        </div>
                        {clinic.properties.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {formatPhone(clinic.properties.phone)}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Clinic Details Modal */}
        {selectedClinic && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white w-full max-w-md mx-auto rounded-t-2xl p-6 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedClinic.properties.name || 'Veterinary Clinic'}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedClinic(null)}
                  className="text-gray-500"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                  <p className="text-gray-600">
                    {selectedClinic.properties.formatted || 
                     `${selectedClinic.properties.address_line1 || ''} ${selectedClinic.properties.city || ''}`}
                  </p>
                </div>
                
                {selectedClinic.properties.phone && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">
                      {formatPhone(selectedClinic.properties.phone)}
                    </p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Distance</h4>
                  <p className="text-gray-600">
                    {getDistanceLabel(selectedClinic.properties.distance)} from your location
                  </p>
                </div>
                
                <div className="flex gap-2 pt-4">
                  {selectedClinic.properties.phone && (
                    <Button 
                      className="flex-1"
                      onClick={() => window.open(`tel:${selectedClinic.properties.phone}`, '_blank')}
                    >
                      <Phone size={16} className="mr-2" />
                      Call
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      const lat = selectedClinic.properties.lat;
                      const lon = selectedClinic.properties.lon;
                      window.open(`https://maps.google.com/?q=${lat},${lon}`, '_blank');
                    }}
                  >
                    <MapPin size={16} className="mr-2" />
                    Directions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VetDirectory;
