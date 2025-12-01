/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Artist } from "../types";
import { Link } from "react-router-dom";

export function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    city: "",
    style: "",
    q: "",
  });

  async function loadArtists() {
    setLoading(true);
    try {
      const params: any = {};

      if (filters.city) params.city = filters.city;
      if (filters.style) params.style = filters.style;
      if (filters.q) params.q = filters.q;

      const res = await api.get("/artists", { params });
      setArtists(res.data.items);
    } catch (e) {
      setError("Não foi possível carregar os artistas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArtists();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleSearch() {
    loadArtists();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Tatuadores</h2>
        <span className="text-sm text-slate-500">Total: {artists.length}</span>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* FILTROS */}
        <div className="bg-white p-4 border rounded-xl shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end">
          <input
            name="q"
            value={filters.q}
            onChange={handleChange}
            placeholder="Buscar artista..."
            className="border p-2 rounded-lg w-full md:w-1/3"
          />

          <input
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="Cidade"
            className="border p-2 rounded-lg w-full md:w-1/4"
          />

          <input
            name="style"
            value={filters.style}
            onChange={handleChange}
            placeholder="Slug do estilo"
            className="border p-2 rounded-lg w-full md:w-1/4"
          />

          <button
            onClick={handleSearch}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-slate-800"
          >
            Filtrar
          </button>
        </div>

        {/* LISTA */}
        {loading ? (
          <p className="text-center text-slate-600">Carregando artistas...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : artists.length === 0 ? (
          <p className="text-slate-500">Nenhum artista encontrado.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <Link key={artist.id} to={`/artists/${artist.id}`}>
                <article
                  key={artist.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-base font-semibold mb-1">
                    {artist.displayName}
                  </h3>

                  <p className="text-xs text-slate-500 mb-2">
                    {artist.city || artist.studio?.city}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {(artist.styles || []).map((s) => (
                      <span
                        key={s.style.id}
                        className="px-2 py-1 text-xs bg-slate-200 rounded-full"
                      >
                        {s.style.name}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-slate-700 line-clamp-3 mb-3">
                    {artist.bio || "Sem biografia."}
                  </p>

                  {artist.portfolio && artist.portfolio.length > 0 && (
                    <img
                      src={artist.portfolio[0].imageUrl}
                      alt="portfolio"
                      className="w-full h-40 object-cover rounded-xl"
                    />
                  )}
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
