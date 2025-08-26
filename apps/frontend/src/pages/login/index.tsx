import { FormEvent, useCallback, useState } from "react";
import { Input } from "../../components/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleFieldChange = useCallback(
    (value: string, field: keyof LoginForm) => {
      setForm((oldValue) => ({ ...oldValue, [field]: value }));
    },
    [setForm],
  );

  const handleFormSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorMessage(null);

      axios
        .post(import.meta.env.VITE_API_URL + "/login/", {
          email: form.email,
          password: form.password,
        })
        .then((result) => {
          localStorage.setItem("jwtToken", result.data.token);

          navigate("/");
        })
        .catch((error) => {
          const apiMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Falha no login. Verifique suas credenciais.";
          setErrorMessage(apiMessage);
        });
    },
    [form, navigate],
  );

  return (
    <div className="flex w-full min-h-screen items-center justify-center login-background px-4">
      <form
        className="flex flex-col w-full max-w-sm align-center gap-8 md:gap-14 bg-md-gray p-6 md:p-8 rounded-lg shadow-lg"
        onSubmit={handleFormSubmit}
      >
        {(errorMessage) && (
          <div className="text-sm text-red-400 bg-red-900/20 border border-red-500/40 rounded p-2">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col gap-6 md:gap-10 text-black">
          <h3 className="text-xl md:text-2xl text-white font-bold text-center">
            Login to Financial Organizer
          </h3>
          <div className="flex gap-4 md:gap-5 flex-col">
            <Input
              label="Email"
              type="text"
              value={form.email}
              onChange={(e) => handleFieldChange(e.target.value, "email")}
            />
            <Input
              label="Senha"
              type="password"
              value={form.password}
              onChange={(e) => handleFieldChange(e.target.value, "password")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="bg-purple hover:bg-dark-purple py-3 text-white rounded-lg font-semibold text-sm transition-colors duration-200"
          >
            Login
          </button>
          <div className="flex flex-row gap-1">
            <span className="text-sm text-slate-400">
              Don't have an account?
            </span>
            <a
              href="/signUp"
              className="text-sm text-center text-slate-400 cursor-pointer hover:text-white hover:underline transition-colors duration-200"
            >
              Sign up here
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
