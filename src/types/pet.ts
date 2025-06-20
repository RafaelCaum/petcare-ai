
export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  breed?: string;
  birthDate: string;
  avatar: string;
  weight?: number;
  color?: string;
  gender?: 'male' | 'female';
  photoUrl?: string;
}

export interface Reminder {
  id: string;
  petId: string;
  title: string;
  type: 'vaccine' | 'vet' | 'grooming' | 'bath' | 'medication' | 'other';
  date: string;
  time: string;
  notes?: string;
  completed: boolean;
  emailReminder: boolean;
  smsReminder: boolean;
}

export interface Expense {
  id: string;
  petId: string;
  amount: number;
  category: 'grooming' | 'vet' | 'food' | 'toys' | 'supplies' | 'medication' | 'other';
  description: string;
  date: string;
  notes?: string;
}

export interface Vaccination {
  id: string;
  petId: string;
  vaccineName: string;
  dateGiven: string;
  nextDueDate: string;
  veterinarian?: string;
  notes?: string;
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  subscriptionStatus: 'trial' | 'active' | 'cancelled' | 'expired';
  trialStartDate: string;
  subscriptionEndDate?: string;
}
