import { useState } from "react";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";

export function AdminStudioCreatePage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !city || !state) {
      alert("Preencha ao menos nome, cidade e estado.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/studios/admin", {
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
      alert("Erro ao criar estúdio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Cadastrar Estúdio
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {/* Nome */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Nome do estúdio *
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Ink House Studio"
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Descrição (opcional)
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Breve descrição do estúdio..."
          />
        </div>

        {/* Cidade + Estado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Cidade *
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex.: Rio de Janeiro"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Estado *
            </label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
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
            Endereço (opcional)
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Rua X, 123"
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Telefone (opcional)
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(21) 99999-0000"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 text-white py-2 text-sm font-medium hover:bg-black disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Cadastrar estúdio"}
        </button>
      </form>
    </main>
  );
}
