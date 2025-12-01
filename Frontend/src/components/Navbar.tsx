import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getUser, logout } from "../lib/auth";
import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";

const linkBase = "px-3 py-2 rounded-lg text-sm font-medium transition-colors";
const linkInactive = "text-slate-600 hover:text-slate-900 hover:bg-slate-100";
const linkActive = "text-white bg-black";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getUser());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasStudio, setHasStudio] = useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  console.log("Navbar render => user:", user, "hasStudio:", hasStudio);
  function handleLogout() {
    logout();
    setUser(null);
    setIsUserMenuOpen(false);
    setIsMobileOpen(false);
    setHasStudio(false);
    navigate("/");
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Verifica se o usuário possui estúdio
  useEffect(() => {
    async function checkStudio() {
      console.log(
        "checkStudio rodou. user =",
        user,
        "path =",
        location.pathname
      );
      if (!user) {
        setHasStudio(false);
        return;
      }

      try {
        const res = await api.get("/studios/my");
        console.log("Navbar - /studios/my data:", res.data);

        const studios = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.studios)
          ? res.data.studios
          : [];

        console.log("Navbar - studios encontrados:", studios);

        setHasStudio(studios.length > 0);
      } catch (err) {
        console.error("Erro ao verificar estúdio:", err);
        setHasStudio(false);
      }
    }

    void checkStudio();
  }, [user, location.pathname]);

  const userInitial =
    user?.name && typeof user.name === "string"
      ? user.name[0]?.toUpperCase()
      : "U";

  return (
    <header className="border-b bg-white/80 backdrop-blur relative z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* LOGO + LINKS PRINCIPAIS */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-xs text-white">
              ✦
            </span>
            <span>Marketplace Tattoo</span>
          </NavLink>

          {/* LINKS DESKTOP */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Início
            </NavLink>

            <NavLink
              to="/studios"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Estúdios
            </NavLink>

            <NavLink
              to="/artists"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Artistas
            </NavLink>
          </nav>
        </div>

        {/* ÁREA DIREITA (AUTH / USUÁRIO) */}
        <div className="flex items-center gap-2">
          {/* BOTÃO MOBILE */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            <span className="sr-only">Abrir menu</span>☰
          </button>

          {/* DESKTOP: NÃO LOGADO */}
          {!user && (
            <div className="hidden md:flex items-center gap-2">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Entrar
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-slate-900 text-white hover:bg-black"
                  }`
                }
              >
                Criar conta
              </NavLink>
            </div>
          )}

          {/* DESKTOP: LOGADO */}
          {user && (
            <div ref={userMenuRef} className="hidden md:block relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-xs font-semibold text-white">
                  {userInitial}
                </span>
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-xs font-medium max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide">
                    {user.role === "ADMIN"
                      ? "Admin"
                      : user.role === "ARTIST"
                      ? "Artista"
                      : "Cliente"}
                  </span>
                </span>
                <span className="text-[10px] text-slate-500">▾</span>
              </button>

              {/* DROPDOWN USUÁRIO */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70 py-1 text-sm z-20">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500 mb-0.5">Logado como</p>
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {user.name}
                    </p>
                  </div>

                  {/* Cliente: perfil + agendamentos */}
                  <NavLink
                    to="/me"
                    className="block px-3 py-2 hover:bg-slate-50 text-slate-700"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Meu perfil
                  </NavLink>
                  <NavLink
                    to="/me/appointments"
                    className="block px-3 py-2 hover:bg-slate-50 text-slate-700"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Meus agendamentos
                  </NavLink>

                  {/* Estúdio */}
                  <div className="my-1 border-t border-slate-100" />
                  <p className="px-3 pt-1 pb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Estúdio
                  </p>

                  {!hasStudio ? (
                    <NavLink
                      to="/studios/create"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-2 text-sm rounded-md font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                    >
                      Crie seu estúdio
                    </NavLink>
                  ) : (
                    <>
                      <NavLink
                        to="/studios/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-2 hover:bg-slate-50 text-slate-700"
                      >
                        Painel do estúdio
                      </NavLink>
                      <NavLink
                        to="/studios/artists"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block px-3 py-2 hover:bg-slate-50 text-slate-700"
                      >
                        Gerenciar artistas
                      </NavLink>
                    </>
                  )}

                  {/* Artista */}
                  {user.role === "ARTIST" && (
                    <>
                      <div className="my-1 border-t border-slate-100" />
                      <NavLink
                        to="/me/artist/appointments"
                        className="block px-3 py-2 hover:bg-slate-50 text-slate-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Painel do artista
                      </NavLink>
                    </>
                  )}

                  {/* Admin */}
                  {user.role === "ADMIN" && (
                    <>
                      <div className="my-1 border-t border-slate-100" />
                      <p className="px-3 pt-1 pb-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Administração
                      </p>
                      <NavLink
                        to="/admin/users"
                        className="block px-3 py-2 hover:bg-slate-50 text-slate-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Usuários
                      </NavLink>
                      <NavLink
                        to="/admin/styles"
                        className="block px-3 py-2 hover:bg-slate-50 text-slate-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Estilos
                      </NavLink>
                      <NavLink
                        to="/admin/studios"
                        className="block px-3 py-2 hover:bg-slate-50 text-slate-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Estúdios
                      </NavLink>
                    </>
                  )}

                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden border-t border-slate-200 bg-white/95 transition-[max-height] duration-200 overflow-hidden ${
          isMobileOpen ? "max-h-[400px]" : "max-h-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
          {/* LINKS PRINCIPAIS */}
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `w-full text-left ${linkBase} ${
                  isActive ? linkActive : linkInactive
                }`
              }
              onClick={() => setIsMobileOpen(false)}
            >
              Início
            </NavLink>
            <NavLink
              to="/studios"
              end
              className={({ isActive }) =>
                `w-full text-left ${linkBase} ${
                  isActive ? linkActive : linkInactive
                }`
              }
              onClick={() => setIsMobileOpen(false)}
            >
              Estúdios
            </NavLink>
            <NavLink
              to="/artists"
              className={({ isActive }) =>
                `w-full text-left ${linkBase} ${
                  isActive ? linkActive : linkInactive
                }`
              }
              onClick={() => setIsMobileOpen(false)}
            >
              Artistas
            </NavLink>
          </nav>

          {/* MOBILE: NÃO LOGADO */}
          {!user && (
            <div className="flex flex-col gap-2 pt-1">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `w-full text-left ${linkBase} ${
                    isActive ? linkActive : linkInactive
                  }`
                }
                onClick={() => setIsMobileOpen(false)}
              >
                Entrar
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `w-full text-left ${linkBase} ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-slate-900 text-white hover:bg-black"
                  }`
                }
                onClick={() => setIsMobileOpen(false)}
              >
                Criar conta
              </NavLink>
            </div>
          )}

          {/* MOBILE: LOGADO */}
          {user && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-sm font-semibold text-white">
                  {userInitial}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-800">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wide">
                    {user.role === "ADMIN"
                      ? "Admin"
                      : user.role === "ARTIST"
                      ? "Artista"
                      : "Cliente"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <NavLink
                  to="/me"
                  className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Meu perfil
                </NavLink>
                <NavLink
                  to="/me/appointments"
                  className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Meus agendamentos
                </NavLink>

                {/* Estúdio */}
                <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Estúdio
                </p>
                {!hasStudio ? (
                  <NavLink
                    to="/studio/create"
                    onClick={() => setIsMobileOpen(false)}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                  >
                    Crie seu estúdio
                  </NavLink>
                ) : (
                  <>
                    <NavLink
                      to="/studio/dashboard"
                      onClick={() => setIsMobileOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100"
                    >
                      Painel do estúdio
                    </NavLink>
                    <NavLink
                      to="/studios/artists"
                      onClick={() => setIsMobileOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100"
                    >
                      Gerenciar artistas
                    </NavLink>
                  </>
                )}

                {hasStudio && (
                  <NavLink
                    to="/studios/artists"
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Gerenciar artistas
                  </NavLink>
                )}

                {user.role === "ARTIST" && (
                  <NavLink
                    to="/me/artist/appointments"
                    className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Painel do artista
                  </NavLink>
                )}

                {user.role === "ADMIN" && (
                  <>
                    <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      Administração
                    </p>
                    <NavLink
                      to="/admin/users"
                      className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Usuários
                    </NavLink>
                    <NavLink
                      to="/admin/styles"
                      className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Estilos
                    </NavLink>
                    <NavLink
                      to="/admin/studios"
                      className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-700 hover:bg-slate-100"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Estúdios
                    </NavLink>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 w-full text-left px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-50"
                >
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
