import { createBrowserRouter, Navigate } from 'react-router-dom'
import HomePage from './pages/Home/Home'
import App from './App' 
import  { StudyPage } from './pages/Study/Study';
import AuthPage from './shared/ui/AuthLayout';
import LoginStep from './pages/Auth/ui/LoginStep/LoginStep';
import SignupStep from './pages/Auth/ui/SiunupStep/SignupStep';
import VerifyStep from './pages/Auth/ui/VerifyStep/VerifyStep';
import SelectLoginOrSignupStep from './pages/Auth/ui/SelectLoginOrSignupStep/SelectLoginOrSignupStep';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
            index: true,
            element: <Navigate to="/auth/select"/>,
            },
            {
              path: "home",
              element: <HomePage />,
            },
            {
                path: "study",
                element: <StudyPage />,
            },
            {
                path: "/auth",
                element: <AuthPage/>,
                children: [
                    {
                        path: "login",
                        element: <LoginStep/>
                    },
                    {
                        path: "signup",
                        element: <SignupStep/>
                    },
                    {
                        path: "verify",
                        element: <VerifyStep/>
                    },
                    {
                        path: "select",
                        element: <SelectLoginOrSignupStep/>
                    },
                ]
            },
        
        ],
    },

    

    { path: "*", element: <Navigate to='/auth/login'/>  },
])
  
export default router;
