import { useEffect, useState } from "react";
import { api } from "../lib/api";

type ArtistUser = {
  id: string;
  name: string;
  email: string;
};

type StudioArtist = {
  id: string;
  displayName: string | null;
  bio: string | null;
  instagram: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

type MyStudioResponse = {
  id: string;
  name: string;
  artists: StudioArtist[];
};

export function StudioArtistsPage() {
  const [studioId, setStudioId] = useState<string | null>(null);
  const [studioName, setStudioName] = useState<string>("");
  const [currentArtists, setCurrentArtists] = useState<StudioArtist[]>([]);
  const [availableArtists, setAvailableArtists] = useState<ArtistUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  async function loadMyStudio() {
    const res = await api.get<MyStudioResponse[]>("/studios/my");
    const studios = res.data ?? [];
    if (studios.length > 0) {
      const studio = studios[0];
      setStudioId(studio.id);
      setStudioName(studio.name);
      setCurrentArtists(studio.artists ?? []);
    } else {
      setStudioId(null);
      setStudioName("");
      setCurrentArtists([]);
    }
  }

  async function loadAvailableArtists() {
    const res = await api.get<{
      studioId: string;
      artists: ArtistUser[];
    }>("/studios/my/available-artists");

    setAvailableArtists(res.data.artists ?? []);
    if (!studioId) {
      setStudioId(res.data.studioId);
    }
  }

  async function refreshAll() {
    await Promise.all([loadMyStudio(), loadAvailableArtists()]);
  }

  async function handleRemoveArtist(artistId: string) {
    if (!studioId) return;
    try {
      if (!confirm("Tem certeza que deseja remover este artista do estúdio?")) {
        return;
      }

      await api.delete(`/studios/${studioId}/artists/${artistId}`);
      await refreshAll();
    } catch (err) {
      console.error("Erro ao remover artista do estúdio:", err);
    }
  }

  async function handleEditArtist(artist: StudioArtist) {
    if (!studioId) return;

    const currentName =
      artist.displayName || artist.user?.name || "Artista sem nome";
    const currentBio = artist.bio || "";
    const currentIg = artist.instagram || "";

    const newName = prompt("Novo nome artístico:", currentName);
    if (newName === null) return;

    const newBio = prompt("Nova bio (opcional):", currentBio);
    if (newBio === null) return;

    const newIg = prompt("Instagram (sem @):", currentIg.replace(/^@/, ""));
    if (newIg === null) return;

    try {
      await api.patch(`/studios/${studioId}/artists/${artist.id}`, {
        displayName: newName,
        bio: newBio || null,
        instagram: newIg ? newIg.replace(/^@/, "") : null,
      });

      await refreshAll();
    } catch (err) {
      console.error("Erro ao editar artista:", err);
    }
  }

  useEffect(() => {
    setLoading(true);
    void refreshAll().finally(() => setLoading(false));
  }, []);

  async function handleAddArtist(userId: string) {
    if (!studioId) return;
    try {
      setAddingId(userId);

      await api.post(`/studios/${studioId}/artists`, {
        userId,
      });

      await refreshAll();
    } catch (err) {
      console.error("Erro ao adicionar artista ao estúdio:", err);
    } finally {
      setAddingId(null);
    }
  }

  function getInitials(name?: string | null) {
    if (!name) return "?";
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-sm text-slate-500">Carregando artistas...</p>
      </main>
    );
  }

  if (!studioId) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center">
          <p className="text-sm font-medium text-slate-800 mb-1">
            Você ainda não possui um estúdio cadastrado.
          </p>
          <p className="text-xs text-slate-500">
            Crie um estúdio para conseguir gerenciar artistas vinculados.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Gerenciar artistas
          </h1>
          <p className="text-sm text-slate-500">
            Estúdio: <span className="font-medium">{studioName}</span>
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Artistas já vinculados */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-1">
            Artistas do estúdio
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            Estes artistas já estão vinculados ao seu estúdio.
          </p>

          {currentArtists.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-700 mb-1">
                Nenhum artista vinculado ainda
              </p>
              <p className="text-xs text-slate-500">
                Adicione artistas na coluna ao lado para começar a montar sua
                equipe.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {currentArtists.map((artist) => {
                const name =
                  artist.displayName ?? artist.user?.name ?? "Artista sem nome";
                const email = artist.user?.email;

                return (
                  <li
                    key={artist.id}
                    className="py-3 flex items-center gap-3 justify-between"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                        {getInitials(name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {name}
                        </p>
                        {artist.bio && (
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {artist.bio}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {email && (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                              {email}
                            </span>
                          )}
                          {artist.instagram && (
                            <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[11px] text-rose-600">
                              @{artist.instagram.replace(/^@/, "")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void handleEditArtist(artist)}
                        className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleRemoveArtist(artist.id)}
                        className="inline-flex items-center rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Artistas disponíveis */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-1">
            Artistas disponíveis
          </h2>
          <p className="text-xs text-slate-500 mb-3">
            Usuários com papel de artista que ainda não estão vinculados a
            nenhum estúdio.
          </p>

          {availableArtists.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-700 mb-1">
                Nenhum artista disponível
              </p>
              <p className="text-xs text-slate-500">
                Assim que houver usuários com papel de artista sem estúdio, eles
                aparecerão aqui.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {availableArtists.map((artist) => (
                <li
                  key={artist.id}
                  className="py-3 flex items-center gap-3 justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                      {getInitials(artist.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {artist.name}
                      </p>
                      <p className="text-xs text-slate-500">{artist.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleAddArtist(artist.id)}
                    disabled={addingId === artist.id}
                    className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black disabled:opacity-60"
                  >
                    {addingId === artist.id ? "Adicionando..." : "Adicionar"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
