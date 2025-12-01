import { useEffect, useState } from "react";
import { api } from "../lib/api";

type Studio = {
  id: string;
  name: string;
  description?: string | null;
  city: string;
  state: string;
  address: string;
  phone?: string | null;
};

export function StudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const estados = ["RJ", "SP", "MG", "ES", "RS", "SC", "PR", "BA", "PE", "CE"];

  async function loadStudios(params?: {
    q?: string;
    city?: string;
    state?: string;
  }) {
    try {
      setLoading(true);

      const res = await api.get<Studio[]>("/studios", {
        params: {
          q: params?.q || undefined,
          city: params?.city || undefined,
          state: params?.state || undefined,
        },
      });

      setStudios(res.data);
    } catch (err) {
      console.error("Erro ao carregar estúdios:", err);
      setStudios([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      void loadStudios({ q, city, state });
    }, 400);

    return () => clearTimeout(handler);
  }, [q, city, state]);

  useEffect(() => {
    void loadStudios();
  }, []);

  function handleClear() {
    setQ("");
    setCity("");
    setState("");
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Estúdios
        </h1>
        <p className="text-sm text-slate-500">
          Encontre estúdios por nome, cidade ou estado.
        </p>
      </header>

      {/* Filtros */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Busca
            </label>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nome do estúdio, estilo, bairro..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
            />
          </div>

          <div className="md:w-48">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Cidade
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex.: Rio de Janeiro"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
            />
          </div>

          <div className="md:w-32">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Estado
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
            >
              <option value="">Todos</option>
              {estados.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Limpar
            </button>
          </div>
        </div>
      </section>

      {/* Lista de estúdios */}
      <section>
        {loading ? (
          <p className="text-sm text-slate-500">Carregando estúdios...</p>
        ) : studios.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhum estúdio encontrado com os filtros informados.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studios.map((studio) => (
              <div
                key={studio.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <h2 className="text-sm font-semibold text-slate-900">
                  {studio.name}
                </h2>
                <p className="text-xs text-slate-500 mb-1">
                  {studio.city} – {studio.state}
                </p>
                {studio.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                    {studio.description}
                  </p>
                )}
                <a
                  href={`/studios/${studio.id}`}
                  className="text-xs font-medium text-slate-900 hover:underline"
                >
                  Ver detalhes
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
