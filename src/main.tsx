import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
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



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [  
      {
        path: '',
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <Home/>
          },
          {
            path: "/election",
            element: <Election/>,
          },
          {
            path: "/special-features",
            element: <SFeatures/>,
          },
          {
            path: "/settings",
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
