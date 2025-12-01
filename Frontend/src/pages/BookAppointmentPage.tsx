import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import type { Artist } from "../types";

function toISO(date: string, time: string) {
  return new Date(`${date}T${time}:00.000Z`).toISOString();
}

export function BookAppointmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artist, setArtist] = useState<Artist | null>(null);
  const [loadingArtist, setLoadingArtist] = useState(true);

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => localStorage.getItem("access_token"), []);

  useEffect(() => {
    async function loadArtist() {
      try {
        const res = await api.get(`/artists/${id}`);
        setArtist(res.data);
      } catch {
        setArtist(null);
      } finally {
        setLoadingArtist(false);
      }
    }
    loadArtist();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    if (!token) {
      setError("Você precisa estar logado para agendar.");
      return;
    }

    if (!form.date || !form.startTime || !form.endTime) {
      setError("Preencha data e horários.");
      return;
    }

    const startsAt = toISO(form.date, form.startTime);
    const endsAt = toISO(form.date, form.endTime);

    if (new Date(endsAt) <= new Date(startsAt)) {
      setError("Horário final deve ser maior que o inicial.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/appointments", {
        artistId: id,
        startsAt,
        endsAt,
        notes: form.notes || undefined,
      });

      setMsg("Agendamento solicitado com sucesso! Status: PENDING");
      setTimeout(() => navigate(`/artists/${id}`), 1200);
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        "Não foi possível realizar o agendamento.";
      setError(apiMsg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingArtist) return <p className="text-slate-600">Carregando...</p>;
  if (!artist) return <p className="text-slate-500">Artista não encontrado.</p>;

  return (
    <div className="space-y-6">
      <Link
        to={`/artists/${artist.id}`}
        className="text-sm text-slate-600 hover:underline"
      >
        ← Voltar para o artista
      </Link>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-xl font-bold">Agendar com {artist.displayName}</h1>
        <p className="text-sm text-slate-500 mt-1">
          {artist.studio?.name} • {artist.studio?.city}{" "}
          {artist.studio?.state && `• ${artist.studio.state}`}
        </p>
      </section>

      {!token && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl">
          Você ainda não está logado. Quando criarmos a tela de login, você
          poderá agendar.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
      >
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Data</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Início</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Fim</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Observações (opcional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="border p-2 rounded-lg min-h-[90px]"
            placeholder="Descreva a ideia, tamanho, local do corpo..."
          />
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
            {error}
          </div>
        )}

        {msg && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg">
            {msg}
          </div>
        )}

        <button
          disabled={submitting || !token}
          className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? "Enviando..." : "Solicitar agendamento"}
        </button>
      </form>
    </div>
  );
}
