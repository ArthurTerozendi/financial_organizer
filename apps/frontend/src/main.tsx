import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/login/index.tsx'
import SignUp from './pages/signUp/index.tsx'
import Transactions from './pages/transactions/index.tsx'
import Importation from './pages/importation/index.tsx'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@emotion/react'

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
]);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)
