import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useSettingsStore } from "../stores/useSettingsStore";

import { Link } from "react-router";
import { Users, Store, LogOut, Plus, Shield, User, Trash2, HelpCircle, ChevronRight, LayoutDashboard } from "lucide-react";

export default function Settings(): React.JSX.Element {
  const { logout, user: authUser } = useAuthStore();
  const isAdmin = authUser?.role === "admin";

  const {
    shop, user, team, loading, error,
    loadSettings, addMember, updateMember, manageMemberStatus
  } = useSettingsStore();

  // Formulaire d'ajout de membre
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "", password: "", role: "employe" });

  useEffect(() => {
    // GET /auth/settings est réservé à gerant/gestionnaire : un admin (super-admin
    // plateforme, pas rattaché à la gestion d'équipe) n'y a pas accès et n'en a pas besoin.
    if (!isAdmin) loadSettings();
  }, [loadSettings, isAdmin]);

  const handleLogout = () => {
    logout();
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addMember(newMember);
      setShowAddForm(false);
      setNewMember({ name: "", email: "", password: "", role: "employe" });
      loadSettings(); // Recharger la liste
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de l'ajout du membre.");
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      await updateMember(id, { role: newRole });
      loadSettings();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de la mise à jour.");
    }
  };

  const handleRemoveMember = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment retirer ce membre de l'équipe ?")) return;
    try {
      await manageMemberStatus(id, "remove");
      loadSettings();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  if (!isAdmin && loading) return <div className="p-4 text-center text-neutral-400">Chargement...</div>;

  const isManager = user?.role === "gerant" || user?.role === "gestionnaire";

  return (
    <div className="p-4 pb-24">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-white">Paramètres</h1>

      {error && !isAdmin && (
        <div className="mb-6 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {/* Compte (super-admin : pas de boutique/équipe à gérer, juste son compte) */}
      {isAdmin && (
        <section className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{authUser?.name}</h2>
              <p className="text-sm text-neutral-400">{authUser?.email}</p>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-300">
            Super-admin plateforme
          </div>
        </section>
      )}

      {/* Section Boutique */}
      {!isAdmin && (
      <section className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Store size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white"> {shop?.type !== "Autre" ? shop?.type.toLocaleUpperCase() : "Boutique"} </h2>
            <p className="text-sm text-neutral-400">Informations générales</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-neutral-500">Nom de la boutique</div>
            <div className="text-sm font-medium text-white">{shop?.name}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-500">Votre compte</div>
            <div className="text-sm font-medium text-white">{user?.name} ({user?.email})</div>
            <div className="mt-1 inline-flex items-center rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-300">
              {user?.role}
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Section Équipe */}
      {!isAdmin && (
      <section className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Équipe</h2>
              <p className="text-sm text-neutral-400">Gérez les accès</p>
            </div>
          </div>
          {isManager && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1 rounded-lg bg-neutral-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700"
            >
              <Plus size={16} /> Ajouter
            </button>
          )}
        </div>

        {showAddForm && (
          <form onSubmit={handleAddMember} className="mb-6 rounded-lg border border-neutral-700 bg-neutral-800/50 p-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">Nom complet</label>
              <input
                required
                type="text"
                className="input"
                value={newMember.name}
                onChange={e => setNewMember({...newMember, name: e.target.value})}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">Email</label>
              <input
                required
                type="email"
                className="input"
                value={newMember.email}
                onChange={e => setNewMember({...newMember, email: e.target.value})}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">Mot de passe</label>
              <input
                required
                type="password"
                className="input"
                value={newMember.password}
                onChange={e => setNewMember({...newMember, password: e.target.value})}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-300">Rôle</label>
              <select
                className="input"
                value={newMember.role}
                onChange={e => setNewMember({...newMember, role: e.target.value})}
              >
                <option value="employe">Employé (Ventes uniquement)</option>
                <option value="gestionnaire">Gestionnaire (Stock + Ventes)</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setShowAddForm(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-400 hover:text-white">Annuler</button>
              <button type="submit" className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-black hover:bg-amber-400">Créer l'accès</button>
            </div>
          </form>
        )}

        <div className="divide-y divide-neutral-800">
          {team.map(member => (
            <div key={member.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-400">
                  {member.role === 'gerant' ? <Shield size={16} /> : <User size={16} />}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{member.name} {member.id === user?.id && "(Vous)"}</div>
                  <div className="text-xs text-neutral-500">{member.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isManager && member.role !== 'gerant' && member.id !== user?.id ? (
                  <select
                    value={member.role}
                    onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                    className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-300 outline-none"
                  >
                    <option value="employe">Employé</option>
                    <option value="gestionnaire">Gestionnaire</option>
                  </select>
                ) : (
                  <span className="text-xs font-medium text-neutral-500 capitalize">{member.role}</span>
                )}

                {isManager && member.role !== 'gerant' && member.id !== user?.id && (
                  <button onClick={() => handleRemoveMember(member.id)} className="p-1 text-neutral-500 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* Administration (super-admin plateforme uniquement) */}
      {isAdmin && (
        <section className="mb-8">
          <Link
            to="/admin"
            className="flex w-full items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition hover:bg-neutral-800"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <LayoutDashboard size={20} />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-semibold text-white">Administration</h2>
                <p className="text-sm text-neutral-400">Gérer toutes les boutiques</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-neutral-500" />
          </Link>
        </section>
      )}

      {/* Guide & Aide */}
      <section className="mb-8">
        <Link
          to="/guide"
          className="flex w-full items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition hover:bg-neutral-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <HelpCircle size={20} />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-semibold text-white">Guide & Conseils</h2>
              <p className="text-sm text-neutral-400">Bonnes pratiques et méthode FEFO</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-neutral-500" />
        </Link>
      </section>

      {/* Déconnexion */}
      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-3.5 text-sm font-medium text-red-500 transition hover:bg-red-500/20"
      >
        <LogOut size={18} />
        Se déconnecter
      </button>

    </div>
  );
}
