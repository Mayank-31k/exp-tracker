
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category, Budget } from '../lib/store';
import { IndianRupee } from 'lucide-react';

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  onUpdate: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
}

const categoryIcons: Record<Category, React.ReactNode> = {
  housing: '🏠',
  transportation: '🚗',
  food: '🍔',
  utilities: '💡',
  entertainment: '🎮',
  health: '⚕️',
  shopping: '🛍️',
  personal: '👤',
  education: '🎓',
  income: '💰',
  other: '📦'
};

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, spent, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState(budget.amount);
  
  const percentage = budget.amount > 0 ? Math.min(100, (spent / budget.amount) * 100) : 0;
  const remaining = budget.amount - spent;
  const isOverBudget = remaining < 0;

  const handleSave = () => {
    onUpdate(budget.id, newAmount);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-base justify-between">
          <div className="flex items-center">
            <span className="mr-2 text-xl">{categoryIcons[budget.category]}</span>
            <span>{budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="h-7 px-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            {!isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 px-2 text-red-500 hover:text-red-700"
                onClick={() => onDelete(budget.id)}
              >
                Delete
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(Number(e.target.value))}
              className="w-full"
            />
            <Button onClick={handleSave} className="w-full">Save</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Budget</span>
              <span className="font-semibold flex items-center">
                <IndianRupee className="h-3.5 w-3.5 mr-1" />
                {budget.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">Spent</span>
              <span className="font-semibold flex items-center">
                <IndianRupee className="h-3.5 w-3.5 mr-1" />
                {spent.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-muted-foreground">Remaining</span>
              <span className={`font-semibold flex items-center ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
                <IndianRupee className="h-3.5 w-3.5 mr-1" />
                {remaining.toFixed(2)}
              </span>
            </div>
            <Progress value={percentage} className="mt-2" />
            <p className="mt-1 text-xs text-right text-muted-foreground">
              {percentage.toFixed(0)}% used
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
