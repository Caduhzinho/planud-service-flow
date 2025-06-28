
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { LandingHero } from '@/components/landing/LandingHero';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (showLogin) {
    return <LoginForm onBack={() => setShowLogin(false)} onRegister={() => { setShowLogin(false); setShowRegister(true); }} />;
  }

  if (showRegister) {
    return <RegisterForm onBack={() => setShowRegister(false)} onLogin={() => { setShowRegister(false); setShowLogin(true); }} />;
  }

  return <LandingHero onLogin={() => setShowLogin(true)} onRegister={() => setShowRegister(true)} />;
};

export default Index;
