
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VetSearchRequest {
  latitude: number;
  longitude: number;
  radius?: number;
}

interface GooglePlace {
  place_id: string;
  name: string;
  vicinity: string;
  formatted_phone_number?: string;
  rating?: number;
  opening_hours?: {
    open_now: boolean;
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, radius = 5000 }: VetSearchRequest = await req.json();

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }

    console.log(`Searching for veterinarians near ${latitude}, ${longitude} within ${radius}m`);

    // Search for veterinarians using Google Places Nearby Search
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=veterinary_care&key=${apiKey}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', searchData);
      throw new Error(`Google Places API error: ${searchData.status}`);
    }

    console.log(`Found ${searchData.results?.length || 0} veterinarians`);

    // Process results and get detailed information
    const vetPromises = searchData.results?.slice(0, 10).map(async (place: GooglePlace) => {
      try {
        // Get detailed information including phone number
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=formatted_phone_number,opening_hours&key=${apiKey}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        // Calculate distance (rough estimate)
        const distance = calculateDistance(
          latitude, longitude,
          place.geometry.location.lat, place.geometry.location.lng
        );

        return {
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          phone: detailsData.result?.formatted_phone_number || 'Phone not available',
          distance: Math.round(distance * 10) / 10,
          rating: place.rating || 0,
          isOpen: detailsData.result?.opening_hours?.open_now ?? true,
          placeId: place.place_id
        };
      } catch (error) {
        console.error(`Error getting details for place ${place.place_id}:`, error);
        // Return basic info if details fail
        const distance = calculateDistance(
          latitude, longitude,
          place.geometry.location.lat, place.geometry.location.lng
        );

        return {
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          phone: 'Phone not available',
          distance: Math.round(distance * 10) / 10,
          rating: place.rating || 0,
          isOpen: true,
          placeId: place.place_id
        };
      }
    }) || [];

    const vets = await Promise.all(vetPromises);
    
    // Sort by distance
    const sortedVets = vets.sort((a, b) => a.distance - b.distance);

    console.log(`Returning ${sortedVets.length} veterinarians`);

    return new Response(JSON.stringify(sortedVets), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in search-nearby-vets function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

serve(handler);
