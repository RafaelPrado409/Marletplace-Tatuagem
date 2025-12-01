import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useNavigate, useParams } from "react-router-dom";

export function AdminStudioEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

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

  async function loadStudio() {
    try {
      const res = await api.get(`/studios/${id}`);
      const s = res.data;

      setName(s.name);
      setCity(s.city);
      setState(s.state);
      setAddress(s.address || "");
      setPhone(s.phone || "");
      setDescription(s.description || "");
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar estúdio.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStudio();
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    try {
      await api.patch(`/studios/admin/${id}`, {
        name,
        city,
        state,
        address: address || null,
        phone: phone || null,
        description: description || null,
      });

      navigate("/admin/studios");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar estúdio.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-sm text-slate-500">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Editar Estúdio
      </h1>

      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {/* Nome */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Nome do estúdio
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Descrição
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Cidade + Estado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Cidade
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Estado
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white text-sm"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {estados.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Endereço */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Endereço
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Telefone
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </main>
  );
}
