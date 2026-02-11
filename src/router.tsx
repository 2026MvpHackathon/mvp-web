import { createBrowserRouter, Navigate } from 'react-router-dom'
import HomePage from './pages/Home/Home'
import App from './App' 
import AuthPage from './shared/ui/AuthLayout/AuthLayout';
import LoginStep from './pages/Auth/ui/LoginStep/LoginStep';
import SignupStep from './pages/Auth/ui/SiunupStep/SignupStep';
import VerifyStep from './pages/Auth/ui/VerifyStep/VerifyStep';
import SelectLoginOrSignupStep from './pages/Auth/ui/SelectLoginOrSignupStep/SelectLoginOrSignupStep';
import { StudyExpensePage, StudyPage } from './pages/Study/Study';
import QuizPage from './pages/Quiz/Quiz';
import DuringQuizPage from './pages/Quiz/DuringQuiz/DuringQuiz';
import ProtectedRoute from './shared/ui/ProtectedRoute/ProtectedRoute'; // Import ProtectedRoute


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Navigate to="/home" />
            },        
            {
              path: "home",
              element: <ProtectedRoute><HomePage /></ProtectedRoute>, // Protected
            },
            {
                path: "study",
                element: <ProtectedRoute><StudyPage /></ProtectedRoute>, // Protected
            },
            {
                path: "study/:materialId", // New dynamic route
                element: <ProtectedRoute><StudyPage /></ProtectedRoute>, // Protected
            },
            {
                path: "study/expense",
                element: <ProtectedRoute><StudyExpensePage /></ProtectedRoute>, // Protected
            },
            {
                path: "quiz",
                element: <ProtectedRoute><QuizPage /></ProtectedRoute>, // Protected
              },
              {
                path: "quiz/during",
                element: <ProtectedRoute><DuringQuizPage/></ProtectedRoute>, // Protected
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
            }
        ],
    },
])
  
export default router;
