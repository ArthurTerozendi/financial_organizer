import { FormEvent, useCallback, useEffect, useState } from "react";
import { Input } from "../../components/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

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

      axios
        .post("http://localhost:8080/api/login/", {
          email: form.email,
          password: form.password,
        })
        .then((result) => {
          localStorage.setItem("jwtToken", result.data.token);

          navigate("/");
        })
        .catch((error) => console.error(error));
    },
    [form, navigate],
  );

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (token) navigate("/");
  }, [navigate]);

  return (
    <div className="flex w-full min-h-screen items-center justify-center login-background px-4">
      <form
        className="flex flex-col w-full max-w-sm align-center gap-8 md:gap-14 bg-md-gray p-6 md:p-8 rounded-lg shadow-lg"
        onSubmit={handleFormSubmit}
      >
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
          <a
            href="/signUp"
            className="text-sm text-center text-slate-400 cursor-pointer hover:text-white transition-colors duration-200"
          >
            Don't have an account? Sign up here
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
