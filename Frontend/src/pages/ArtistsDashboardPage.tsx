import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

type ArtistAppointment = {
  id: string;
  startsAt: string;
  endsAt: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  notes?: string | null;
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
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

function statusBadge(status: ArtistAppointment["status"]) {
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

export function ArtistDashboardPage() {
  const [items, setItems] = useState<ArtistAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<ArtistAppointment[]>(
          "/me/artist/appointments"
        );
        setItems(res.data);
      } catch (e: any) {
        setError(
          e?.response?.status === 401
            ? "Você precisa estar logado como artista para ver este painel."
            : "Não foi possível carregar os agendamentos do artista."
        );
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-slate-600">Carregando painel...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const upcoming = items.filter(
    (a) => new Date(a.startsAt) >= new Date() && a.status !== "CANCELED"
  );
  const past = items.filter((a) => new Date(a.startsAt) < new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Painel do Artista</h1>
          <p className="text-sm text-slate-500">
            Gerencie os agendamentos recebidos.
          </p>
        </div>
        <span className="text-sm text-slate-500">Total: {items.length}</span>
      </div>

      {/* Próximos */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Próximos agendamentos</h2>

        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhum agendamento futuro no momento.
          </p>
        ) : (
          <div className="grid gap-4">
            {upcoming.map((ap) => (
              <article
                key={ap.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Cliente</p>
                    <p className="text-base font-semibold">{ap.client.name}</p>
                    <p className="text-xs text-slate-500">
                      {ap.client.email}
                      {ap.client.phone && ` • ${ap.client.phone}`}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={statusBadge(ap.status)}>{ap.status}</span>
                    <p className="text-sm text-slate-700">
                      {formatDate(ap.startsAt)} • {formatTime(ap.startsAt)} –{" "}
                      {formatTime(ap.endsAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm text-slate-700">
                  <div>
                    <p className="text-xs text-slate-500">Estúdio</p>
                    <p>
                      {ap.artist.studio?.name
                        ? `${ap.artist.studio.name} • ${ap.artist.studio.city} • ${ap.artist.studio.state}`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Observações</p>
                    <p>{ap.notes || "—"}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/artists/${ap.artist.id}`}
                    className="text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
                  >
                    Ver perfil
                  </Link>

                  {/* Aqui no futuro dá pra colocar botões:
                  
                  <button className="text-sm px-3 py-2 rounded-lg border text-green-700 hover:bg-green-50">
                    Confirmar
                  </button>

                  <button className="text-sm px-3 py-2 rounded-lg border text-red-700 hover:bg-red-50">
                    Cancelar
                  </button>
                  
                  */}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Histórico */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Histórico</h2>

        {past.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhum histórico disponível ainda.
          </p>
        ) : (
          <div className="grid gap-3">
            {past.map((ap) => (
              <article
                key={ap.id}
                className="bg-white border border-slate-200 rounded-2xl p-4 text-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{ap.client.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatDate(ap.startsAt)} • {formatTime(ap.startsAt)} –{" "}
                      {formatTime(ap.endsAt)}
                    </p>
                  </div>
                  <span className={statusBadge(ap.status)}>{ap.status}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
