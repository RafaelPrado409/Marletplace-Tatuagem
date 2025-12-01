import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Style } from "../types";

type NewStyleForm = {
  name: string;
  slug: string;
};

export function AdminStylesPage() {
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<NewStyleForm>({
    name: "",
    slug: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadStyles() {
    try {
      setLoading(true);
      const res = await api.get<Style[]>("/styles");
      setStyles(res.data);
    } catch (e: any) {
      setError("Não foi possível carregar os estilos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStyles();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!form.name || !form.slug) {
      setError("Preencha nome e slug.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post<Style>("/styles", {
        name: form.name,
        slug: form.slug,
      });

      setStyles((prev) => [res.data, ...prev]);
      setForm({ name: "", slug: "" });
      setMessage("Estilo cadastrado com sucesso.");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Falha ao cadastrar estilo.";
      setError(Array.isArray(msg) ? msg.join(" ") : msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Administração de Estilos</h1>
        <p className="text-sm text-slate-500">
          Cadastre e gerencie estilos de tatuagem usados no marketplace.
        </p>
      </div>

      {/* Formulário */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold">Novo estilo</h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4 items-end"
        >
          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-sm font-medium">Nome</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              placeholder="Ex: Realismo, Old School..."
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-sm font-medium">Slug</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              placeholder="ex: realismo, old-school"
            />
          </div>

          <div className="md:col-span-1 flex flex-col gap-2">
            <button
              disabled={submitting}
              className="mt-5 md:mt-0 w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
            >
              {submitting ? "Cadastrando..." : "Cadastrar estilo"}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg">
            {message}
          </div>
        )}
      </section>

      {/* Lista */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Estilos cadastrados</h2>
          <span className="text-sm text-slate-500">Total: {styles.length}</span>
        </div>

        {loading ? (
          <p className="text-slate-600">Carregando estilos...</p>
        ) : styles.length === 0 ? (
          <p className="text-slate-500">Nenhum estilo cadastrado ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">Slug</th>
                  <th className="py-2 pr-4">ID</th>
                </tr>
              </thead>
              <tbody>
                {styles.map((s) => (
                  <tr key={s.id} className="border-b last:border-b-0">
                    <td className="py-2 pr-4">{s.name}</td>
                    <td className="py-2 pr-4 text-slate-600">{s.slug}</td>
                    <td className="py-2 pr-4 text-xs text-slate-400">{s.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
