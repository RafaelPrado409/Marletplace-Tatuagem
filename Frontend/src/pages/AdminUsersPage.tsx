import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { AdminUser } from "../types";

type Role = "CLIENT" | "ARTIST" | "ADMIN";

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function loadUsers() {
    try {
      setLoading(true);
      const res = await api.get<AdminUser[]>("/users");
      setUsers(res.data);
    } catch (e: any) {
      setError("Não foi possível carregar os usuários.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function changeRole(id: string, role: Role) {
    try {
      setSavingId(id);
      const res = await api.patch<AdminUser>(`/users/${id}/role`, { role });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: res.data.role } : u))
      );
    } catch (e: any) {
      alert("Erro ao atualizar papel do usuário.");
    } finally {
      setSavingId(null);
    }
  }

  async function toggleActive(user: AdminUser) {
    try {
      setSavingId(user.id);
      const res = await api.patch<AdminUser>(`/users/${user.id}/active`, {
        isActive: !user.isActive,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isActive: res.data.isActive } : u
        )
      );
    } catch (e: any) {
      alert("Erro ao atualizar status do usuário.");
    } finally {
      setSavingId(null);
    }
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Administração de Usuários</h1>
        <p className="text-sm text-slate-500">
          Visualize, promova e desative usuários do sistema.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-600">Carregando usuários...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-slate-500">Nenhum usuário encontrado.</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Nome</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Papel</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Criado em</th>
                <th className="py-2 pr-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-b-0">
                  <td className="py-2 pr-4">{u.name}</td>
                  <td className="py-2 pr-4 text-slate-600">{u.email}</td>
                  <td className="py-2 pr-4">
                    <span className="inline-flex gap-1">
                      {(["CLIENT", "ARTIST", "ADMIN"] as Role[]).map((role) => (
                        <button
                          key={role}
                          disabled={savingId === u.id}
                          onClick={() => changeRole(u.id, role)}
                          className={`px-2 py-1 rounded-full border text-xs ${
                            u.role === role
                              ? "bg-black text-white border-black"
                              : "bg-white text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </span>
                  </td>
                  <td className="py-2 pr-4">
                    <button
                      disabled={savingId === u.id}
                      onClick={() => toggleActive(u)}
                      className={`px-2 py-1 rounded-full text-xs ${
                        u.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {u.isActive ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                  <td className="py-2 pr-4 text-slate-500">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="py-2 pr-4">
                    <span className="text-xs text-slate-400">ID: {u.id}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
