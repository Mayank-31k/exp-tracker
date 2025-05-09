
import React, { useState, useCallback } from 'react';
import { useAuth } from '../lib/auth';
import { useExpenses, useStore, Expense, Category } from '../lib/store';
import ExpenseList from '../components/ExpenseList';
import AddExpenseForm, { ExpenseFormData } from '../components/AddExpenseForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Expenses = () => {
  const { user } = useAuth();
  const { state, dispatch } = useStore();
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  const expenses = useExpenses(user?.id || '');

  const handleAddExpense = useCallback((data: ExpenseFormData) => {
    if (!user) return;
    
    if (editingExpense) {
      // Update existing expense
      const updatedExpense = {
        ...editingExpense,
        ...data
      };
      
      dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
      
      toast({
        title: "Expense updated",
        description: "Your expense has been updated successfully",
      });
      
      setEditingExpense(null);
    } else {
      // Add new expense
      const newExpense: Expense = {
        id: `expense-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        ...data
      };
      
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
      
      toast({
        title: "Expense added",
        description: "Your expense has been added successfully",
      });
    }
    
    setIsFormOpen(false);
  }, [dispatch, editingExpense, toast, user]);

  const handleEditExpense = useCallback((expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  }, []);

  const handleDeleteExpense = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id });
    
    toast({
      title: "Expense deleted",
      description: "Your expense has been removed",
    });
  }, [dispatch, toast]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Manage and track all your expenses
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingExpense(null);
            setIsFormOpen(true);
          }}
        >
          Add Expense
        </Button>
      </div>

      <ExpenseList 
        expenses={expenses} 
        onEdit={handleEditExpense} 
        onDelete={handleDeleteExpense} 
      />

      <AddExpenseForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onSubmit={handleAddExpense} 
        editingExpense={editingExpense} 
      />
    </div>
  );
};

export default Expenses;
