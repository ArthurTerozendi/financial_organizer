import { useEffect, useState } from 'react'
import './App.css'
import { Login } from './pages/login'

function App() {
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) setIsLogged(true);
    else setIsLogged(false)
  }, [])

  if (!isLogged) {
    return <Login/>
  }
  return (
    <div>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </div>
  )
}

export default App
