/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import type { Studio, Artist } from "../types";

type StudioWithArtists = Studio & {
  artists?: Artist[];
};

export function StudioDetailPage() {
  const { id } = useParams();
  const [studio, setStudio] = useState<StudioWithArtists | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudioAndArtists() {
      try {
        setLoading(true);

        const studioRes = await api.get<Studio>(`/studios/${id}`);
        setStudio(studioRes.data);

        const artistsRes = await api.get(`/artists`, {
          params: { studioId: id },
        });

        const items = artistsRes.data.items ?? artistsRes.data;
        setArtists(items);
      } catch (e) {
        setError("Não foi possível carregar o estúdio.");
      } finally {
        setLoading(false);
      }
    }

    loadStudioAndArtists();
  }, [id]);

  if (loading) return <p className="text-slate-600">Carregando estúdio...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!studio) return <p className="text-slate-500">Estúdio não encontrado.</p>;

  return (
    <div className="space-y-6">
      <Link to="/studios" className="text-sm text-slate-600 hover:underline">
        ← Voltar para estúdios
      </Link>

      {/* Card do estúdio */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-2">
        <h1 className="text-2xl font-bold">{studio.name}</h1>

        <p className="text-sm text-slate-500">
          {studio.city} • {studio.state}
        </p>

        {studio.description && (
          <p className="text-slate-700 mt-2">{studio.description}</p>
        )}

        <div className="text-sm text-slate-700 mt-3 space-y-1">
          <p>
            <b>Endereço:</b> {studio.address}
          </p>
          {studio.phone && (
            <p>
              <b>Telefone:</b> {studio.phone}
            </p>
          )}
        </div>
      </section>

      {/* Artistas do estúdio */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Artistas do Estúdio</h2>
          <span className="text-sm text-slate-500">
            Total: {artists.length}
          </span>
        </div>

        {artists.length === 0 ? (
          <p className="text-slate-500">
            Nenhum artista cadastrado neste estúdio.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <Link key={artist.id} to={`/artists/${artist.id}`}>
                <article className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <h3 className="font-semibold">{artist.displayName}</h3>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {(artist.styles || []).map((s) => (
                      <span
                        key={s.style.id}
                        className="px-2 py-1 text-xs bg-slate-100 border rounded-full"
                      >
                        {s.style.name}
                      </span>
                    ))}
                  </div>

                  {artist.bio && (
                    <p className="text-sm text-slate-700 mt-2 line-clamp-3">
                      {artist.bio}
                    </p>
                  )}
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
