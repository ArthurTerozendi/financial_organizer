import axios from "axios";
import { Input } from "../../components/input";
import { FC, FormEvent, useCallback, useState } from "react";

type SignUpForm = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

const SignUp: FC = () => {
  const [form, setForm] = useState<SignUpForm>({ email: '', password: '', name: '', confirmPassword: '' });
  
  const handleFormChange = useCallback((value: string, field: keyof SignUpForm) => {
    setForm((oldValue) => ({ ...oldValue, [field]: value }));
  }, [setForm])

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      console.error('Password doesn\'t match');
      return;
    }
  
    axios.post(`http://localhost:8080/api/signUp/`, {
      email: form.email,
      name: form.name,
      password: form.password,
    }).then(
      (result) => console.log(result)
    ).catch(
      (error) => console.error(error)
    )
    
  }, [form]); 

  return (
    <div className="flex w-full h-full items-center justify-center">
      <form className="flex flex-col w-80 align-center gap-14 bg-dark-gray p-8 rounded" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-10 text-black">
          <div>
            <a href="/login" className="text-xs text-right text-slate-400 cursor-pointer hover:underline"> Voltar </a>
            <h3 className="text-lg text-white font-bold"> Cadastrar </h3>
          </div>
          <div className="flex gap-5 flex-col">
            <Input label="Nome" type="text" value={form.name} onChange={(e) => handleFormChange(e.target.value, 'name')} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => handleFormChange(e.target.value, 'email')} />
            <Input label="Senha" type="password" value={form.password} onChange={(e) => handleFormChange(e.target.value, 'password')} />
            <Input label="Confirmar Senha" type="password" value={form.confirmPassword} onChange={(e) => handleFormChange(e.target.value, 'confirmPassword')} />
            
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <input type="submit"  className="bg-purple py-2 text-white rounded font-semibold text-sm" value="Cadastrar" />
        </div>
      </form>
    </div>
  );
}

export default SignUp;