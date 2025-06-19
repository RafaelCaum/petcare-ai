
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Pet, Reminder, Expense, Vaccination, User } from '../types/pet';

export const useSupabaseData = (userEmail: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    fetchAllData();
  }, [userEmail]);

  const fetchAllData = async () => {
    if (!userEmail) return;

    try {
      setLoading(true);

      // Fetch user data
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (userData) {
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          subscriptionStatus: userData.subscription_status as 'trial' | 'active' | 'cancelled' | 'expired',
          trialStartDate: userData.trial_start_date,
          subscriptionEndDate: userData.subscription_end_date,
        });
      }

      // Fetch pets
      const { data: petsData } = await supabase
        .from('pets')
        .select('*')
        .eq('user_email', userEmail);

      if (petsData) {
        setPets(petsData.map(pet => ({
          id: pet.id,
          name: pet.name,
          type: pet.type as 'dog' | 'cat',
          breed: pet.breed,
          birthDate: pet.birth_date,
          avatar: pet.avatar || '🐕',
          weight: pet.weight,
          color: pet.color,
          gender: pet.gender as 'male' | 'female',
        })));
      }

      // Fetch reminders
      const { data: remindersData } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_email', userEmail);

      if (remindersData) {
        setReminders(remindersData.map(reminder => ({
          id: reminder.id,
          petId: reminder.pet_id,
          title: reminder.title,
          type: reminder.type as 'vaccine' | 'vet' | 'grooming' | 'bath' | 'medication' | 'other',
          date: reminder.date,
          time: reminder.time,
          notes: reminder.notes,
          completed: reminder.completed,
          emailReminder: reminder.email_reminder,
          smsReminder: reminder.sms_reminder,
        })));
      }

      // Fetch expenses
      const { data: expensesData } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_email', userEmail);

      if (expensesData) {
        setExpenses(expensesData.map(expense => ({
          id: expense.id,
          petId: expense.pet_id,
          amount: parseFloat(expense.amount.toString()),
          category: expense.category as 'grooming' | 'vet' | 'food' | 'toys' | 'supplies' | 'medication' | 'other',
          description: expense.description,
          date: expense.date,
          notes: expense.notes,
        })));
      }

      // Fetch vaccinations
      const { data: vaccinationsData } = await supabase
        .from('vaccinations')
        .select('*')
        .eq('user_email', userEmail);

      if (vaccinationsData) {
        setVaccinations(vaccinationsData.map(vaccination => ({
          id: vaccination.id,
          petId: vaccination.pet_id,
          vaccineName: vaccination.vaccine_name,
          dateGiven: vaccination.date_given,
          nextDueDate: vaccination.next_due_date,
          veterinarian: vaccination.veterinarian,
          notes: vaccination.notes,
          imageUrl: vaccination.image_url,
        })));
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!userEmail) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          pet_id: expense.petId,
          user_email: userEmail,
          amount: expense.amount.toString(),
          category: expense.category,
          description: expense.description,
          date: expense.date,
          notes: expense.notes,
        })
        .select()
        .single();

      if (error) throw error;

      const newExpense: Expense = {
        id: data.id,
        petId: data.pet_id,
        amount: parseFloat(data.amount),
        category: data.category as 'grooming' | 'vet' | 'food' | 'toys' | 'supplies' | 'medication' | 'other',
        description: data.description,
        date: data.date,
        notes: data.notes,
      };

      setExpenses(prev => [...prev, newExpense]);
      return newExpense;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  };

  const addReminder = async (reminder: Omit<Reminder, 'id'>) => {
    if (!userEmail) return;

    try {
      const { data, error } = await supabase
        .from('reminders')
        .insert({
          pet_id: reminder.petId,
          user_email: userEmail,
          title: reminder.title,
          type: reminder.type,
          date: reminder.date,
          time: reminder.time,
          notes: reminder.notes,
          completed: reminder.completed,
          email_reminder: reminder.emailReminder,
          sms_reminder: reminder.smsReminder,
        })
        .select()
        .single();

      if (error) throw error;

      const newReminder: Reminder = {
        id: data.id,
        petId: data.pet_id,
        title: data.title,
        type: data.type as 'vaccine' | 'vet' | 'grooming' | 'bath' | 'medication' | 'other',
        date: data.date,
        time: data.time,
        notes: data.notes,
        completed: data.completed,
        emailReminder: data.email_reminder,
        smsReminder: data.sms_reminder,
      };

      setReminders(prev => [...prev, newReminder]);
      return newReminder;
    } catch (error) {
      console.error('Error adding reminder:', error);
      throw error;
    }
  };

  const addPet = async (pet: Omit<Pet, 'id'>) => {
    if (!userEmail) return;

    try {
      const { data, error } = await supabase
        .from('pets')
        .insert({
          user_email: userEmail,
          name: pet.name,
          type: pet.type,
          breed: pet.breed,
          birth_date: pet.birthDate,
          gender: pet.gender,
          weight: pet.weight,
          color: pet.color,
          avatar: pet.avatar,
        })
        .select()
        .single();

      if (error) throw error;

      const newPet: Pet = {
        id: data.id,
        name: data.name,
        type: data.type as 'dog' | 'cat',
        breed: data.breed,
        birthDate: data.birth_date,
        avatar: data.avatar || '🐕',
        weight: data.weight,
        color: data.color,
        gender: data.gender as 'male' | 'female',
      };

      setPets(prev => [...prev, newPet]);
      return newPet;
    } catch (error) {
      console.error('Error adding pet:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!userEmail) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          phone: userData.phone,
        })
        .eq('email', userEmail)
        .select()
        .single();

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...userData } : null);
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const addVaccination = async (vaccination: Omit<Vaccination, 'id'>) => {
    if (!userEmail) return;

    try {
      const { data, error } = await supabase
        .from('vaccinations')
        .insert({
          pet_id: vaccination.petId,
          user_email: userEmail,
          vaccine_name: vaccination.vaccineName,
          date_given: vaccination.dateGiven,
          next_due_date: vaccination.nextDueDate,
          veterinarian: vaccination.veterinarian,
          notes: vaccination.notes,
          image_url: vaccination.imageUrl,
        })
        .select()
        .single();

      if (error) throw error;

      const newVaccination: Vaccination = {
        id: data.id,
        petId: data.pet_id,
        vaccineName: data.vaccine_name,
        dateGiven: data.date_given,
        nextDueDate: data.next_due_date,
        veterinarian: data.veterinarian,
        notes: data.notes,
        imageUrl: data.image_url,
      };

      setVaccinations(prev => [...prev, newVaccination]);
      return newVaccination;
    } catch (error) {
      console.error('Error adding vaccination:', error);
      throw error;
    }
  };

  return {
    user,
    pets,
    reminders,
    expenses,
    vaccinations,
    loading,
    addExpense,
    addReminder,
    addPet,
    updateUser,
    addVaccination,
    refetch: fetchAllData,
  };
};
