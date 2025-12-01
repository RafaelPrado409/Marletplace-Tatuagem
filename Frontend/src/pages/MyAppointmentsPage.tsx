import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

type Appointment = {
  id: string;
  startsAt: string;
  endsAt: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  notes?: string | null;
  artist: {
    id: string;
    displayName: string;
    studio?: {
      id: string;
      name: string;
      city: string;
      state: string;
    };
  };
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function statusBadge(status: Appointment["status"]) {
  const base = "px-2 py-1 rounded-full text-xs font-semibold";
  switch (status) {
    case "PENDING":
      return `${base} bg-yellow-100 text-yellow-800`;
    case "CONFIRMED":
      return `${base} bg-green-100 text-green-800`;
    case "CANCELED":
      return `${base} bg-red-100 text-red-800`;
    case "COMPLETED":
      return `${base} bg-slate-200 text-slate-700`;
    default:
      return base;
  }
}

export function MyAppointmentsPage() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<Appointment[]>("/me/appointments");
        setItems(res.data);
      } catch (e: any) {
        setError(
          e?.response?.status === 401
            ? "Você precisa estar logado para ver seus agendamentos."
            : "Não foi possível carregar seus agendamentos."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return <p className="text-slate-600">Carregando agendamentos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Meus Agendamentos</h1>
        <span className="text-sm text-slate-500">Total: {items.length}</span>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <p className="text-slate-600">
            Você ainda não fez nenhum agendamento.
          </p>
          <Link to="/artists" className="text-blue-600 hover:underline text-sm">
            Explorar artistas
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((ap) => (
            <article
              key={ap.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">
                    {ap.artist.displayName}
                  </h2>
                  {ap.artist.studio && (
                    <p className="text-xs text-slate-500 mt-1">
                      {ap.artist.studio.name} • {ap.artist.studio.city} •{" "}
                      {ap.artist.studio.state}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={statusBadge(ap.status)}>{ap.status}</span>
                </div>
              </div>

              <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm text-slate-700">
                <div>
                  <p className="text-xs text-slate-500">Data</p>
                  <p>{formatDate(ap.startsAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Horário</p>
                  <p>
                    {formatTime(ap.startsAt)} – {formatTime(ap.endsAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Observações</p>
                  <p className="text-slate-600">{ap.notes || "—"}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/artists/${ap.artist.id}`}
                  className="text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
                >
                  Ver artista
                </Link>

                {/* opcional: cancelar (se você criar PATCH no backend) */}
                {/* <button className="text-sm px-3 py-2 rounded-lg border text-red-700 hover:bg-red-50">
                  Cancelar
                </button> */}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
