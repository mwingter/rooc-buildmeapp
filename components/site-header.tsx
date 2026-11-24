"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [dark, setDark] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("Perfil");
  useEffect(() => {
    setDark(localStorage.getItem("theme") === "dark");
    fetch("/api/auth/status", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((status: { authenticated?: boolean; user?: { name?: string | null; image?: string | null } } | null) => {
        if (status?.authenticated) {
          setAvatar(status.user?.image ?? null);
          setProfileName(status.user?.name ?? "Perfil");
        }
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-black text-violet-700" aria-label="ROOC Builds — início">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-700 text-sm text-white">RO</span>
          <span className="hidden sm:inline">ROOC Builds</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1" aria-label="Navegação principal">
          <Link className="button-secondary hidden sm:inline-flex" href="/builds">Explorar</Link>
          <Link className="button-secondary hidden md:inline-flex" href="/friends">Amigos</Link>
          <Link className="button-primary hidden sm:inline-flex" href="/friends#search">Adicionar amigos</Link>
          <Link className="button-secondary hidden lg:inline-flex" href="/guild">Guilda</Link>
          <Link className="button-primary" href="/builds/create">Nova build</Link>
          <button className="button-secondary px-3" type="button" onClick={toggleTheme} aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}>
            {dark ? "☀" : "◐"}
          </button>
          <Link className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-slate-200 text-sm font-bold dark:bg-slate-800" href="/profile" aria-label={profileName}>
            {avatar ? (
              <Image src={avatar} alt="" width={40} height={40} className="h-10 w-10 object-cover" />
            ) : (
              <span aria-hidden="true">M</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
