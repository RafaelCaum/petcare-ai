
import React from 'react';
import { DollarSign, TrendingUp, Eye } from 'lucide-react';
import { Pet, Expense } from '../../types/pet';
import { Button } from '../ui/button';

interface RecentExpensesProps {
  pets: Pet[];
  expenses: Expense[];
  onViewAll: () => void;
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({
  pets,
  expenses,
  onViewAll,
}) => {
  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : 'Pet desconhecido';
  };

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      vet: 'Veterinário',
      food: 'Alimentação',
      grooming: 'Tosa',
      toys: 'Brinquedos',
      supplies: 'Suprimentos',
      medication: 'Medicação',
      other: 'Outros'
    };
    return categories[category] || category;
  };

  // Pegar as 3 despesas mais recentes
  const recentExpenses = React.useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [expenses]);

  // Calcular total do mês atual
  const monthlyTotal = React.useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && 
               expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <DollarSign className="mr-2 text-blue-600" size={24} />
          Despesas Recentes
        </h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewAll}
          className="flex items-center"
        >
          <Eye size={16} className="mr-1" />
          Ver todas
        </Button>
      </div>

      {/* Total do mês */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total deste mês</p>
            <p className="text-2xl font-bold text-blue-600">
              R$ {monthlyTotal.toFixed(2)}
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="space-y-3">
        {recentExpenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DollarSign size={48} className="mx-auto mb-3 text-gray-300" />
            <p>Nenhuma despesa registrada</p>
            <p className="text-sm">Comece a acompanhar os gastos com seus pets!</p>
          </div>
        ) : (
          recentExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{expense.description}</div>
                  <div className="text-sm text-gray-600">
                    {getPetName(expense.petId)} • {getCategoryName(expense.category)} • {new Date(expense.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
              <div className="font-bold text-green-600">
                R$ {expense.amount.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentExpenses;
