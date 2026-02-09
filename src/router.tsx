import { createBrowserRouter, Navigate } from 'react-router-dom'
import HomePage from './pages/Home/Home'
import App from './App' 
import { StudyExpensePage, StudyPage } from './pages/Study/Study';
import QuizPage from './pages/Quiz/Quiz';
import DuringQuizPage from './pages/Quiz/DuringQuiz';


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
            index: true,
            element: <Navigate to="/home"/>,
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
              path: "study/expense",
              element: <StudyExpensePage />,
            },
            {
              path: "quiz",
              element: <DuringQuizPage />,
            },
        ],
    },

    { path: "*", element: <Navigate to='/home'/>  },
])
  
export default router;
