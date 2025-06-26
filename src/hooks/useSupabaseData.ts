import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Pet, Reminder, Expense, Vaccination, User } from '../types/pet';
import { toast } from 'sonner';

// Extend the Supabase user type to include photo_url, is_paying, and next_due_date
type UserWithPhoto = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  photo_url: string | null;
  subscription_status: string;
  trial_start_date: string;
  subscription_end_date: string | null;
  is_paying: boolean | null;
  next_due_date: string | null;
  created_at: string;
  updated_at: string;
};

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

    console.log('useSupabaseData: Starting fetch for user:', userEmail);
    fetchAllData();
  }, [userEmail]);

  const fetchAllData = async () => {
    if (!userEmail) {
      console.log('No userEmail provided to fetchAllData');
      return;
    }

    try {
      console.log('Starting fetchAllData for:', userEmail);
      setLoading(true);

      // Fetch user data
      console.log('Fetching user data...');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userEmail)
        .single();

      if (userError) {
        console.error('Error fetching user:', userError);
      } else if (userData) {
        console.log('User data fetched successfully:', userData);
        const userDataWithPhoto = userData as UserWithPhoto;
        setUser({
          id: userDataWithPhoto.id,
          name: userDataWithPhoto.name,
          email: userDataWithPhoto.email,
          phone: userDataWithPhoto.phone,
          photoUrl: userDataWithPhoto.photo_url,
          subscriptionStatus: userDataWithPhoto.subscription_status as 'trial' | 'active' | 'cancelled' | 'expired',
          trialStartDate: userDataWithPhoto.trial_start_date,
          subscriptionEndDate: userDataWithPhoto.subscription_end_date,
        });
      }

      // Fetch pets
      console.log('Fetching pets data...');
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .eq('user_email', userEmail);

      if (petsError) {
        console.error('Error fetching pets:', petsError);
      } else if (petsData) {
        console.log('Pets data fetched successfully:', petsData);
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
          photoUrl: pet.photo_url,
        })));
      }

      // Fetch reminders
      console.log('Fetching reminders data...');
      const { data: remindersData, error: remindersError } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_email', userEmail);

      if (remindersError) {
        console.error('Error fetching reminders:', remindersError);
      } else if (remindersData) {
        console.log('Reminders data fetched successfully:', remindersData);
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
      console.log('Fetching expenses data...');
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_email', userEmail);

      if (expensesError) {
        console.error('Error fetching expenses:', expensesError);
      } else if (expensesData) {
        console.log('Expenses data fetched successfully:', expensesData);
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
      console.log('Fetching vaccinations data...');
      const { data: vaccinationsData, error: vaccinationsError } = await supabase
        .from('vaccinations')
        .select('*')
        .eq('user_email', userEmail);

      if (vaccinationsError) {
        console.error('Error fetching vaccinations:', vaccinationsError);
      } else if (vaccinationsData) {
        console.log('Vaccinations data fetched successfully:', vaccinationsData);
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

      console.log('All data fetched successfully');
    } catch (error) {
      console.error('Error in fetchAllData:', error);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const uploadPetPhoto = async (file: File, petId: string) => {
    if (!userEmail) {
      console.error('No user email available');
      return null;
    }

    try {
      console.log('Starting photo upload for pet:', petId);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${petId}-${Date.now()}.${fileExt}`;
      const filePath = `${userEmail}/${fileName}`;

      console.log('Uploading file to path:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('pet-photos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('pet-photos')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl);

      // Update pet with photo URL in database
      const { error: updateError } = await supabase
        .from('pets')
        .update({ photo_url: publicUrl })
        .eq('id', petId)
        .eq('user_email', userEmail);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw updateError;
      }

      console.log('Successfully updated pet photo URL in database');

      // Update local state immediately
      setPets(prev => prev.map(pet => 
        pet.id === petId ? { ...pet, photoUrl: publicUrl } : pet
      ));

      console.log('Updated local state with new photo URL');

      return publicUrl;
    } catch (error) {
      console.error('Error uploading pet photo:', error);
      throw error;
    }
  };

  const uploadUserPhoto = async (file: File) => {
    if (!userEmail) {
      console.error('No user email available');
      return null;
    }

    try {
      console.log('Starting user photo upload');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `profile-${Date.now()}.${fileExt}`;
      const filePath = `${userEmail}/${fileName}`;

      console.log('Uploading file to path:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('user-photos')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl);

      // Update user with photo URL in database
      const { error: updateError } = await supabase
        .from('users')
        .update({ photo_url: publicUrl } as { photo_url: string })
        .eq('email', userEmail);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw updateError;
      }

      console.log('Successfully updated user photo URL in database');

      // Update local state immediately
      setUser(prev => prev ? { ...prev, photoUrl: publicUrl } : null);

      console.log('Updated local state with new photo URL');

      return publicUrl;
    } catch (error) {
      console.error('Error uploading user photo:', error);
      throw error;
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
          amount: expense.amount,
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
        amount: parseFloat(data.amount.toString()),
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
          photo_url: pet.photoUrl,
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
        photoUrl: data.photo_url,
      };

      setPets(prev => [...prev, newPet]);
      return newPet;
    } catch (error) {
      console.error('Error adding pet:', error);
      throw error;
    }
  };

  const updatePet = async (petId: string, petData: Omit<Pet, 'id'>) => {
    if (!userEmail) {
      console.error('No user email available for updatePet');
      return;
    }

    try {
      console.log('=== UPDATING PET ===');
      console.log('Pet ID:', petId);
      console.log('Pet Data:', petData);
      console.log('User Email:', userEmail);
      
      const updateData = {
        name: petData.name,
        type: petData.type,
        breed: petData.breed || null,
        birth_date: petData.birthDate || null,
        gender: petData.gender || null,
        weight: petData.weight || null,
        color: petData.color || null,
        avatar: petData.avatar,
        photo_url: petData.photoUrl || null,
      };

      console.log('Update data being sent to Supabase:', updateData);

      const { data, error } = await supabase
        .from('pets')
        .update(updateData)
        .eq('id', petId)
        .eq('user_email', userEmail)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Supabase update successful:', data);

      const updatedPet: Pet = {
        id: data.id,
        name: data.name,
        type: data.type as 'dog' | 'cat',
        breed: data.breed || '',
        birthDate: data.birth_date || '',
        avatar: data.avatar || '🐕',
        weight: data.weight || 0,
        color: data.color || '',
        gender: data.gender as 'male' | 'female' || 'male',
        photoUrl: data.photo_url || undefined,
      };

      console.log('Updated pet object:', updatedPet);

      // Update local state
      setPets(prev => {
        const newPets = prev.map(pet => 
          pet.id === petId ? updatedPet : pet
        );
        console.log('Updated pets state:', newPets);
        return newPets;
      });

      console.log('=== PET UPDATE COMPLETED ===');
      return updatedPet;
    } catch (error) {
      console.error('Error updating pet:', error);
      throw error;
    }
  };

  const deletePet = async (petId: string) => {
    if (!userEmail) return;

    try {
      // First delete all related data
      await supabase
        .from('vaccinations')
        .delete()
        .eq('pet_id', petId)
        .eq('user_email', userEmail);

      await supabase
        .from('reminders')
        .delete()
        .eq('pet_id', petId)
        .eq('user_email', userEmail);

      await supabase
        .from('expenses')
        .delete()
        .eq('pet_id', petId)
        .eq('user_email', userEmail);

      // Then delete the pet
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId)
        .eq('user_email', userEmail);

      if (error) throw error;

      // Update local state
      setPets(prev => prev.filter(pet => pet.id !== petId));
      setVaccinations(prev => prev.filter(vaccination => vaccination.petId !== petId));
      setReminders(prev => prev.filter(reminder => reminder.petId !== petId));
      setExpenses(prev => prev.filter(expense => expense.petId !== petId));
    } catch (error) {
      console.error('Error deleting pet:', error);
      throw error;
    }
  };

  const deleteExpense = async (expenseId: string) => {
    if (!userEmail) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId)
        .eq('user_email', userEmail);

      if (error) throw error;

      setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!userEmail) return;

    try {
      const updateData: { name?: string; phone?: string; photo_url?: string } = {};
      if (userData.name !== undefined) updateData.name = userData.name;
      if (userData.phone !== undefined) updateData.phone = userData.phone;
      if (userData.photoUrl !== undefined) updateData.photo_url = userData.photoUrl;

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
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
    if (!userEmail) {
      console.error('User email not available');
      return;
    }

    try {
      console.log('Adding vaccination:', vaccination);
      
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

      if (error) {
        console.error('Error adding vaccination:', error);
        throw error;
      }

      console.log('Vaccination added successfully:', data);

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
      
      // Exibir mensagem de sucesso
      toast.success('Vacina registrada com sucesso!');
      
      return newVaccination;
    } catch (error) {
      console.error('Error adding vaccination:', error);
      toast.error('Erro ao registrar vacina. Tente novamente.');
      throw error;
    }
  };

  const deleteVaccination = async (vaccinationId: string) => {
    if (!userEmail) return;

    try {
      const { error } = await supabase
        .from('vaccinations')
        .delete()
        .eq('id', vaccinationId)
        .eq('user_email', userEmail);

      if (error) throw error;

      setVaccinations(prev => prev.filter(vaccination => vaccination.id !== vaccinationId));
    } catch (error) {
      console.error('Error deleting vaccination:', error);
      throw error;
    }
  };

  const markVaccinationAsCompleted = async (vaccinationId: string, newNextDueDate: string) => {
    if (!userEmail) return;

    try {
      console.log('=== MARKING VACCINATION AS COMPLETED ===');
      console.log('Vaccination ID:', vaccinationId);
      console.log('New next due date:', newNextDueDate);
      console.log('User email:', userEmail);

      const todayDate = new Date().toISOString().split('T')[0];
      console.log('Today date:', todayDate);

      const { data, error } = await supabase
        .from('vaccinations')
        .update({
          date_given: todayDate,
          next_due_date: newNextDueDate,
        })
        .eq('id', vaccinationId)
        .eq('user_email', userEmail)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Supabase update successful:', data);

      const updatedVaccination: Vaccination = {
        id: data.id,
        petId: data.pet_id,
        vaccineName: data.vaccine_name,
        dateGiven: data.date_given,
        nextDueDate: data.next_due_date,
        veterinarian: data.veterinarian,
        notes: data.notes,
        imageUrl: data.image_url,
      };

      console.log('Updated vaccination object:', updatedVaccination);

      // Force state update
      setVaccinations(prev => {
        console.log('Previous vaccinations state:', prev);
        const newState = prev.map(vaccination => 
          vaccination.id === vaccinationId ? updatedVaccination : vaccination
        );
        console.log('New vaccinations state:', newState);
        return newState;
      });

      console.log('=== VACCINATION UPDATE COMPLETED ===');
      return updatedVaccination;
    } catch (error) {
      console.error('Error marking vaccination as completed:', error);
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
    updatePet,
    deletePet,
    deleteExpense,
    updateUser,
    addVaccination,
    deleteVaccination,
    markVaccinationAsCompleted,
    uploadPetPhoto,
    uploadUserPhoto,
    refetch: fetchAllData,
  };
};
