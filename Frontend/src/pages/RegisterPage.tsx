/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { api } from "../lib/api";
import { saveAuth } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
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
      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      });
      saveAuth(res.data.access_token, res.data.user);
      navigate("/artists");
      window.location.reload();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Falha no registro.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <h1 className="text-xl font-bold">Registrar</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Nome</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            placeholder="Seu nome"
          />
        </div>

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
            placeholder="mínimo 6 caracteres"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Telefone (opcional)</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded-lg"
            placeholder="(21) 99999-0000"
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
          {submitting ? "Registrando..." : "Registrar"}
        </button>
      </form>

      <p className="text-sm text-slate-600">
        Já tem conta?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
