'use client'
import { ChangeEvent, useState } from "react";
import { Input } from "../../components/input";
import Link from "next/link";

const Login = () => {
  const [user, setUser] = useState<string>();
  const [password, setPassword] = useState<string>();

  const handleUserChange = (value: ChangeEvent<HTMLInputElement>) => {
    setUser(value.target.value)
  }

  const handlePasswordChange = (value: ChangeEvent<HTMLInputElement>) => {
    setPassword(value.target.value)
  }

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="flex flex-col w-80 align-center gap-14 bg-dark-gray p-8 rounded">
        <div className="flex flex-col gap-10 text-black">
          <h3 className="text-lg text-white font-bold"> Entrar </h3>
          <div className="flex gap-5 flex-col">
            <Input label="Usuário" type="text" value={user} onChange={handleUserChange} />
            <Input label="Senha" type="password" value={password} onChange={handlePasswordChange} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <button className="bg-violet-700 py-2 text-white rounded font-semibold text-sm"> Entrar </button>
          <Link href="/signIn" className="text-xs text-right text-slate-400 cursor-pointer hover:underline"> Cadastre-se aqui </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;