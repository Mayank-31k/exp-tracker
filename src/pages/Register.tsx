
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm, { LoginFormData, RegisterFormData } from '../components/AuthForm';
import { useAuth } from '../lib/auth';

const Register = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (data: LoginFormData | RegisterFormData) => {
    if (authMode === 'register') {
      const registerData = data as RegisterFormData;
      const success = await register(registerData.name, registerData.email, registerData.password);
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
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-gray-600">
            Start managing your finances today
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
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Register;
