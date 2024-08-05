import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/login/index.tsx'
import SignUp from './pages/signUp/index.tsx'
import Transactions from './pages/transactions/index.tsx'
import Importation from './pages/importation/index.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/transactions",
    element: <Transactions />
  },
  {
    path: "/importation",
    element: <Importation />
    
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signUp",
    element: <SignUp />
   }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
