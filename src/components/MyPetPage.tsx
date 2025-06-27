
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Camera, Save, Heart, Plus, Edit, Trash2 } from 'lucide-react';
import { Pet } from '../types/pet';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { toast } from 'sonner';
import PetAvatar from './PetAvatar';

interface MyPetPageProps {
  userEmail: string;
}

const MyPetPage: React.FC<MyPetPageProps> = ({ userEmail }) => {
  const { pets, addPet, updatePet, deletePet } = useSupabaseData(userEmail);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
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

  const resetForm = () => {
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
    setEditingPet(null);
  };

  const handleAddPet = () => {
    setShowForm(true);
    resetForm();
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setName(pet.name);
    setType(pet.type);
    setBreed(pet.breed || '');
    setBirthDate(pet.birthDate || '');
    setGender(pet.gender || 'male');
    setWeight(pet.weight?.toString() || '');
    setColor(pet.color || '');
    setVacinadoStatus(pet.vacinadoStatus || 'nao_sei');
    setDataUltimaVacina(pet.dataUltimaVacina || '');
    setTemperamento(pet.temperamento || 'calmo');
    setTemCondicao(pet.temCondicao || false);
    setQualCondicao(pet.qualCondicao || '');
    setPhotoPreview(pet.photoUrl || null);
    setShowForm(true);
  };

  const handleDeletePet = async (pet: Pet) => {
    if (window.confirm(`Tem certeza que deseja excluir ${pet.name}?`)) {
      try {
        await deletePet(pet.id);
        toast.success('Pet excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir pet');
      }
    }
  };

  const sendToN8N = async (petData: any) => {
    try {
      const webhookData = {
        user_email: userEmail,
        pet_data: petData,
        timestamp: new Date().toISOString(),
        action: 'pet_registered'
      };
      
      console.log('Data that would be sent to n8n:', webhookData);
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

      let savedPet;
      if (editingPet) {
        savedPet = await updatePet(editingPet.id, petData, selectedFile || undefined);
        toast.success('Pet atualizado com sucesso!');
      } else {
        savedPet = await addPet(petData, selectedFile || undefined);
        if (savedPet) {
          await sendToN8N({
            ...petData,
            id: savedPet.id,
            photoUrl: savedPet.photoUrl
          });
        }
        toast.success('Pet cadastrado com sucesso!');
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving pet:', error);
      toast.error('Erro ao salvar pet. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-white p-6 font-['Inter']" style={{ backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-semibold" style={{ color: '#333' }}>
              {editingPet ? 'Editar Pet' : 'Cadastro do Pet'}
            </h1>
          </div>
          <p className="text-gray-600">
            {editingPet ? 'Atualize as informações do seu pet' : 'Vamos conhecer melhor seu companheiro'}
          </p>
        </div>

        {/* Form */}
        <Card className="max-w-2xl mx-auto border-0 shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl" style={{ color: '#333' }}>Informações do Pet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Photo Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>
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
                  <label className="text-sm font-medium" style={{ color: '#333' }}>Nome *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome do pet"
                    className="h-12 border-slate-200"
                    style={{ backgroundColor: '#F1F5F9' }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: '#333' }}>Tipo *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'dog' | 'cat')}
                    className="w-full h-12 px-3 border border-slate-200 rounded-md"
                    style={{ backgroundColor: '#F1F5F9', color: '#333' }}
                  >
                    <option value="dog">Cachorro</option>
                    <option value="cat">Gato</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: '#333' }}>Raça</label>
                  <Input
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="Raça do pet"
                    className="h-12 border-slate-200"
                    style={{ backgroundColor: '#F1F5F9' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: '#333' }}>Data de Nascimento</label>
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="h-12 border-slate-200"
                    style={{ backgroundColor: '#F1F5F9' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: '#333' }}>Sexo</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    className="w-full h-12 px-3 border border-slate-200 rounded-md"
                    style={{ backgroundColor: '#F1F5F9', color: '#333' }}
                  >
                    <option value="male">Macho</option>
                    <option value="female">Fêmea</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: '#333' }}>Peso (kg)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Peso em kg"
                    className="h-12 border-slate-200"
                    style={{ backgroundColor: '#F1F5F9' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: '#333' }}>Cor</label>
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Cor principal"
                    className="h-12 border-slate-200"
                    style={{ backgroundColor: '#F1F5F9' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{ color: '#333' }}>Temperamento</label>
                  <select
                    value={temperamento}
                    onChange={(e) => setTemperamento(e.target.value as 'calmo' | 'medroso' | 'bravo')}
                    className="w-full h-12 px-3 border border-slate-200 rounded-md"
                    style={{ backgroundColor: '#F1F5F9', color: '#333' }}
                  >
                    <option value="calmo">Calmo</option>
                    <option value="medroso">Medroso</option>
                    <option value="bravo">Bravo</option>
                  </select>
                </div>
              </div>

              {/* Health Information */}
              <div className="space-y-6 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-medium" style={{ color: '#333' }}>Informações de Saúde</h3>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium" style={{ color: '#333' }}>Já vacinou?</label>
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
                          <span style={{ color: '#333' }}>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {vacinadoStatus === 'sim' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: '#333' }}>Data da última vacina</label>
                      <Input
                        type="date"
                        value={dataUltimaVacina}
                        onChange={(e) => setDataUltimaVacina(e.target.value)}
                        className="h-12 max-w-xs border-slate-200"
                        style={{ backgroundColor: '#F1F5F9' }}
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="text-sm font-medium" style={{ color: '#333' }}>Pet possui alguma condição de saúde?</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="condicao"
                          checked={temCondicao}
                          onChange={() => setTemCondicao(true)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span style={{ color: '#333' }}>Sim</span>
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
                        <span style={{ color: '#333' }}>Não</span>
                      </label>
                    </div>
                  </div>

                  {temCondicao && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: '#333' }}>Qual condição?</label>
                      <Input
                        value={qualCondicao}
                        onChange={(e) => setQualCondicao(e.target.value)}
                        placeholder="Descreva a condição de saúde"
                        className="h-12 border-slate-200"
                        style={{ backgroundColor: '#F1F5F9' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  variant="outline"
                  className="flex-1 h-12"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Salvando...' : editingPet ? 'Atualizar Pet' : 'Cadastrar Pet'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 font-['Inter']" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-semibold" style={{ color: '#333' }}>Meus Pets</h1>
        </div>
        <p className="text-gray-600">Gerencie as informações dos seus pets</p>
      </div>

      {/* Add Pet Button */}
      <div className="max-w-2xl mx-auto mb-6">
        <Button
          onClick={handleAddPet}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Cadastrar Pet
        </Button>
      </div>

      {/* Pets List */}
      <div className="max-w-2xl mx-auto space-y-4">
        {pets.length === 0 ? (
          <Card className="border-0 shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🐕</div>
              <h2 className="text-xl font-bold text-gray-700 mb-2">Nenhum pet cadastrado</h2>
              <p className="text-gray-500">Adicione seu primeiro pet para começar!</p>
            </CardContent>
          </Card>
        ) : (
          pets.map((pet) => (
            <Card key={pet.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: '#FFFFFF' }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <PetAvatar pet={pet} size="medium" />
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: '#333' }}>{pet.name}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{pet.type === 'dog' ? '🐕 Cachorro' : '🐱 Gato'} {pet.breed && `• ${pet.breed}`}</p>
                        {pet.birthDate && <p>📅 {new Date(pet.birthDate).toLocaleDateString('pt-BR')}</p>}
                        {pet.weight && <p>⚖️ {pet.weight}kg</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditPet(pet)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeletePet(pet)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyPetPage;
