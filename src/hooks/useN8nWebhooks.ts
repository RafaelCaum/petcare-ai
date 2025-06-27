
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WebhookData {
  user_email: string;
  pet_id: string;
  tipo_evento: string;
  data: string;
  [key: string]: any;
}

export const useN8nWebhooks = (userEmail: string | null) => {
  const [loading, setLoading] = useState(false);

  const triggerWebhook = async (
    webhookType: string,
    data: WebhookData
  ) => {
    if (!userEmail) {
      console.error('User email is required for webhook');
      return;
    }

    try {
      setLoading(true);
      console.log('Triggering n8n webhook:', { webhookType, data });

      // Buscar webhooks ativos do usuário
      const { data: webhooks, error } = await supabase
        .from('n8n_webhooks')
        .select('*')
        .eq('user_email', userEmail)
        .eq('webhook_type', webhookType)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching webhooks:', error);
        return;
      }

      if (!webhooks || webhooks.length === 0) {
        console.log('No active webhooks found for type:', webhookType);
        return;
      }

      // Disparar para todos os webhooks ativos do tipo
      const promises = webhooks.map(async (webhook) => {
        try {
          const response = await fetch(webhook.webhook_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...data,
              webhook_type: webhookType,
              timestamp: new Date().toISOString(),
            }),
          });

          if (!response.ok) {
            console.error(`Webhook ${webhook.id} failed:`, response.statusText);
          } else {
            console.log(`Webhook ${webhook.id} triggered successfully`);
          }
        } catch (error) {
          console.error(`Error triggering webhook ${webhook.id}:`, error);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error in triggerWebhook:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerVaccinationCompleted = async (
    petId: string,
    vaccinationId: string,
    vaccineName: string
  ) => {
    await triggerWebhook('vaccination_completed', {
      user_email: userEmail!,
      pet_id: petId,
      vaccination_id: vaccinationId,
      vaccination_name: vaccineName,
      tipo_evento: 'vacina_concluida',
      data: new Date().toISOString(),
    });
  };

  const triggerExpenseAdded = async (
    petId: string,
    expenseId: string,
    amount: number,
    category: string
  ) => {
    await triggerWebhook('expense_added', {
      user_email: userEmail!,
      pet_id: petId,
      expense_id: expenseId,
      amount,
      category,
      tipo_evento: 'despesa_adicionada',
      data: new Date().toISOString(),
    });
  };

  const triggerReminderCreated = async (
    petId: string,
    reminderId: string,
    reminderType: string,
    reminderDate: string
  ) => {
    await triggerWebhook('reminder_created', {
      user_email: userEmail!,
      pet_id: petId,
      reminder_id: reminderId,
      reminder_type: reminderType,
      reminder_date: reminderDate,
      tipo_evento: 'lembrete_criado',
      data: new Date().toISOString(),
    });
  };

  return {
    triggerVaccinationCompleted,
    triggerExpenseAdded,
    triggerReminderCreated,
    loading,
  };
};
