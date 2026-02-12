import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from '@/features/Auth/authApi';
import { useToast } from '@/shared/ui/Toast/ToastContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifyLogin = async () => {
      const loggedIn = await checkLogin();
      setIsLoggedIn(loggedIn);
      setIsLoading(false);

      if (!loggedIn) {
        showToast("로그인이 필요합니다.", "info");
        navigate("/auth/select");
      }
    };

    verifyLogin();
  }, [navigate]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return isLoggedIn ? <>{children}</> : null;
};

export default ProtectedRoute;