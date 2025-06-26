
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Camera, Save, Heart } from 'lucide-react';
import { Pet } from '../types/pet';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { toast } from 'sonner';

interface MyPetPageProps {
  userEmail: string;
}

const MyPetPage: React.FC<MyPetPageProps> = ({ userEmail }) => {
  const { addPet } = useSupabaseData(userEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<'dog' | 'cat'>('dog');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('');
  const [color, setColor] = useState('');
  const [vacinadoStatus, setVacinadoStatus] = useState<'sim' | 'nao' | 'nao_sei'>('nao_sei');
  const [dataUltimaVacina, setDataUltimaVacina] = useState('');
  const [temperamento, setTemperamento] = useState<'calmo' | 'medroso' | 'bravo'>('calmo');
  const [temCondicao, setTemCondicao] = useState<boolean>(false);
  const [qualCondicao, setQualCondicao] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendToN8N = async (petData: any) => {
    try {
      // In a real implementation, you would have configured n8n webhook URLs
      // For now, we'll just log the data that would be sent
      const webhookData = {
        user_email: userEmail,
        pet_data: petData,
        timestamp: new Date().toISOString(),
        action: 'pet_registered'
      };
      
      console.log('Data that would be sent to n8n:', webhookData);
      
      // Here you would make the actual webhook call:
      // const response = await fetch('YOUR_N8N_WEBHOOK_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(webhookData)
      // });
      
      toast.success('Pet cadastrado! Plano vacinal será gerado em breve.');
    } catch (error) {
      console.error('Error sending to n8n:', error);
      toast.error('Erro ao enviar dados para processamento');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Por favor, insira o nome do pet');
      return;
    }

    setIsLoading(true);

    try {
      const petData: Omit<Pet, 'id'> = {
        name: name.trim(),
        type,
        breed: breed.trim(),
        birthDate,
        gender,
        weight: parseFloat(weight) || 0,
        color: color.trim(),
        avatar: type === 'dog' ? '🐕' : '🐱',
        photoUrl: undefined,
        vacinadoStatus,
        dataUltimaVacina: dataUltimaVacina || undefined,
        temperamento,
        temCondicao,
        qualCondicao: temCondicao ? qualCondicao.trim() : undefined
      };

      const savedPet = await addPet(petData, selectedFile || undefined);
      
      if (savedPet) {
        // Send data to n8n for processing
        await sendToN8N({
          ...petData,
          id: savedPet.id,
          photoUrl: savedPet.photoUrl
        });

        // Reset form
        setName('');
        setBreed('');
        setBirthDate('');
        setWeight('');
        setColor('');
        setVacinadoStatus('nao_sei');
        setDataUltimaVacina('');
        setTemperamento('calmo');
        setTemCondicao(false);
        setQualCondicao('');
        setSelectedFile(null);
        setPhotoPreview(null);
        
        toast.success('Pet cadastrado com sucesso!');
      }
    } catch (error) {
      console.error('Error saving pet:', error);
      toast.error('Erro ao cadastrar pet. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 font-['Inter']">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-semibold text-gray-800">Cadastro do Pet</h1>
        </div>
        <p className="text-gray-600">Vamos conhecer melhor seu companheiro</p>
      </div>

      {/* Form */}
      <Card className="max-w-2xl mx-auto border-0 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-xl text-gray-700">Informações do Pet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Photo Upload */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-slate-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Pet preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Toque para adicionar uma foto</p>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do pet"
                  className="bg-slate-50 border-slate-200 h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tipo *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as 'dog' | 'cat')}
                  className="w-full h-12 px-3 bg-slate-50 border border-slate-200 rounded-md text-gray-700"
                >
                  <option value="dog">Cachorro</option>
                  <option value="cat">Gato</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Raça</label>
                <Input
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="Raça do pet"
                  className="bg-slate-50 border-slate-200 h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Data de Nascimento</label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="bg-slate-50 border-slate-200 h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Sexo</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                  className="w-full h-12 px-3 bg-slate-50 border border-slate-200 rounded-md text-gray-700"
                >
                  <option value="male">Macho</option>
                  <option value="female">Fêmea</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Peso (kg)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Peso em kg"
                  className="bg-slate-50 border-slate-200 h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Cor</label>
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Cor principal"
                  className="bg-slate-50 border-slate-200 h-12"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Temperamento</label>
                <select
                  value={temperamento}
                  onChange={(e) => setTemperamento(e.target.value as 'calmo' | 'medroso' | 'bravo')}
                  className="w-full h-12 px-3 bg-slate-50 border border-slate-200 rounded-md text-gray-700"
                >
                  <option value="calmo">Calmo</option>
                  <option value="medroso">Medroso</option>
                  <option value="bravo">Bravo</option>
                </select>
              </div>
            </div>

            {/* Health Information */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-medium text-gray-700">Informações de Saúde</h3>
              
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Já vacinou?</label>
                  <div className="flex gap-6">
                    {[
                      { value: 'sim', label: 'Sim' },
                      { value: 'nao', label: 'Não' },
                      { value: 'nao_sei', label: 'Não sei' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="vacinado"
                          value={option.value}
                          checked={vacinadoStatus === option.value}
                          onChange={(e) => setVacinadoStatus(e.target.value as 'sim' | 'nao' | 'nao_sei')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {vacinadoStatus === 'sim' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Data da última vacina</label>
                    <Input
                      type="date"
                      value={dataUltimaVacina}
                      onChange={(e) => setDataUltimaVacina(e.target.value)}
                      className="bg-slate-50 border-slate-200 h-12 max-w-xs"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Pet possui alguma condição de saúde?</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="condicao"
                        checked={temCondicao}
                        onChange={() => setTemCondicao(true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">Sim</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="condicao"
                        checked={!temCondicao}
                        onChange={() => {
                          setTemCondicao(false);
                          setQualCondicao('');
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">Não</span>
                    </label>
                  </div>
                </div>

                {temCondicao && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Qual condição?</label>
                    <Input
                      value={qualCondicao}
                      onChange={(e) => setQualCondicao(e.target.value)}
                      placeholder="Descreva a condição de saúde"
                      className="bg-slate-50 border-slate-200 h-12"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isLoading || !name.trim()}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Cadastrando...' : 'Cadastrar Pet'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyPetPage;
