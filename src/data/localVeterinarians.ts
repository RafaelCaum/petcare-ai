
export interface LocalVetClinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  rating: number;
  isOpen24Hours: boolean;
  openingHours: {
    [key: string]: string;
  };
  isEmergency: boolean;
  website?: string;
}

export const MIAMI_VETERINARIANS: LocalVetClinic[] = [
  {
    id: "brickell-bay-animal",
    name: "Brickell Bay Animal Hospital",
    address: "940 Brickell Bay Dr, Miami, FL 33131",
    phone: "(305) 358-4400",
    latitude: 25.7658,
    longitude: -80.1917,
    rating: 4.2,
    isOpen24Hours: false,
    openingHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM", 
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "8:00 AM - 2:00 PM",
      sunday: "Closed"
    },
    isEmergency: false,
    website: "https://brickellbayanimalhospital.com"
  },
  {
    id: "miami-vet-specialists",
    name: "Miami Veterinary Specialists",
    address: "8601 Sunset Dr, Miami, FL 33143",
    phone: "(305) 665-2820",
    latitude: 25.7069,
    longitude: -80.3118,
    rating: 4.5,
    isOpen24Hours: true,
    openingHours: {
      monday: "24 Hours",
      tuesday: "24 Hours",
      wednesday: "24 Hours", 
      thursday: "24 Hours",
      friday: "24 Hours",
      saturday: "24 Hours",
      sunday: "24 Hours"
    },
    isEmergency: true
  },
  {
    id: "vca-coral-gables",
    name: "VCA Coral Gables Animal Hospital",
    address: "4030 SW 57th Ave, Miami, FL 33155",
    phone: "(305) 666-4142",
    latitude: 25.7234,
    longitude: -80.2625,
    rating: 4.3,
    isOpen24Hours: false,
    openingHours: {
      monday: "7:00 AM - 7:00 PM",
      tuesday: "7:00 AM - 7:00 PM",
      wednesday: "7:00 AM - 7:00 PM",
      thursday: "7:00 AM - 7:00 PM", 
      friday: "7:00 AM - 7:00 PM",
      saturday: "8:00 AM - 5:00 PM",
      sunday: "8:00 AM - 5:00 PM"
    },
    isEmergency: false
  },
  {
    id: "animal-emergency-miami",
    name: "Animal Emergency & Referral Center",
    address: "18445 NW 7th Ave, Miami, FL 33169",
    phone: "(305) 757-3387",
    latitude: 25.9342,
    longitude: -80.2209,
    rating: 4.1,
    isOpen24Hours: true,
    openingHours: {
      monday: "24 Hours",
      tuesday: "24 Hours", 
      wednesday: "24 Hours",
      thursday: "24 Hours",
      friday: "24 Hours", 
      saturday: "24 Hours",
      sunday: "24 Hours"
    },
    isEmergency: true
  },
  {
    id: "blue-pearl-miami",
    name: "BluePearl Pet Hospital",
    address: "16501 SW 88th St, Miami, FL 33196",
    phone: "(305) 274-2777",
    latitude: 25.6907,
    longitude: -80.4545,
    rating: 4.4,
    isOpen24Hours: true,
    openingHours: {
      monday: "24 Hours",
      tuesday: "24 Hours",
      wednesday: "24 Hours",
      thursday: "24 Hours", 
      friday: "24 Hours",
      saturday: "24 Hours",
      sunday: "24 Hours"
    },
    isEmergency: true
  },
  {
    id: "downtown-animal-hospital",
    name: "Downtown Animal Hospital",
    address: "709 NE 1st Ave, Miami, FL 33132",
    phone: "(305) 374-5233",
    latitude: 25.7814,
    longitude: -80.1918,
    rating: 4.0,
    isOpen24Hours: false,
    openingHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM", 
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "9:00 AM - 1:00 PM",
      sunday: "Closed"
    },
    isEmergency: false
  },
  {
    id: "palmetto-bay-animal",
    name: "Palmetto Bay Animal Clinic",
    address: "17535 S Dixie Hwy, Palmetto Bay, FL 33157",
    phone: "(305) 235-7387",
    latitude: 25.6159,
    longitude: -80.3053,
    rating: 4.6,
    isOpen24Hours: false,
    openingHours: {
      monday: "7:30 AM - 6:00 PM",
      tuesday: "7:30 AM - 6:00 PM",
      wednesday: "7:30 AM - 6:00 PM",
      thursday: "7:30 AM - 6:00 PM",
      friday: "7:30 AM - 6:00 PM", 
      saturday: "8:00 AM - 4:00 PM",
      sunday: "Closed"
    },
    isEmergency: false
  },
  {
    id: "aventura-animal-hospital",
    name: "Aventura Animal Hospital",
    address: "20455 Biscayne Blvd, Aventura, FL 33180",
    phone: "(305) 932-8228",
    latitude: 25.9565,
    longitude: -80.1431,
    rating: 4.3,
    isOpen24Hours: false,
    openingHours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 6:00 PM",
      saturday: "8:00 AM - 2:00 PM", 
      sunday: "Closed"
    },
    isEmergency: false
  }
];
