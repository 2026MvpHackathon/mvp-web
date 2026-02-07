import { createBrowserRouter, Navigate } from 'react-router-dom'
import HomePage from './pages/Home/Home'
import App from './App' 
import  { StudyPage } from './pages/Study/Study';
import AuthLayout from './widgets/AuthLayout/ui/AuthLayout';


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
                path: "auth",
                element: <AuthLayout />,
            },
        ],
    },

    { path: "*", element: <Navigate to='/home'/>  },
])
  
export default router;
