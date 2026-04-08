"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

// ─── Types ───────────────────────────────────────────────
interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  city: string | null;
  region: string | null;
  points: number;
  createdAt: string;
  emailVerified: string | null;
}

interface FormState {
  name: string;
  phone: string;
  city: string;
  region: string;
}

// ─── Icônes SVG inline ───────────────────────────────────
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconFacebook = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const IconLoader = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

// ─── Composant principal ──────────────────────────────────
export default function ProfilePage() {
  const { data: session, status } = useSession();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<FormState>({ name: "", phone: "", city: "", region: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Charger le profil
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((data: UserProfile) => {
          setProfile(data);
          setForm({
            name: data.name ?? "",
            phone: data.phone ?? "",
            city: data.city ?? "",
            region: data.region ?? "",
          });
        })
        .catch(() => setError("Impossible de charger le profil"))
        .finally(() => setLoading(false));
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Erreur lors de la mise à jour");
      }

      const updated: UserProfile = await res.json();
      setProfile((prev) => ({ ...prev!, ...updated }));
      setSuccess(true);
      setEditMode(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        phone: profile.phone ?? "",
        city: profile.city ?? "",
        region: profile.region ?? "",
      });
    }
    setEditMode(false);
    setError(null);
  };

  // ─── États de chargement / auth ──────────────────────
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-stone-400 text-sm font-medium tracking-wide">Chargement…</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
            <IconUser />
          </div>
          <h2 className="text-lg font-semibold text-stone-800 mb-2">Accès réservé</h2>
          <p className="text-stone-500 text-sm">Connecte-toi pour accéder à ton profil.</p>
        </div>
      </div>
    );
  }

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? "?";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : null;

  // ─── Rendu principal ──────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header hero strip */}
      <div className="bg-gradient-to-br h-28 sm:h-36 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #fff4 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff2 0%, transparent 50%)" }} />
      </div>

      <div className="max-w-lg mx-auto px-3 sm:px-4 -mt-14 sm:-mt-16 pb-12">

        {/* Carte avatar + infos fixes */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4 sm:p-6 mb-4">
          <div className="flex items-end gap-4 mb-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profile?.image ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md">
                  <Image
                    src={profile.image}
                    alt={profile.name ?? "Avatar"}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-md bg-gradient-to-br flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{initials}</span>
                </div>
              )}
              {/* Badge Facebook */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white">
                <IconFacebook />
              </div>
            </div>

            {/* Nom + meta */}
            <div className="flex-1 min-w-0 pb-1">
              <h1 className="text-lg sm:text-xl font-bold text-stone-800 truncate">
                {profile?.name ?? "Nom non renseigné"}
              </h1>
              <p className="text-stone-400 text-xs truncate">{profile?.email}</p>
              {memberSince && (
                <p className="text-stone-400 text-xs mt-0.5">Membre depuis {memberSince}</p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-3">
            <div className="flex-1 bg-orange-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-orange-500 mb-0.5">
                <IconStar />
                <span className="text-lg font-bold text-stone-800">{profile?.points ?? 0}</span>
              </div>
              <p className="text-xs text-stone-400">Points</p>
            </div>
            <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-green-500 mb-0.5">
                <IconCheck />
                <span className="text-lg font-bold text-stone-800">
                  {profile?.emailVerified ? "Oui" : "Non"}
                </span>
              </div>
              <p className="text-xs text-stone-400">Email vérifié</p>
            </div>
            <div className="flex-1 bg-stone-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-stone-400 mb-0.5">
                <IconPhone />
                <span className="text-lg font-bold text-stone-800">
                  {profile?.phone ? "✓" : "—"}
                </span>
              </div>
              <p className="text-xs text-stone-400">Téléphone</p>
            </div>
          </div>
        </div>

        {/* Carte formulaire / infos */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          {/* Header de la carte */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-stone-100">
            <h2 className="font-semibold text-stone-800 text-sm sm:text-base">
              Informations personnelles
            </h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors"
              >
                <IconEdit />
                Modifier
              </button>
            )}
          </div>

          {/* Feedback */}
          {success && (
            <div className="mx-4 sm:mx-6 mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 text-green-700 text-sm">
              <IconCheck />
              Profil mis à jour avec succès !
            </div>
          )}
          {error && (
            <div className="mx-4 sm:mx-6 mt-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-red-600 text-sm">
              {error}
            </div>
          )}

          {editMode ? (
            /* ── MODE ÉDITION ── */
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              {/* Nom complet */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <IconUser /> Nom complet
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ton nom complet"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-stone-300"
                />
              </div>

              {/* Email (lecture seule) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <IconMail /> Email
                  <span className="text-[10px] bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded-full font-normal normal-case tracking-normal">
                    via Facebook · non modifiable
                  </span>
                </label>
                <div className="w-full px-3.5 py-2.5 rounded-xl border border-stone-100 bg-stone-50 text-stone-400 text-sm select-none">
                  {profile?.email ?? "—"}
                </div>
              </div>

              {/* Téléphone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                  <IconPhone /> Téléphone
                  {!profile?.phone && (
                    <span className="text-[10px] bg-orange-100 text-orange-500 px-1.5 py-0.5 rounded-full font-normal normal-case tracking-normal">
                      recommandé
                    </span>
                  )}
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-stone-300"
                />
                <p className="text-xs text-stone-400">
                  Visible par les acheteurs intéressés par tes annonces.
                </p>
              </div>

              {/* Ville + Région sur la même ligne */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                    <IconMapPin /> Ville
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Paris"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-stone-300"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Région
                  </label>
                  <input
                    type="text"
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    placeholder="Île-de-France"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-stone-300"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <IconLoader />
                      Enregistrement…
                    </>
                  ) : (
                    "Enregistrer"
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ── MODE LECTURE ── */
            <div className="p-4 sm:p-6 space-y-0 divide-y divide-stone-50">
              <InfoRow icon={<IconUser />} label="Nom complet" value={profile?.name} />
              <InfoRow icon={<IconMail />} label="Email" value={profile?.email} />
              <InfoRow
                icon={<IconPhone />}
                label="Téléphone"
                value={profile?.phone}
                empty="Non renseigné"
                highlight={!profile?.phone}
              />
              <InfoRow
                icon={<IconMapPin />}
                label="Localisation"
                value={
                  [profile?.city, profile?.region].filter(Boolean).join(", ") || null
                }
                empty="Non renseignée"
              />
            </div>
          )}
        </div>

        {/* Hint connexion FB */}
        <p className="text-center text-xs text-stone-400 mt-4 flex items-center justify-center gap-1.5">
          <span className="text-blue-400"><IconFacebook /></span>
          Connecté via Facebook · L&apos;email est géré par Meta
        </p>
      </div>
    </div>
  );
}

// ─── Sous-composant ligne d'info ──────────────────────────
function InfoRow({
  icon,
  label,
  value,
  empty = "Non renseigné",
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  empty?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5">
      <div className="mt-0.5 text-stone-400 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-stone-400 font-medium mb-0.5">{label}</p>
        {value ? (
          <p className="text-sm text-stone-800 font-medium break-all">{value}</p>
        ) : (
          <p className={`text-sm italic ${highlight ? "text-orange-400" : "text-stone-300"}`}>
            {empty}
            {highlight && " · Ajoute-le pour tes annonces"}
          </p>
        )}
      </div>
    </div>
  );
}
