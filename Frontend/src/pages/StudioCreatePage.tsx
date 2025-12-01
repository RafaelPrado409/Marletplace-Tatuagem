import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/auth";
import { api } from "../lib/api";

interface StudioFormState {
  name: string;
  description: string;
  city: string;
  state: string;
  address: string;
  phone: string;
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 2) {
    return `(${digits}`;
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function StudioCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<StudioFormState>({
    name: "",
    description: "",
    city: "",
    state: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getUser();

    if (!user) {
      navigate("/login");
      return;
    }

    async function checkStudio() {
      try {
        const res = await api.get("/me/studios");
        const studios = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.studios)
          ? res.data.studios
          : [];

        if (studios.length > 0) {
          navigate("/studio/dashboard");
          return;
        }
      } catch (err) {
        console.error("Erro ao verificar estúdio:", err);
      } finally {
        setLoading(false);
      }
    }

    void checkStudio();
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.post("/studios/my", form);
      navigate("/studios/dashboard");
    } catch (err: any) {
      console.error(err);
      const message = err?.response?.data?.message || "Erro ao criar estúdio.";
      setError(Array.isArray(message) ? message.join(", ") : String(message));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm text-slate-500">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Crie o seu estúdio
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xl">
          Cadastre as informações principais do seu estúdio para começar a
          gerenciar artistas e receber agendamentos pelo marketplace.
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do estúdio
            </label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <input
              type="text"
              maxLength={15}
              placeholder="(21) 98765-4321"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={form.phone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  phone: maskPhone(e.target.value),
                }))
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cidade</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={form.city}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, city: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={form.state}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, state: e.target.value }))
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={form.address}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, address: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Descrição do estúdio
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Fale um pouco sobre o estilo do estúdio, ambiente, diferenciais..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Criando estúdio..." : "Criar estúdio"}
        </button>
      </form>
    </main>
  );
}
