import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from './pages/Home/Home'
import { StudyPage } from './pages/Study/Study'
import App from './App' 


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
            index: true,
            element: <HomePage />,
            },
        {
          path: 'study',
          element: <StudyPage />,
        },
        ],
    },
])
  
export default router;