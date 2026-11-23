"use client";

import { useEffect, useMemo, useState } from "react";
import { BuildCard } from "@/components/build-card";
import { classes } from "@/lib/catalog";
import type { BuildCardData } from "@/lib/catalog";

export default function BuildsPage() {
  const [q, setQ] = useState("");
  const [className, setClassName] = useState("");
  const [content, setContent] = useState("");
  const [builds, setBuilds] = useState<BuildCardData[]>([]);
  useEffect(() => {
    fetch("/api/builds")
      .then((response) => response.ok ? response.json() : [])
      .then((items: Array<{ id: string; name: string; description: string; role: string; specialization: string; patchVersion: string; official: boolean; content: string[]; class: { name: string }; author: { name: string | null; gameNick: string | null }; likes?: unknown[] }>) => {
        setBuilds(items.map((build) => ({
          id: build.id,
          name: build.name,
          description: build.description,
          role: build.role,
          specialization: build.specialization,
          patchVersion: build.patchVersion,
          official: build.official,
          content: build.content.map((value) => value === "PVE" ? "PvE" : value === "PVP" ? "PvP" : value),
          className: build.class.name,
          author: build.author.gameNick ?? build.author.name ?? "Jogador",
          likes: Array.isArray(build.likes) ? build.likes.length : 0,
          attributes: {},
          skills: [],
          equipment: [],
          cards: [],
        })));
      })
      .catch(() => setBuilds([]));
  }, []);
  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return builds.filter((build) =>
      (!className || build.className === className) &&
      (!content || build.content.includes(content)) &&
      (!query || `${build.name} ${build.className} ${build.specialization} ${build.author}`.toLowerCase().includes(query))
    );
  }, [q, className, content, builds]);

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-bold text-violet-700 dark:text-violet-300">Biblioteca</p>
        <h1 className="text-3xl font-black">Explorar builds</h1>
      </div>
      <form className="card mb-6 grid gap-3 p-4 md:grid-cols-[1fr_220px_180px_auto]" role="search" onSubmit={(event) => event.preventDefault()}>
        <div>
          <label className="label" htmlFor="q">Buscar</label>
          <input className="input" id="q" name="q" value={q} onChange={(event) => setQ(event.target.value)} placeholder="Nome, classe ou criador" />
        </div>
        <div>
          <label className="label" htmlFor="class">Classe</label>
          <select className="input" id="class" name="class" value={className} onChange={(event) => setClassName(event.target.value)}>
            <option value="">Todas</option>
            {classes.map((item) => <option key={item.slug}>{item.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="content">Conteúdo</label>
          <select className="input" id="content" name="content" value={content} onChange={(event) => setContent(event.target.value)}>
            <option value="">Todos</option>
            {["PvE", "PvP", "MVP", "WG"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <button className="button-primary md:mt-[26px]" type="submit">Filtrar</button>
      </form>
      {filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((build) => <BuildCard key={build.id} build={build} />)}
        </div>
      ) : (
        <div className="card py-16 text-center">
          <p className="text-lg font-black">Nenhuma build encontrada</p>
          <p className="mt-1 text-sm text-slate-500">Tente remover um filtro ou alterar a busca.</p>
        </div>
      )}
    </div>
  );
}
