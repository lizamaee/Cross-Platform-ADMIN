import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import Home from './pages/adminsubpages/Home'
import Election from './pages/adminsubpages/Election'
import SFeatures from './pages/adminsubpages/SFeatures'
import Settings from './pages/adminsubpages/Settings'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import VoterDashboard from './pages/VoterDashboard'
import VHome from './pages/votersubpages/VHome'
import CVote from './pages/votersubpages/CVote'
import EHistory from './pages/votersubpages/EHistory'
import Developers from './pages/votersubpages/Developers'
import PPolicy from './pages/votersubpages/PPolicy'
import VSettings from './pages/votersubpages/VSettings'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '',
        element: <VoterDashboard />,
        children: [
          {
            path: '*',
            element: <VHome/>
          },
          {
            path: 'dashboard',
            index: true,
            element: <VHome/>
          },
          {
            path: 'cast-vote',
            element: <CVote/>
          },
          {
            path: 'election-history',
            element: <EHistory/>
          },
          {
            path: 'developers',
            element: <Developers/>
          },
          {
            path: 'privacy-policy',
            element: <PPolicy/>
          },
          {
            path: 'settings',
            element: <VSettings/>
          }
        ]
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
        children: [
          {
            path: '*',
            element: <Home/>
          },
          {
            path: "dashboard",
            index: true,
            element: <Home />
          },
          {
            path: "election",
            element: <Election />,
          },
          {
            path: "special-features",
            element: <SFeatures />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ]
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
