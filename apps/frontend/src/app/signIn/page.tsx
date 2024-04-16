'use client'

import { Input } from "@/components/input";
import { ChangeEvent, useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState<string>();
  const [user, setUser] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [confirmPassword, setConfirmPassword] = useState<string>();

  const handleUserChange = (value: ChangeEvent<HTMLInputElement>) => {
    setUser(value.target.value)
  }

  const handleEmailChange = (value: ChangeEvent<HTMLInputElement>) => {
    setEmail(value.target.value)
  }

  const handlePasswordChange = (value: ChangeEvent<HTMLInputElement>) => {
    setPassword(value.target.value)
  }
  
  const handleConfirmPasswordChange = (value: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(value.target.value)
  }

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="flex flex-col w-80 align-center gap-14 bg-dark-gray p-8 rounded">
        <div className="flex flex-col gap-10 text-black">
          <h3 className="text-lg text-white font-bold"> Cadastrar </h3>
          <div className="flex gap-5 flex-col">
            <Input label="Usuário" type="text" value={user} onChange={handleUserChange} />
            <Input label="Email" type="email" value={password} onChange={handlePasswordChange} />
            <Input label="Senha" type="password" value={user} onChange={handleUserChange} />
            <Input label="Confirmar Senha" type="password" value={password} onChange={handlePasswordChange} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <button className="bg-violet-700 py-2 text-white rounded font-semibold text-sm"> Cadastrar </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;