import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/auth";

type UserRole = "ADMIN" | "ARTIST" | "CLIENT" | string;

interface AuthUser {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
}

interface ArtistProfile {
  stageName: string;
  bio: string;
  instagram: string;
  portfolioUrl: string;
}

export function ProfilePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [artistProfile, setArtistProfile] = useState<ArtistProfile>({
    stageName: "",
    bio: "",
    instagram: "",
    portfolioUrl: "",
  });

  const [isSavingMain, setIsSavingMain] = useState(false);
  const [isSavingArtist, setIsSavingArtist] = useState(false);
  const [mainSavedMessage, setMainSavedMessage] = useState("");
  const [artistSavedMessage, setArtistSavedMessage] = useState("");

  useEffect(() => {
    const current = getUser() as AuthUser | null;
    if (!current) {
      navigate("/login");
      return;
    }

    setUser(current);
    setName(current.name ?? "");
    setEmail(current.email ?? "");
  }, [navigate]);

  if (!user) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-sm text-slate-500">Carregando perfil...</p>
      </main>
    );
  }

  const initial =
    user.name && typeof user.name === "string"
      ? user.name[0]?.toUpperCase()
      : "U";

  const roleLabel =
    user.role === "ADMIN"
      ? "Administrador"
      : user.role === "ARTIST"
      ? "Artista"
      : "Cliente";

  async function handleSaveMain(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingMain(true);
    setMainSavedMessage("");

    try {
      const updatedUser: AuthUser = {
        ...user,
        name: name.trim() || user.name,
        email: email.trim() || user.email,
      };

      setUser(updatedUser);

      setMainSavedMessage("Informações atualizadas com sucesso.");
    } catch (err) {
      console.error(err);
      setMainSavedMessage("Não foi possível salvar agora. Tente novamente.");
    } finally {
      setIsSavingMain(false);
      setTimeout(() => setMainSavedMessage(""), 3000);
    }
  }

  async function handleSaveArtist(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingArtist(true);
    setArtistSavedMessage("");

    try {
      setArtistSavedMessage("Perfil de artista atualizado com sucesso.");
    } catch (err) {
      console.error(err);
      setArtistSavedMessage(
        "Não foi possível salvar o perfil de artista agora."
      );
    } finally {
      setIsSavingArtist(false);
      setTimeout(() => setArtistSavedMessage(""), 3000);
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-2xl font-semibold text-white">
            {initial}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Meu perfil
            </h1>
            <p className="text-sm text-slate-500">
              Gerencie seus dados pessoais e como você aparece no marketplace.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 bg-white">
          <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" />
          <span className="text-xs font-medium text-slate-700">
            Conta ativa
          </span>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[2fr,1.5fr]">
        {/* Coluna esquerda */}
        <section className="space-y-6">
          {/* Card: Informações básicas com edição */}
          <form
            onSubmit={handleSaveMain}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-800">
                Informações pessoais
              </h2>
              <button
                type="submit"
                disabled={isSavingMain}
                className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSavingMain ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>

            {mainSavedMessage && (
              <p className="text-xs text-emerald-600">{mainSavedMessage}</p>
            )}

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                  />
                  <p className="text-[11px] text-slate-400">
                    Esse nome pode aparecer nos seus agendamentos.
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Tipo de conta
                  </label>
                  <input
                    type="text"
                    value={roleLabel}
                    disabled
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
                  />
                  <p className="text-[11px] text-slate-400">
                    Define os acessos disponíveis para você.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="seuemail@exemplo.com"
                  />
                  <p className="text-[11px] text-slate-400">
                    Usado para login e notificações. Você pode travar edição se
                    não quiser permitir mudança.
                  </p>
                </div>
              </div>
            </div>
          </form>

          {/* Card: Preferências / placeholder */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">
              Preferências de conta
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Em próximas versões você poderá ajustar notificações, idioma e
              outras preferências por aqui.
            </p>

            <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 px-4 py-3 bg-slate-50">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Pré-visualização pública
                </p>
                <p className="text-xs text-slate-500">
                  Como seu perfil aparece para estúdios e artistas.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white">
                Em breve
              </span>
            </div>
          </div>

          {/* Se for ARTIST, mostra card especial */}
          {user.role === "ARTIST" && (
            <form
              onSubmit={handleSaveArtist}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  Perfil de artista
                </h2>
                <button
                  type="submit"
                  disabled={isSavingArtist}
                  className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSavingArtist ? "Salvando..." : "Salvar perfil de artista"}
                </button>
              </div>

              {artistSavedMessage && (
                <p className="text-xs text-emerald-600">{artistSavedMessage}</p>
              )}

              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Nome artístico
                  </label>
                  <input
                    type="text"
                    value={artistProfile.stageName}
                    onChange={(e) =>
                      setArtistProfile((prev) => ({
                        ...prev,
                        stageName: e.target.value,
                      }))
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="Ex: Rafa Prado Tattoos"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Bio curta
                  </label>
                  <textarea
                    value={artistProfile.bio}
                    onChange={(e) =>
                      setArtistProfile((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    rows={3}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder="Conte em poucas linhas seu estilo, experiência e o que você mais gosta de tatuar."
                  />
                  <p className="text-[11px] text-slate-400">
                    Essa descrição pode aparecer na página dos artistas.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={artistProfile.instagram}
                      onChange={(e) =>
                        setArtistProfile((prev) => ({
                          ...prev,
                          instagram: e.target.value,
                        }))
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                      placeholder="@seuuser"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Portfólio / Link externo
                    </label>
                    <input
                      type="text"
                      value={artistProfile.portfolioUrl}
                      onChange={(e) =>
                        setArtistProfile((prev) => ({
                          ...prev,
                          portfolioUrl: e.target.value,
                        }))
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </section>

        {/* Coluna direita */}
        <aside className="space-y-6">
          {/* Card: Resumo da conta */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">
              Resumo da conta
            </h2>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start justify-between gap-2">
                <span className="text-slate-500">Tipo de usuário</span>
                <span className="font-medium text-slate-800">{roleLabel}</span>
              </li>
              <li className="flex items-start justify-between gap-2">
                <span className="text-slate-500">Agendamentos</span>
                <span className="font-medium text-slate-800">
                  Acesse em{" "}
                  <span className="underline decoration-slate-300">
                    &quot;Meus agendamentos&quot;
                  </span>
                </span>
              </li>

              {user.role === "ARTIST" && (
                <li className="flex items-start justify-between gap-2">
                  <span className="text-slate-500">Painel do artista</span>
                  <span className="font-medium text-slate-800">
                    /me/artist/appointments
                  </span>
                </li>
              )}

              {user.role === "ADMIN" && (
                <li className="flex flex-col gap-1">
                  <span className="text-slate-500">
                    Acessos administrativos
                  </span>
                  <span className="text-xs text-slate-600">
                    • Usuários: /admin/users
                    <br />
                    • Estilos: /admin/styles
                    <br />• Estúdios: /admin/studios
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Card: Segurança */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <h2 className="text-sm font-semibold text-amber-900 mb-2">
              Segurança da conta
            </h2>
            <p className="text-xs text-amber-900 mb-3">
              Se você suspeitar de qualquer atividade estranha, altere sua senha
              imediatamente pela área de login.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex items-center rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-100"
            >
              Ir para área de login
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
