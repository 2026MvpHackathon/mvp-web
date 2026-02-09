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
              element: <HomePage />,
            },
            {
                path: "study",
                element: <StudyPage />,
            },
            {
                path: "quiz",
                element: <QuizPage />,
              },
              {
                path: "quiz/:id",
                element: <DuringQuizPage/>,
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
            }],
        
              },
            {
              path: "study/expense",
              element: <StudyExpensePage />,
            },
        ],
)
  
export default router;
