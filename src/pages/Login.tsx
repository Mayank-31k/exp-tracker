
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm, { LoginFormData, RegisterFormData } from '../components/AuthForm';
import { useAuth } from '../lib/auth';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data: LoginFormData | RegisterFormData) => {
    if (authMode === 'login') {
      const success = await login((data as LoginFormData).email, (data as LoginFormData).password);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold text-teal-600 mb-2 inline-block">
            BudgetTracker
          </Link>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600">
            Log in to continue managing your finances
          </p>
        </div>
        
        <AuthForm
          mode={authMode}
          onSubmit={handleSubmit}
          toggleMode={() => {
            setAuthMode(authMode === 'login' ? 'register' : 'login');
            navigate(authMode === 'login' ? '/register' : '/login');
          }}
        />
        
        <p className="mt-8 text-center text-sm text-gray-600">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
