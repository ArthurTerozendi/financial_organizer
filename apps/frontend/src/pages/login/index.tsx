import { FormEvent, useCallback, useEffect, useState } from "react";
import { Input } from "../../components/input";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

type LoginForm = {
  email: string;
  password: string;
}

const Login = () => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });

  const navigate = useNavigate();

  const handleFieldChange = useCallback((value: string, field: keyof LoginForm) => {
    setForm((oldValue) => ({ ...oldValue, [field]: value }));
  }, [setForm])

  const handleFormSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios.post('http://localhost:8080/api/login/', {
      email: form.email,
      password: form.password,
    }).then((result) => {
      localStorage.setItem('jwtToken', result.data.token)

      navigate('/');
    }).catch((error) => console.error(error))
  }, [form, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    if (token) navigate('/');
  }, [navigate])

  return (
    <div className="flex w-full h-full items-center justify-center login-background">
      <form className="flex flex-col w-80 align-center gap-14 bg-dark-gray p-8 rounded" onSubmit={handleFormSubmit}>
        <div className="flex flex-col gap-10 text-black">
          <h3 className="text-lg text-white font-bold"> Entrar </h3>
          <div className="flex gap-5 flex-col">
            <Input label="Email" type="text" value={form.email} onChange={(e) => handleFieldChange(e.target.value, 'email')} />
            <Input label="Senha" type="password" value={form.password} onChange={(e) => handleFieldChange(e.target.value, 'password')} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <input type="submit" value="Entrar" className="bg-purple py-2 text-white rounded font-semibold text-sm" />
          <a href="/signUp" className="text-xs text-right text-slate-400 cursor-pointer hover:underline"> Cadastre-se aqui </a>
        </div>
      </form>
    </div>
  );
}

export default Login;