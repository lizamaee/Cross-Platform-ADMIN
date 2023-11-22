import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Landing from './pages/Landing'
import Login from './pages/Login'
import FPassword from './pages/FPassword'
import Register from './pages/Register'
import MVerification from './pages/MVerification'
import CPin from './pages/CPin'
import EPin from './pages/EPin'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import Home from './pages/adminsubpages/home/Home'
import Election from './pages/adminsubpages/election/Election'
import SFeatures from './pages/adminsubpages/features/SFeatures'
import Settings from './pages/adminsubpages/settings/Settings'
import './index.css'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import VoterDashboard from './pages/VoterDashboard'
import VHome from './pages/votersubpages/VHome'
import CVote from './pages/votersubpages/CVote'
import EHistory from './pages/votersubpages/EHistory'
import Developers from './pages/votersubpages/Developers'
import PPolicy from './pages/votersubpages/PPolicy'
import VSettings from './pages/votersubpages/VSettings'
import FVerification from './pages/FVerification'
import RPassword from './pages/RPassword'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import PVerification from './pages/PVerification'
import RPin from './pages/RPin'

const isElectionOngoing = import.meta.env.VITE_ELECTION_STATUS === "ONGOING" ? true : false

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: 1250,
      staleTime: 1000 * 60 * 10
    }
  }
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '',
        element: <Landing />,
      },
      {
        path: 'voter',
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
        path: "enter-pin",
        element: <EPin />
      },
      {
        path: "forgot-pin-verify",
        element: <PVerification />
      },
      {
        path: "reset-pin",
        element: <RPin />
      },
      {
        path: "forgot-password",
        element: <FPassword />
      },
      {
        path: "forgot-password-verify",
        element: <FVerification />
      },
      {
        path: "reset-password",
        element: <RPassword />
      },
      {
        path: "register",
        element: isElectionOngoing ? <Navigate to="/login"/> : <Register/>
      },
      {
        path: "mobile-verification",
        element: <MVerification />
      },
      {
        path: "create-pin",
        element: <CPin />
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
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)
