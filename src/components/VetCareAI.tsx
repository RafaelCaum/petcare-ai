
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Heart, Stethoscope, Syringe, Send } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

interface VetCareAIProps {
  userEmail: string;
  pets: any[];
}

interface VetQuery {
  id: string;
  pergunta: string;
  resposta: string;
  data: string;
}

const VetCareAI: React.FC<VetCareAIProps> = ({ userEmail, pets }) => {
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentQueries, setRecentQueries] = useState<VetQuery[]>([]);

  const suggestedQuestions = [
    "Qual o calendário de vacinas?",
    "Qual vermífugo usar para um filhote?",
    "Posso vacinar mesmo se ele estiver gripado?",
    "Como saber se meu pet está com febre?",
    "Quantas vezes por dia devo alimentar meu cachorro?"
  ];

  useEffect(() => {
    loadRecentQueries();
  }, [userEmail]);

  const loadRecentQueries = async () => {
    try {
      const { data, error } = await supabase
        .from('vet_queries')
        .select('*')
        .eq('user_id', userEmail)
        .order('data', { ascending: false })
        .limit(3);

      if (error) throw error;
      setRecentQueries(data || []);
    } catch (error) {
      console.error('Error loading recent queries:', error);
    }
  };

  const handleSubmit = async (question: string) => {
    if (!question.trim()) {
      toast.error('Por favor, digite sua pergunta');
      return;
    }

    setIsLoading(true);
    setPergunta(question);
    setResposta('');

    try {
      // Save question to database first
      const { data: savedQuery, error: saveError } = await supabase
        .from('vet_queries')
        .insert({
          user_id: userEmail,
          pergunta: question,
          resposta: null
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Send to N8N webhook (replace with your actual webhook URL)
      const webhookUrl = 'https://your-n8n-webhook-url.com/vetcare-ai';
      
      const webhookData = {
        user_id: userEmail,
        pergunta: question,
        pet_id: pets.length > 0 ? pets[0].id : null,
        query_id: savedQuery.id
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        throw new Error('Erro na comunicação com o assistente');
      }

      const result = await response.json();
      const aiResponse = result.resposta || 'Desculpe, não consegui processar sua pergunta no momento. Tente novamente em alguns minutos.';

      // Update the query with the response
      await supabase
        .from('vet_queries')
        .update({ resposta: aiResponse })
        .eq('id', savedQuery.id);

      setResposta(aiResponse);
      await loadRecentQueries();
      
    } catch (error) {
      console.error('Error:', error);
      // Fallback response for demo purposes
      const fallbackResponse = `Obrigado pela sua pergunta: "${question}". 

Como assistente veterinário, recomendo sempre consultar um veterinário presencial para diagnósticos precisos. 

Para questões gerais sobre cuidados com pets, posso ajudar com informações básicas sobre alimentação, vacinas e cuidados preventivos.

⚠️ **Importante**: Em caso de emergência ou sintomas graves, procure imediatamente um veterinário próximo.`;
      
      setResposta(fallbackResponse);
      toast.info('Usando resposta de demonstração - Configure o webhook N8N para respostas personalizadas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setPergunta(question);
    handleSubmit(question);
  };

  return (
    <div className="min-h-screen bg-white p-4 font-['Inter'] text-gray-800">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="bg-blue-50 p-2 rounded-full">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">VetCare AI</h1>
        </div>
        <p className="text-sm text-gray-500">Assistente virtual veterinário 24h</p>
      </div>

      {/* Medical Icons Decoration */}
      <div className="flex justify-center gap-8 mb-8 opacity-20">
        <Heart className="w-5 h-5 text-blue-400" />
        <Syringe className="w-5 h-5 text-blue-400" />
        <Stethoscope className="w-5 h-5 text-blue-400" />
      </div>

      {/* Question Input */}
      <Card className="mb-6 border-blue-100 shadow-sm">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative">
              <Input
                value={pergunta}
                onChange={(e) => setPergunta(e.target.value)}
                placeholder="Digite sua dúvida como se estivesse falando com um veterinário…"
                className="pr-12 bg-white border-blue-200 focus:border-blue-500 focus:ring-blue-100 text-gray-800"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(pergunta)}
              />
              <Button
                onClick={() => handleSubmit(pergunta)}
                disabled={isLoading || !pergunta.trim()}
                className="absolute right-1 top-1 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-400">
              Exemplo: "Meu cachorro está com a vacina atrasada. O que eu faço?"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Suggested Questions */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Perguntas sugeridas:</h3>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedQuestion(question)}
              className="px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
              disabled={isLoading}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="mb-6 border-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200"></div>
              <span className="text-sm text-gray-600 ml-2">O VetBot está analisando sua pergunta...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Response */}
      {resposta && (
        <Card className="mb-6 bg-blue-50 border-blue-100">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="bg-blue-600 p-2 rounded-full min-w-fit">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 mb-2">Resposta do VetBot:</h4>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {resposta}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Queries */}
      {recentQueries.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Consultas recentes:</h3>
          <div className="space-y-2">
            {recentQueries.map((query) => (
              <Card key={query.id} className="border-gray-100">
                <CardContent className="p-3">
                  <p className="text-sm text-gray-700 mb-1">{query.pergunta}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(query.data).toLocaleDateString('pt-BR')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          ⚠️ Este é um assistente automatizado. Para emergências, consulte um veterinário presencial.
        </p>
      </div>
    </div>
  );
};

export default VetCareAI;
