/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { api } from "../lib/api";
import { saveAuth } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await api.post("/auth/login", form);
      saveAuth(res.data.access_token, res.data.user);
      navigate("/artists");
      window.location.reload();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Falha no login.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <h1 className="text-xl font-bold">Entrar</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            placeholder="seuemail@exemplo.com"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Senha</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            placeholder="********"
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          disabled={submitting}
          className="mt-2 w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-sm text-slate-600">
        Não tem conta?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Registrar
        </Link>
      </p>
    </div>
  );
}
