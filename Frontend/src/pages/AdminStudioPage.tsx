import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { NavLink } from "react-router-dom";

type Studio = {
  id: string;
  name: string;
  description?: string | null;
  city: string;
  state: string;
  address: string;
  phone?: string | null;
  createdAt: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  } | null;
  artists: any[];
};

export function AdminStudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [filtered, setFiltered] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const estados = [
    "RJ",
    "SP",
    "MG",
    "ES",
    "RS",
    "SC",
    "PR",
    "BA",
    "PE",
    "CE",
    "GO",
    "MT",
    "MS",
    "DF",
  ];

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<Studio[]>("/studios/admin/all");
      setStudios(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Erro ao carregar estúdios:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    let list = [...studios];

    if (q.trim() !== "") {
      list = list.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
    }

    if (city.trim() !== "") {
      list = list.filter((s) =>
        s.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (state !== "") {
      list = list.filter((s) => s.state === state);
    }

    setFiltered(list);
  }, [q, city, state, studios]);

  async function removeStudio(id: string) {
    if (!confirm("Tem certeza que deseja excluir este estúdio?")) return;

    try {
      await api.delete(`/studios/admin/${id}`);
      await load();
    } catch (err) {
      console.error("Erro ao excluir estúdio:", err);
      alert("Erro ao excluir estúdio.");
    }
  }

  async function editStudio(studio: Studio) {
    const newName = prompt("Novo nome do estúdio:", studio.name);
    if (!newName) return;

    const newCity = prompt("Cidade:", studio.city);
    if (!newCity) return;

    const newState = prompt("Estado (UF):", studio.state);
    if (!newState) return;

    try {
      await api.patch(`/studios/admin/${studio.id}`, {
        name: newName,
        city: newCity,
        state: newState,
      });

      await load();
    } catch (err) {
      console.error("Erro ao editar:", err);
      alert("Erro ao editar estúdio.");
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Administração — Estúdios
          </h1>
          <p className="text-sm text-slate-500">
            Gerencie todos os estúdios cadastrados no sistema.
          </p>
        </div>

        <NavLink
          to="/admin/studios/create"
          className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
        >
          + Cadastrar novo estúdio
        </NavLink>
      </header>

      {/* FILTROS */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 space-y-4">
        <h2 className="text-sm font-semibold text-slate-800">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-slate-600">Nome</label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Buscar por nome..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Cidade</label>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Ex.: Rio de Janeiro"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-slate-600">Estado</label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Todos</option>
              {estados.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-700 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Cidade/Estado</th>
              <th className="px-4 py-3 text-left">Dono</th>
              <th className="px-4 py-3 text-center">Artistas</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  Carregando...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  Nenhum estúdio encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((studio) => (
                <tr key={studio.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{studio.name}</td>

                  <td className="px-4 py-3">
                    {studio.city} — {studio.state}
                  </td>

                  <td className="px-4 py-3">
                    {studio.owner ? (
                      <>
                        {studio.owner.name}
                        <div className="text-xs text-slate-400">
                          {studio.owner.email}
                        </div>
                      </>
                    ) : (
                      <span className="text-slate-400">Sem dono</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {studio.artists.length}
                  </td>

                  <td className="px-4 py-3 text-right flex justify-end gap-2">
                    <NavLink
                      to="/studio/artists"
                      state={{ studioId: studio.id }}
                      className="text-xs bg-slate-200 hover:bg-slate-300 text-slate-900 px-2 py-1 rounded"
                    >
                      Gerenciar artistas
                    </NavLink>

                    <NavLink
                      to={`/admin/studios/edit/${studio.id}`}
                      className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      Editar
                    </NavLink>

                    <button
                      onClick={() => removeStudio(studio.id)}
                      className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
