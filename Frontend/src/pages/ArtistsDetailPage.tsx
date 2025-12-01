import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Artist } from "../types";

export function ArtistDetailPage() {
  const { id } = useParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArtist() {
      try {
        const res = await api.get(`/artists/${id}`);
        setArtist(res.data);
      } catch (e) {
        setError("Não foi possível carregar o artista.");
      } finally {
        setLoading(false);
      }
    }
    loadArtist();
  }, [id]);

  if (loading) return <p className="text-slate-600">Carregando artista...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!artist) return <p className="text-slate-500">Artista não encontrado.</p>;

  const city = artist.studio?.city ?? "";
  const state = artist.studio?.state ?? "";

  return (
    <div className="space-y-6">
      {/* topo com voltar */}
      <div className="flex items-center justify-between">
        <Link to="/artists" className="text-sm text-slate-600 hover:underline">
          ← Voltar para artistas
        </Link>
      </div>

      {/* Card principal */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{artist.displayName}</h1>
            <p className="text-sm text-slate-500 mt-1">
              {city} {state && `• ${state}`}
              {artist.studio?.name && ` • ${artist.studio.name}`}
            </p>

            {artist.bio && <p className="text-slate-700 mt-3">{artist.bio}</p>}

            {/* estilos */}
            <div className="flex flex-wrap gap-2 mt-4">
              {(artist.styles || []).map((s) => (
                <span
                  key={s.style.id}
                  className="px-3 py-1 text-xs bg-slate-100 border rounded-full"
                >
                  {s.style.name}
                </span>
              ))}
            </div>

            {/* contato */}
            {artist.instagram && (
              <p className="text-sm mt-4">
                Instagram:{" "}
                <a
                  className="text-blue-600 hover:underline"
                  href={`https://instagram.com/${artist.instagram.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {artist.instagram}
                </a>
              </p>
            )}
          </div>

          {/* ação */}
          <div className="flex gap-2">
            <Link
              to={`/artists/${artist.id}/book`}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-slate-800"
            >
              Agendar sessão
            </Link>
          </div>
        </div>
      </section>

      {/* Portfólio */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Portfólio</h2>

        {!artist.portfolio || artist.portfolio.length === 0 ? (
          <p className="text-slate-500">Nenhum trabalho publicado ainda.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {artist.portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-44 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-medium">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
