'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Dashboard />;
}
