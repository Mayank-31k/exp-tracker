
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import DashboardSummary from '../components/DashboardSummary';
import { useStore, useExpenses } from '../lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const expenses = useExpenses(user?.id || '');

  // Get recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => navigate('/expenses')}>Manage Expenses</Button>
      </div>

      {/* Dashboard Summary */}
      <DashboardSummary userId={user.id} />

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="px-6">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest expense entries</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border rounded-md border">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.date} · {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                    </p>
                  </div>
                  <p className="font-medium flex items-center">
                    <IndianRupee className="h-3.5 w-3.5 mr-1" />
                    {expense.amount.toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No recent transactions
              </div>
            )}
          </div>
          {recentExpenses.length > 0 && (
            <div className="p-4 text-center">
              <Button variant="ghost" onClick={() => navigate('/expenses')}>
                View All Transactions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
