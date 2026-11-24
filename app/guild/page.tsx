"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Guild = {
  id: string;
  name: string;
  description: string | null;
  members: Array<{ userId: string; role: "LEADER" | "MEMBER"; user: { name: string | null; gameNick: string | null } }>;
  requests: Array<{ id: string; requester: { name: string | null; gameNick: string | null } }>;
  recommendations: Array<{ build: { id: string; name: string; specialization: string; class: { name: string } } }>;
};

async function updateGuild(id: string, body: Record<string, string>) {
  const response = await fetch(`/api/guilds/${id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error((await response.json()).error ?? "Não foi possível concluir a ação");
}

export default function GuildPage() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [buildIds, setBuildIds] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/guilds", { cache: "no-store" });
    if (response.ok) setGuilds(await response.json());
    else setError("Entre na sua conta para acessar as guildas.");
    setLoading(false);
  }
  useEffect(() => { void load(); }, []);

  async function createGuild(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/guilds", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, description }) });
    if (!response.ok) { setError((await response.json()).error ?? "Não foi possível criar a guilda"); return; }
    setName(""); setDescription(""); await load();
  }

  async function requestAccess(id: string) {
    try { await updateGuild(id, { action: "request" }); setError("Solicitação enviada."); } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível solicitar acesso"); }
  }

  async function recommendBuild(id: string) {
    const buildId = buildIds[id]?.trim();
    if (!buildId) return;
    const response = await fetch(`/api/guilds/${id}/recommendations`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ buildId }) });
    if (!response.ok) { setError((await response.json()).error ?? "Não foi possível recomendar a build"); return; }
    setBuildIds((current) => ({ ...current, [id]: "" }));
    await load();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wider text-amber-300">Guildas privadas</p>
        <h1 className="mt-1 text-3xl font-black">Sua comunidade, com acesso controlado</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">Crie um perfil privado, aprove membros e destaque recomendações com seus líderes.</p>
      </div>
      {error && <p role="status" className="rounded-xl bg-violet-100 px-4 py-3 text-sm font-semibold text-violet-900 dark:bg-violet-950 dark:text-violet-200">{error}</p>}
      <form className="card grid gap-3 p-5 md:grid-cols-[1fr_1fr_auto]" onSubmit={createGuild}>
        <div><label className="label" htmlFor="guild-name">Criar guilda</label><input className="input" id="guild-name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome da guilda" /></div>
        <div><label className="label" htmlFor="guild-description">Descrição</label><input className="input" id="guild-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Objetivo ou servidor" /></div>
        <button className="button-primary md:mt-6" type="submit">Criar</button>
      </form>
      {loading ? <div className="card py-12 text-center text-sm text-slate-500">Carregando guildas...</div> : guilds.length === 0 ? <div className="card py-12 text-center text-sm text-slate-500">Você ainda não participa de uma guilda.</div> : (
        <div className="grid gap-5 lg:grid-cols-2">
          {guilds.map((guild) => {
            const leader = guild.members.some((member) => member.role === "LEADER");
            const hasAccess = guild.members.length > 0;
            return <article className="card p-5" key={guild.id}>
              <div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-black">{guild.name}</h2><p className="mt-1 text-sm text-slate-500">{guild.description || "Sem descrição"}</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">Privada</span></div>
              <p className="mt-4 text-sm font-semibold text-slate-500">{guild.members.length} membro(s)</p>
              <div className="mt-4 space-y-2">{guild.members.map((member) => <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800" key={member.userId}>{member.user.gameNick ?? member.user.name ?? "Jogador"} · {member.role === "LEADER" ? "Liderança" : "Membro"}</p>)}</div>
              {leader && guild.requests.length > 0 && <section className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800"><h3 className="font-black">Solicitações pendentes</h3>{guild.requests.map((request) => <div className="mt-2 flex items-center justify-between gap-2 text-sm" key={request.id}><span>{request.requester.gameNick ?? request.requester.name ?? "Jogador"}</span><span className="flex gap-2"><button className="button-primary px-3 py-1.5 text-xs" onClick={async () => { await updateGuild(guild.id, { action: "approve", requestId: request.id }); await load(); }}>Aceitar</button><button className="button-secondary px-3 py-1.5 text-xs" onClick={async () => { await updateGuild(guild.id, { action: "reject", requestId: request.id }); await load(); }}>Recusar</button></span></div>)}</section>}
              <section className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800"><h3 className="font-black">Builds recomendadas</h3>{guild.recommendations.length === 0 ? <p className="mt-2 text-sm text-slate-500">Nenhuma recomendação ainda.</p> : guild.recommendations.map(({ build }) => <Link className="mt-2 block rounded-lg bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-900 dark:bg-violet-950 dark:text-violet-200" href={`/builds/${build.id}`} key={build.id}>{build.name} · {build.class.name} · {build.specialization}</Link>)}</section>
              {leader && <div className="mt-3 flex gap-2"><input className="input min-w-0 flex-1" value={buildIds[guild.id] ?? ""} onChange={(event) => setBuildIds((current) => ({ ...current, [guild.id]: event.target.value }))} placeholder="ID da build pública" aria-label={`ID da build para ${guild.name}`} /><button className="button-secondary shrink-0" type="button" onClick={() => recommendBuild(guild.id)}>Recomendar</button></div>}
              {!hasAccess && <button className="button-secondary mt-5 w-full" type="button" onClick={() => requestAccess(guild.id)}>Solicitar acesso</button>}
            </article>;
          })}
        </div>
      )}
    </div>
  );
}
