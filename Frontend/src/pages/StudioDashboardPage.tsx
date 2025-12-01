import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

type StudioArtist = {
  id: string;
  displayName: string | null;
  instagram: string | null;
  bio: string | null;
  user?: {
    name: string;
    email: string;
  };
};

type Studio = {
  id: string;
  name: string;
  description: string | null;
  city: string;
  state: string;
  address: string;
  phone: string | null;
  createdAt: string;
  artists: StudioArtist[];
};

export function StudioDashboardPage() {
  const navigate = useNavigate();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStudio() {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/studios/my");
        const studios: Studio[] = Array.isArray(res.data) ? res.data : [];

        if (!isMounted) return;

        if (studios.length === 0) {
          navigate("/studio/create");
          return;
        }

        setStudio(studios[0]);
      } catch (err: any) {
        console.error("Erro ao carregar estúdio do dono:", err);

        if (!isMounted) return;

        if (err?.response?.status === 401) {
          navigate("/login");
          return;
        }

        setError(
          err?.response?.data?.message ??
            "Não foi possível carregar os dados do estúdio."
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadStudio();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const totalArtists = studio?.artists?.length ?? 0;

  function formatCreatedAt(dateStr?: string) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("pt-BR");
  }

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-slate-200 rounded-lg" />
          <div className="h-4 w-80 bg-slate-200 rounded-lg" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="h-24 bg-slate-100 rounded-2xl" />
            <div className="h-24 bg-slate-100 rounded-2xl" />
            <div className="h-24 bg-slate-100 rounded-2xl" />
          </div>

          <div className="h-40 bg-slate-100 rounded-2xl" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5">
          <h1 className="text-lg font-semibold text-red-700 mb-1">
            Oops, algo deu errado.
          </h1>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => navigate(0)}
            className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  if (!studio) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-center">
          <p className="text-sm font-medium text-slate-800 mb-1">
            Você ainda não possui um estúdio cadastrado.
          </p>
          <p className="text-xs text-slate-500 mb-4">
            Crie seu estúdio para acessar o painel de gestão.
          </p>
          <Link
            to="/studio/create"
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-black"
          >
            Criar estúdio
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Cabeçalho */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-600">
              Painel do estúdio
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            {studio.name}
          </h1>

          <p className="text-sm text-slate-500">
            Visão geral do seu estúdio, equipe e próximos passos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/studios/${studio.id}`}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Ver página pública
          </Link>

          <Link
            to="/studios/artists"
            className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black"
          >
            Gerenciar artistas
          </Link>
        </div>
      </header>

      {/* Cards resumo */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card principal do estúdio */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-1.5">
            Estúdio
          </p>
          <h2 className="text-lg font-semibold text-slate-900 mb-0.5">
            {studio.name}
          </h2>
          <p className="text-sm text-slate-500 mb-2">
            {studio.city}, {studio.state}
          </p>
          {studio.phone && (
            <p className="text-xs text-slate-500">
              Telefone:{" "}
              <span className="font-medium text-slate-700">{studio.phone}</span>
            </p>
          )}
          {studio.address && (
            <p className="mt-1 text-xs text-slate-500">
              Endereço:{" "}
              <span className="font-medium text-slate-700">
                {studio.address}
              </span>
            </p>
          )}
        </div>

        {/* Card métricas simples */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-300 mb-3">
            Equipe
          </p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-semibold leading-none mb-1">
                {totalArtists}
              </p>
              <p className="text-xs text-slate-300">
                {totalArtists === 1
                  ? "artista vinculado"
                  : "artistas vinculados"}
              </p>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-slate-300">
            Gerencie sua equipe, atribua artistas e atualize perfis pela seção
            <span className="font-semibold"> "Gerenciar artistas"</span>.
          </p>
        </div>

        {/* Card info contextual */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1.5">
              Informações
            </p>
            <p className="text-sm text-slate-700">
              Criado em{" "}
              <span className="font-semibold">
                {formatCreatedAt(studio.createdAt)}
              </span>
            </p>
            {studio.description && (
              <p className="mt-2 text-xs text-slate-500 line-clamp-3">
                {studio.description}
              </p>
            )}
          </div>
          <div className="mt-3">
            <p className="text-[11px] text-slate-500">
              Em breve você poderá ver aqui métricas de agendamentos por artista
              e desempenho do estúdio.
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo principal: artistas + próximos passos */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de artistas */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Artistas do estúdio
              </h2>
              <p className="text-xs text-slate-500">
                Visualize quem já está vinculado ao seu estúdio.
              </p>
            </div>
            <Link
              to="/studios/artists"
              className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Gerenciar
            </Link>
          </div>

          {totalArtists === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-700 mb-1">
                Nenhum artista vinculado ainda
              </p>
              <p className="text-xs text-slate-500 mb-3">
                Adicione artistas ao seu estúdio para que eles apareçam na busca
                e recebam agendamentos.
              </p>
              <Link
                to="/studios/artists"
                className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black"
              >
                Adicionar artista
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {studio.artists.map((artist) => {
                const name =
                  artist.displayName ?? artist.user?.name ?? "Artista sem nome";
                const email = artist.user?.email;
                const initials =
                  name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "?";

                return (
                  <li key={artist.id} className="py-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                      {initials}
                    </div>
                    <div className="flex-1">
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
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Próximos passos / placeholder de agendamentos */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-1">
              Próximos passos
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Algumas sugestões para deixar seu estúdio pronto para receber
              clientes:
            </p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>• Adicione artistas e preencha as informações de perfil.</li>
              <li>• Garanta que seu endereço e telefone estejam corretos.</li>
              <li>• Peça para os artistas montarem um portfólio atrativo.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-1">
              Próximos agendamentos
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Em breve, você poderá acompanhar aqui os agendamentos do estúdio
              por artista, data e status.
            </p>
            <div className="rounded-xl bg-slate-50 px-4 py-4 text-center">
              <p className="text-xs text-slate-500">
                Ainda não conectamos os agendamentos ao painel do estúdio.
                Continue configurando seu espaço – essa seção será útil depois.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
