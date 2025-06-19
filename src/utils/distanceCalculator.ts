
/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Check if a veterinary clinic is currently open
 */
export function isClinicOpen(clinic: { isOpen24Hours: boolean; openingHours: { [key: string]: string } }): boolean {
  if (clinic.isOpen24Hours) {
    return true;
  }
  
  const now = new Date();
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  const dayMapping: { [key: number]: string } = {
    0: 'sunday',
    1: 'monday', 
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
  };
  
  const today = dayMapping[now.getDay()];
  const hours = clinic.openingHours[today];
  
  if (!hours || hours === 'Closed') {
    return false;
  }
  
  if (hours === '24 Hours') {
    return true;
  }
  
  // Parse hours like "8:00 AM - 6:00 PM"
  const timePattern = /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/;
  const match = hours.match(timePattern);
  
  if (!match) {
    return false;
  }
  
  const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = match;
  
  const startTime = convertTo24Hour(parseInt(startHour), parseInt(startMin), startPeriod);
  const endTime = convertTo24Hour(parseInt(endHour), parseInt(endMin), endPeriod);
  
  return currentTime >= startTime && currentTime <= endTime;
}

function convertTo24Hour(hour: number, minute: number, period: string): number {
  let hour24 = hour;
  
  if (period === 'PM' && hour !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour === 12) {
    hour24 = 0;
  }
  
  return hour24 * 100 + minute;
}
