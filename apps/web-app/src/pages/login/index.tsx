import { ChangeEvent, useState } from "react";
import { Input } from "../../components/input";

export const Login = () => {
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
      <div className="flex flex-col w-64 align-center gap-8 bg-dark-gray p-8 rounded">
        <h3 className="text-lg text-white font-bold"> Entrar </h3>
        <Input label="Usuário" type="text" value={user} onChange={handleUserChange} />
        <Input label="Senha" type="password" value={password} onChange={handlePasswordChange} />
        <button className="bg-violet-700 p-1 text-white rounded font-semibold"> Entrar </button>
      </div>
    </div>
  );
}