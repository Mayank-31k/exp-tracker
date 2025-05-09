
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useExpenses, useBudgets, useExpensesByCategory, useExpenseTotal } from '../lib/store';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { IndianRupee } from 'lucide-react';

interface DashboardSummaryProps {
  userId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899', '#14b8a6', '#06b6d4', '#3b82f6', '#a855f7'];

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ userId }) => {
  const expenses = useExpenses(userId);
  const budgets = useBudgets(userId);
  const expensesByCategory = useExpensesByCategory(userId);
  const totalExpenses = useExpenseTotal(userId);

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const budgetUtilization = totalBudget > 0 ? Math.min(100, (totalExpenses / totalBudget) * 100) : 0;

  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount
  }));

  // Prepare line chart data - last 7 days of expenses
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  }).reverse();
  
  const dailyExpenses = last7Days.map(date => {
    const dayExpenses = expenses
      .filter(e => e.date.startsWith(date))
      .reduce((sum, e) => sum + e.amount, 0);
    
    return {
      date: date.slice(5), // Just show MM-DD
      amount: dayExpenses
    };
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center">
            <IndianRupee className="h-5 w-5 mr-1" />
            {totalExpenses.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground flex items-center">
            Budget: <IndianRupee className="h-3 w-3 mx-1" />{totalBudget.toFixed(2)}
          </p>
          <Progress value={budgetUtilization} className="mt-2" />
          <p className="mt-1 text-xs text-muted-foreground">
            {budgetUtilization.toFixed(0)}% of budget used
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No expense data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recent Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyExpenses}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#14b8a6" 
                  strokeWidth={2} 
                  dot={{ r: 3 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
