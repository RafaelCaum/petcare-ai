import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Pet, Reminder, Expense, Vaccination, User } from '../types/pet';
import { toast } from 'sonner';
import { useN8nWebhooks } from './useN8nWebhooks';

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

  const { 
    triggerVaccinationCompleted, 
    triggerExpenseAdded, 
    triggerReminderCreated 
  } = useN8nWebhooks(userEmail);

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    console.log('useSupabaseData: Starting fetch for user:', userEmail);
    fetchAllData();
  }, [userEmail]);

  const addPet = async (petData: Omit<Pet, 'id'>, photoFile?: File) => {
    if (!userEmail) return;

    try {
      console.log('=== ADDING NEW PET ===');
      console.log('Pet data:', petData);
      console.log('Photo file:', photoFile);

      // First, create the pet record
      const { data, error } = await supabase
        .from('pets')
        .insert({
          user_email: userEmail,
          name: petData.name,
          type: petData.type,
          breed: petData.breed || null,
          birth_date: petData.birthDate || null,
          gender: petData.gender || null,
          weight: petData.weight || null,
          color: petData.color || null,
          avatar: petData.avatar,
          photo_url: null,
          vacinado_status: petData.vacinadoStatus || null,
          data_ultima_vacina: petData.dataUltimaVacina || null,
          temperamento: petData.temperamento || null,
          tem_condicao: petData.temCondicao || false,
          qual_condicao: petData.qualCondicao || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding pet:', error);
        throw error;
      }

      console.log('Pet added successfully:', data);

      let finalPhotoUrl = null;

      // Then upload photo if provided
      if (photoFile) {
        try {
          console.log('Uploading photo for new pet...');
          finalPhotoUrl = await uploadPetPhoto(photoFile, data.id);
          
          if (finalPhotoUrl) {
            // Update the pet record with the photo URL
            const { error: updateError } = await supabase
              .from('pets')
              .update({ photo_url: finalPhotoUrl })
              .eq('id', data.id)
              .eq('user_email', userEmail);

            if (updateError) {
              console.error('Error updating pet with photo URL:', updateError);
              // Don't throw here, pet was created successfully
            } else {
              console.log('Successfully updated pet with photo URL');
            }
          }
        } catch (photoError) {
          console.error('Error uploading photo for new pet:', photoError);
          // Don't fail the entire operation if photo upload fails
        }
      }

      const newPet: Pet = {
        id: data.id,
        name: data.name,
        type: data.type as 'dog' | 'cat',
        breed: data.breed || '',
        birthDate: data.birth_date || '',
        avatar: data.avatar || '🐕',
        weight: data.weight || 0,
        color: data.color || '',
        gender: data.gender as 'male' | 'female' || 'male',
        photoUrl: finalPhotoUrl || undefined,
        vacinadoStatus: data.vacinado_status as 'sim' | 'nao' | 'nao_sei' || undefined,
        dataUltimaVacina: data.data_ultima_vacina || undefined,
        temperamento: data.temperamento as 'calmo' | 'medroso' | 'bravo' || undefined,
        temCondicao: data.tem_condicao || false,
        qualCondicao: data.qual_condicao || undefined,
      };

      setPets(prev => [...prev, newPet]);
      console.log('=== PET ADDITION COMPLETED ===');
      return newPet;
    } catch (error) {
      console.error('Error adding pet:', error);
      throw error;
    }
  };

  const updatePet = async (petId: string, petData: Omit<Pet, 'id'>, photoFile?: File) => {
    if (!userEmail) {
      console.error('No user email available for updatePet');
      return;
    }

    try {
      console.log('=== UPDATING PET ===');
      console.log('Pet ID:', petId);
      console.log('Pet Data:', petData);
      console.log('Photo File:', photoFile);
      
      let finalPhotoUrl = petData.photoUrl;

      // Handle photo upload first if there's a new photo
      if (photoFile) {
        try {
          console.log('Uploading new photo for existing pet...');
          finalPhotoUrl = await uploadPetPhoto(photoFile, petId);
          console.log('Photo uploaded successfully:', finalPhotoUrl);
        } catch (photoError) {
          console.error('Error uploading photo:', photoError);
          // Continue with update even if photo fails
        }
      }
      
      const updateData = {
        name: petData.name,
        type: petData.type,
        breed: petData.breed || null,
        birth_date: petData.birthDate || null,
        gender: petData.gender || null,
        weight: petData.weight || null,
        color: petData.color || null,
        avatar: petData.avatar,
        photo_url: finalPhotoUrl || null,
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

      // Update local state immediately
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

      // Trigger n8n webhook
      await triggerExpenseAdded(
        expense.petId,
        data.id,
        expense.amount,
        expense.category
      );

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

      // Trigger n8n webhook
      await triggerReminderCreated(
        reminder.petId,
        data.id,
        reminder.type,
        reminder.date
      );

      return newReminder;
    } catch (error) {
      console.error('Error adding reminder:', error);
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

  const markVaccinationAsCompleted = async (vaccinationId: string, newNextDueDate?: string) => {
    if (!userEmail) return;

    try {
      console.log('=== MARKING VACCINATION AS COMPLETED ===');
      console.log('Vaccination ID:', vaccinationId);
      console.log('User email:', userEmail);

      const todayDate = new Date().toISOString().split('T')[0];
      const nextDueDate = newNextDueDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
      
      console.log('Today date:', todayDate);
      console.log('Next due date:', nextDueDate);

      const { data, error } = await supabase
        .from('vaccinations')
        .update({
          date_given: todayDate,
          next_due_date: nextDueDate,
          status: 'completed'
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

      setVaccinations(prev => {
        console.log('Previous vaccinations state:', prev);
        const newState = prev.map(vaccination => 
          vaccination.id === vaccinationId ? updatedVaccination : vaccination
        );
        console.log('New vaccinations state:', newState);
        return newState;
      });

      // Trigger n8n webhook
      await triggerVaccinationCompleted(
        data.pet_id,
        vaccinationId,
        data.vaccine_name
      );

      toast.success('Vacina marcada como concluída!');

      console.log('=== VACCINATION UPDATE COMPLETED ===');
      return updatedVaccination;
    } catch (error) {
      console.error('Error marking vaccination as completed:', error);
      toast.error('Erro ao marcar vacina como concluída.');
      throw error;
    }
  };

  const fetchAllData = async () => {
    if (!userEmail) {
      console.log('No userEmail provided to fetchAllData');
      return;
    }

    try {
      console.log('Starting fetchAllData for:', userEmail);
      setLoading(true);

      // Fetch user data - only essential fields
      console.log('Fetching user data...');
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, email, phone, photo_url, subscription_status, trial_start_date, subscription_end_date')
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

      // Fetch pets - including new fields
      console.log('Fetching pets data...');
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('id, name, type, breed, birth_date, avatar, weight, color, gender, photo_url, vacinado_status, data_ultima_vacina, temperamento, tem_condicao, qual_condicao')
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
          vacinadoStatus: pet.vacinado_status as 'sim' | 'nao' | 'nao_sei',
          dataUltimaVacina: pet.data_ultima_vacina,
          temperamento: pet.temperamento as 'calmo' | 'medroso' | 'bravo',
          temCondicao: pet.tem_condicao,
          qualCondicao: pet.qual_condicao,
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

  const uploadPetPhoto = async (file: File, petId?: string) => {
    if (!userEmail) {
      console.error('No user email available');
      return null;
    }

    try {
      console.log('Starting photo upload for pet:', petId || 'new pet');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${petId || 'temp'}-${Date.now()}.${fileExt}`;
      const filePath = `${userEmail}/${fileName}`;

      console.log('Uploading file to path:', filePath);

      // Ensure the bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const petPhotosBucket = buckets?.find(bucket => bucket.name === 'pet-photos');
      
      if (!petPhotosBucket) {
        console.log('Creating pet-photos bucket...');
        const { error: bucketError } = await supabase.storage.createBucket('pet-photos', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
        });
        
        if (bucketError) {
          console.error('Error creating bucket:', bucketError);
          throw bucketError;
        }
      }

      const { error: uploadError } = await supabase.storage
        .from('pet-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('pet-photos')
        .getPublicUrl(filePath);

      console.log('Generated public URL:', publicUrl);
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
