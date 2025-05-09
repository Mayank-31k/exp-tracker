
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Category, Expense } from '../lib/store';

interface AddExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ExpenseFormData) => void;
  editingExpense: Expense | null;
}

export type ExpenseFormData = {
  amount: number;
  description: string;
  category: Category;
  date: string;
};

const formSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be positive" }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters" }),
  category: z.enum([
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
  ], { message: "Please select a category" }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Please enter a valid date" }),
});

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ open, onOpenChange, onSubmit, editingExpense }) => {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      description: '',
      category: 'other',
      date: new Date().toISOString().substring(0, 10),
    },
  });

  // Reset form with editing data when editingExpense changes
  useEffect(() => {
    if (editingExpense) {
      form.reset({
        amount: editingExpense.amount,
        description: editingExpense.description,
        category: editingExpense.category,
        date: editingExpense.date,
      });
    } else {
      form.reset({
        amount: 0,
        description: '',
        category: 'other',
        date: new Date().toISOString().substring(0, 10),
      });
    }
  }, [editingExpense, form]);

  const handleSubmit = (data: ExpenseFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
          <DialogDescription>
            {editingExpense 
              ? 'Make changes to your expense here.' 
              : 'Enter the details of your new expense.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Grocery shopping" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="housing">Housing</SelectItem>
                      <SelectItem value="transportation">Transportation</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{editingExpense ? 'Update' : 'Add'} Expense</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseForm;
