import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLogin } from '@/features/Auth/authApi';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verifyLogin = async () => {
      const loggedIn = await checkLogin();
      setIsLoggedIn(loggedIn);
      setIsLoading(false);

      if (!loggedIn) {
        console.warn("로그인하세요."); // Changed to warn, as it's an important user message
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