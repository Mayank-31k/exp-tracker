
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Take Control of Your <span className="text-teal-600">Finances</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
          Track your expenses, set budgets, and achieve your financial goals with our easy-to-use budget tracker.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <Button className="text-lg px-8 py-6">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="text-lg px-8 py-6">Log In</Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-4 text-teal-600">📊</div>
          <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
          <p className="text-gray-600">
            Easily log and categorize your spending to see where your money goes.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-4 text-teal-600">💰</div>
          <h3 className="text-xl font-semibold mb-2">Set Budgets</h3>
          <p className="text-gray-600">
            Create customized budgets for different categories to help you stay on track.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="text-3xl mb-4 text-teal-600">📈</div>
          <h3 className="text-xl font-semibold mb-2">Visual Reports</h3>
          <p className="text-gray-600">
            Get insights into your financial habits with intuitive charts and reports.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
