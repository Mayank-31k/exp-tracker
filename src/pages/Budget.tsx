
import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import BudgetCard from '../components/BudgetCard';
import { type Budget as BudgetType, Category } from '../lib/store'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader,
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { useStore, useExpenses, useBudgets, useExpensesByCategory } from '../lib/store';
import { IndianRupee } from 'lucide-react';

const Budget = () => {
  const { user } = useAuth();
  const { state, dispatch } = useStore();
  const budgets = useBudgets(user?.id || '');
  const expenses = useExpenses(user?.id || '');
  const expensesByCategory = useExpensesByCategory(user?.id || '');
  
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category>('housing');
  const [amount, setAmount] = useState(0);

  const handleAddBudget = () => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to add a budget.",
        variant: "destructive",
      });
      return;
    }

    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    const newBudget: BudgetType = {
      id: `budget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: category,
      amount: amount,
      userId: user.id,
    };

    dispatch({ type: 'ADD_BUDGET', payload: newBudget });
    setOpen(false);
    setAmount(0);
    toast({
      title: "Budget added",
      description: `Budget for ${category} added successfully.`,
    });
  };

  const handleUpdateBudget = (id: string, amount: number) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to update a budget.",
        variant: "destructive",
      });
      return;
    }

    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    const updatedBudget: BudgetType = {
      id: id,
      category: budgets.find(budget => budget.id === id)?.category || 'housing',
      amount: amount,
      userId: user.id,
    };

    dispatch({ type: 'UPDATE_BUDGET', payload: updatedBudget });
    toast({
      title: "Budget updated",
      description: `Budget updated successfully.`,
    });
  };

  const handleDeleteBudget = (id: string) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to delete a budget.",
        variant: "destructive",
      });
      return;
    }

    dispatch({ type: 'DELETE_BUDGET', payload: id });
    toast({
      title: "Budget deleted",
      description: `Budget deleted successfully.`,
    });
  };

  const categories: Category[] = [
    'housing',
    'transportation',
    'food',
    'utilities',
    'entertainment',
    'health',
    'shopping',
    'personal',
    'education',
    'income',
    'other'
  ];

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Budgets</CardTitle>
          <CardDescription>Manage your budgets and track your spending.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {budgets.map((budget) => {
                  const spent = expensesByCategory[budget.category] || 0;
                  return (
                    <BudgetCard
                      key={budget.id}
                      budget={budget}
                      spent={spent}
                      onUpdate={handleUpdateBudget}
                      onDelete={handleDeleteBudget}
                    />
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="manage">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>Add Budget</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Budget</DialogTitle>
                    <DialogDescription>
                      Allocate a budget for a specific category.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="category" className="text-right">
                        Category
                      </label>
                      <Select onValueChange={(value) => setCategory(value as Category)} defaultValue={category} >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="amount" className="text-right">
                        Amount
                      </label>
                      <div className="col-span-3 flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1 text-gray-500" />
                        <Input
                          type="number"
                          id="amount"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" onClick={handleAddBudget}>
                      Add Budget
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Budget;
