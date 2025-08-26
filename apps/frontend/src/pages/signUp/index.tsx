import axios from "axios";
import { Input } from "../../components/input";
import { FC, FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

type SignUpForm = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
};

const SignUp: FC = () => {
  const [form, setForm] = useState<SignUpForm>({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );
  const navigate = useNavigate();

  const handleFormChange = useCallback(
    (value: string, field: keyof SignUpForm) => {
      setForm((oldValue) => ({ ...oldValue, [field]: value }));
    },
    [setForm],
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorMessage(null);

      if (form.password !== form.confirmPassword) {
        setErrorMessage("As senhas não conferem.");
        return;
      }

      axios
        .post(import.meta.env.VITE_API_URL + "/signUp/", {
          email: form.email,
          name: form.name,
          password: form.password,
        })
        .then(() => {
          navigate("/login");
        })
        .catch((error) => {
          const apiMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Falha ao cadastrar. Tente novamente.";
          setErrorMessage(apiMessage);
        });
    },
    [form, navigate],
  );

  return (
    <div className="flex w-full h-full items-center justify-center">
      <form
        className="flex flex-col w-80 align-center gap-14 bg-md-gray p-8 rounded"
        onSubmit={handleSubmit}
      >
        {errorMessage && (
          <div className="text-sm text-red-400 bg-red-900/20 border border-red-500/40 rounded p-2">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col gap-10 text-black">
          <div>
            <a
              href="/login"
              className="text-xs text-right text-slate-400 cursor-pointer hover:underline"
            >
              {" "}
              Voltar{" "}
            </a>
            <h3 className="text-lg text-white font-bold"> Cadastrar </h3>
          </div>
          <div className="flex gap-5 flex-col">
            <Input
              label="Nome"
              type="text"
              value={form.name}
              onChange={(e) => handleFormChange(e.target.value, "name")}
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => handleFormChange(e.target.value, "email")}
            />
            <Input
              label="Senha"
              type="password"
              value={form.password}
              onChange={(e) => handleFormChange(e.target.value, "password")}
            />
            <Input
              label="Confirmar Senha"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                handleFormChange(e.target.value, "confirmPassword")
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 cursor-pointer">
          <input
            type="submit"
            className="bg-purple py-2 text-white rounded font-semibold text-sm cursor-pointer"
            value="Cadastrar"
          />
        </div>
      </form>
    </div>
  );
};

export default SignUp;
