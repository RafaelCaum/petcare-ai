
import React, { useState } from 'react';
import { Plus, TrendingUp, Calendar, DollarSign, Filter } from 'lucide-react';
import { Expense } from '../types/pet';

interface ExpensesPageProps {
  expenses: Expense[];
  onAddExpense: () => void;
}

const ExpensesPage: React.FC<ExpensesPageProps> = ({ expenses, onAddExpense }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Categories', icon: '📊' },
    { id: 'grooming', label: 'Grooming', icon: '✂️' },
    { id: 'vet', label: 'Veterinary', icon: '🏥' },
    { id: 'food', label: 'Food', icon: '🍽️' },
    { id: 'toys', label: 'Toys', icon: '🎾' },
    { id: 'supplies', label: 'Supplies', icon: '🛍️' },
    { id: 'medication', label: 'Medication', icon: '💊' },
    { id: 'other', label: 'Other', icon: '📋' }
  ];

  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const monthMatch = expenseDate.getMonth() === selectedMonth;
    const yearMatch = expenseDate.getFullYear() === selectedYear;
    const categoryMatch = selectedCategory === 'all' || expense.category === selectedCategory;
    
    return monthMatch && yearMatch && categoryMatch;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const expensesByCategory = categories.slice(1).map(category => {
    const categoryExpenses = filteredExpenses.filter(e => e.category === category.id);
    const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      ...category,
      total,
      count: categoryExpenses.length
    };
  }).filter(category => category.total > 0);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Header */}
      <div className="pet-card bg-gradient-to-br from-success to-success-dark text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <DollarSign className="mr-2" size={24} />
            Pet Expenses
          </h1>
          <button
            onClick={onAddExpense}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold">${totalExpenses.toFixed(2)}</div>
          <div className="text-success-foreground/80">
            {monthNames[selectedMonth]} {selectedYear}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="pet-card">
        <div className="flex items-center mb-4">
          <Filter className="mr-2 text-primary" size={20} />
          <h2 className="font-semibold">Filters</h2>
        </div>
        
        <div className="space-y-4">
          {/* Month/Year Selector */}
          <div className="flex space-x-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {[2024, 2023, 2022].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="grid grid-cols-2 gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Summary */}
      {expensesByCategory.length > 0 && (
        <div className="pet-card">
          <h2 className="font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-primary" size={20} />
            Category Breakdown
          </h2>
          <div className="space-y-3">
            {expensesByCategory.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-xl mr-3">{category.icon}</span>
                  <div>
                    <div className="font-medium">{category.label}</div>
                    <div className="text-sm text-gray-600">{category.count} expenses</div>
                  </div>
                </div>
                <div className="text-lg font-bold text-success">
                  ${category.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense List */}
      <div className="pet-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center">
            <Calendar className="mr-2 text-primary" size={20} />
            Expense History
          </h2>
          <button
            onClick={onAddExpense}
            className="flex items-center text-primary hover:text-primary-dark transition-colors"
          >
            <Plus size={16} className="mr-1" />
            Add
          </button>
        </div>

        {filteredExpenses.length > 0 ? (
          <div className="space-y-3">
            {filteredExpenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((expense) => {
                const category = categories.find(c => c.id === expense.category);
                return (
                  <div key={expense.id} className="expense-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{category?.icon}</span>
                        <div>
                          <div className="font-medium text-green-900">{expense.description}</div>
                          <div className="text-sm text-green-600">
                            {formatDate(expense.date)} • {category?.label}
                          </div>
                          {expense.notes && (
                            <div className="text-xs text-green-500 mt-1">{expense.notes}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-green-700">
                        ${expense.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <DollarSign size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No expenses found</p>
            <p className="text-sm">
              {selectedCategory !== 'all' 
                ? `No ${categories.find(c => c.id === selectedCategory)?.label.toLowerCase()} expenses this month`
                : 'Add your first expense to start tracking'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;
