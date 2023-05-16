import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import Home from './pages/subpages/Home'
import Election from './pages/subpages/Election'
import SFeatures from './pages/subpages/SFeatures'
import Settings from './pages/subpages/Settings'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import VoterDashboard from './pages/VoterDashboard'



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [  
      
      {
        path: '',
        element: <VoterDashboard/>
      },
      {
        path: '/admin',
        element: <AdminDashboard />,
        children: [
          {
            index: true,
            element: <Home/>
          },
          {
            path: "/admin/election",
            element: <Election/>,
          },
          {
            path: "/admin/special-features",
            element: <SFeatures/>,
          },
          {
            path: "/admin/settings",
            element: <Settings/>,
          }
        ]
      },  
      {
        path: "login",
        element: <Login/>
      },
      {
        path: "*",
        element: <NotFound />
      }
    ],
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
