import React, { useState, useEffect } from 'react';
import { Zap, Save, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ZapierWebhook {
  id: string;
  user_email: string;
  webhook_url: string;
  webhook_type: 'confirmation' | 'reminder';
  is_active: boolean;
  created_at: string;
}

interface ZapierWebhookSettingsProps {
  userEmail: string;
}

const ZapierWebhookSettings: React.FC<ZapierWebhookSettingsProps> = ({ userEmail }) => {
  const [webhooks, setWebhooks] = useState<ZapierWebhook[]>([]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookType, setNewWebhookType] = useState<'confirmation' | 'reminder'>('confirmation');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWebhooks();
  }, [userEmail]);

  const fetchWebhooks = async () => {
    try {
      const { data, error } = await supabase
        .from('zapier_webhooks')
        .select('*')
        .eq('user_email', userEmail);

      if (error) throw error;
      setWebhooks(data || []);
    } catch (error) {
      console.error('Error fetching webhooks:', error);
    }
  };

  const addWebhook = async () => {
    if (!newWebhookUrl.trim()) {
      toast.error('Digite uma URL válida');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('zapier_webhooks')
        .insert({
          user_email: userEmail,
          webhook_url: newWebhookUrl.trim(),
          webhook_type: newWebhookType,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setWebhooks(prev => [...prev, data]);
      setNewWebhookUrl('');
      toast.success('Webhook adicionado com sucesso!');
    } catch (error) {
      console.error('Error adding webhook:', error);
      toast.error('Erro ao adicionar webhook');
    } finally {
      setLoading(false);
    }
  };

  const deleteWebhook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('zapier_webhooks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWebhooks(prev => prev.filter(w => w.id !== id));
      toast.success('Webhook removido com sucesso!');
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast.error('Erro ao remover webhook');
    }
  };

  const toggleWebhook = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('zapier_webhooks')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      setWebhooks(prev => prev.map(w => 
        w.id === id ? { ...w, is_active: !isActive } : w
      ));
      toast.success('Webhook atualizado!');
    } catch (error) {
      console.error('Error updating webhook:', error);
      toast.error('Erro ao atualizar webhook');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Zap className="mr-2 text-yellow-500" size={20} />
        Configurações do Zapier
      </h3>

      {/* Add New Webhook */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-3">Adicionar Novo Webhook</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tipo de Webhook
            </label>
            <select
              value={newWebhookType}
              onChange={(e) => setNewWebhookType(e.target.value as 'confirmation' | 'reminder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="confirmation">Confirmação de Vacina</option>
              <option value="reminder">Lembrete de Vacina</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              URL do Webhook
            </label>
            <input
              type="url"
              value={newWebhookUrl}
              onChange={(e) => setNewWebhookUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/hooks/catch/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={addWebhook}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Plus size={16} />
            Adicionar Webhook
          </button>
        </div>
      </div>

      {/* Existing Webhooks */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Webhooks Configurados</h4>
        {webhooks.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhum webhook configurado</p>
        ) : (
          webhooks.map((webhook) => (
            <div key={webhook.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      webhook.webhook_type === 'confirmation' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {webhook.webhook_type === 'confirmation' ? 'Confirmação' : 'Lembrete'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      webhook.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {webhook.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{webhook.webhook_url}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleWebhook(webhook.id, webhook.is_active)}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      webhook.is_active 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {webhook.is_active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => deleteWebhook(webhook.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ZapierWebhookSettings;
