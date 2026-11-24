"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function SiteHeader() {
  const [dark, setDark] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("Perfil");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
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
  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

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
          <div className="relative" ref={menuRef}>
            <button
              className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-slate-200 text-sm font-bold dark:bg-slate-800"
              type="button"
              aria-label={`Abrir menu de ${profileName}`}
              aria-expanded={menuOpen}
              aria-controls="profile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {avatar ? <Image src={avatar} alt="" width={40} height={40} className="h-10 w-10 object-cover" /> : <span aria-hidden="true">M</span>}
            </button>
            {menuOpen && (
              <div id="profile-menu" className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                {[
                  ["/profile", "Perfil"],
                  ["/friends", "Amigos"],
                  ["/guild", "Guilda"],
                  ["/my-builds", "Minhas builds"],
                  ["/builds", "Explorar builds"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
