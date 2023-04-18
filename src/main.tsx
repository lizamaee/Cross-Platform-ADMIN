import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DashHome from './pages/subpages/Home'
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
        path: "",
        element: <Login />
      },
      {
        path: "dashboard",
        element: <Dashboard/>,
        children: [
          {
            path: '',
            element: <DashHome/>
          }
        ]
      }
    ],
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
