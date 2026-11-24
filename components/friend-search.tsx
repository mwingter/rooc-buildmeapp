"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

type FriendResult = {
  id: string;
  name: string | null;
  gameNick: string | null;
  image: string | null;
  discordId: string | null;
};

export function FriendSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FriendResult[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function search(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setResults([]);
    const response = await fetch(`/api/users/search?q=${encodeURIComponent(query.trim())}`);
    if (!response.ok) {
      setMessage("Não foi possível realizar a busca.");
      setLoading(false);
      return;
    }
    setResults(await response.json());
    setLoading(false);
  }

  async function addFriend(recipientId: string) {
    setMessage("");
    const response = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientId }),
    });
    setMessage(response.ok ? "Solicitação enviada." : "Não foi possível enviar a solicitação.");
  }

  return (
    <section id="search" className="card p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">Buscar jogadores</p>
      <h2 className="mt-1 text-xl font-black">Adicionar amigos</h2>
      <form className="mt-4 flex gap-2" onSubmit={search}>
        <label className="sr-only" htmlFor="friend-query">Nick do jogo, nome ou ID do Discord</label>
        <input
          id="friend-query"
          className="input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          minLength={2}
          required
          placeholder="Nick do jogo, nome ou ID do Discord"
        />
        <button className="button-primary shrink-0" type="submit" disabled={loading}>{loading ? "Buscando..." : "Buscar"}</button>
      </form>
      {message && <p role="status" className="mt-3 text-sm font-bold">{message}</p>}
      {results.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {results.map((user) => (
            <article key={user.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
              {user.image ? (
                <Image src={user.image} alt={`Foto de ${user.name ?? "usuário"}`} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
              ) : (
                <div className="grid h-11 w-11 place-items-center rounded-full bg-violet-700 text-sm font-black text-white">{(user.gameNick ?? user.name ?? "J").slice(0, 1).toUpperCase()}</div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{user.gameNick ?? user.name ?? "Jogador"}</p>
                <p className="truncate text-xs text-slate-500">{user.name ?? "Sem nome Discord"}{user.discordId ? ` · ${user.discordId}` : ""}</p>
              </div>
              <button className="button-secondary h-9 shrink-0 px-3" type="button" onClick={() => addFriend(user.id)}>Adicionar</button>
            </article>
          ))}
        </div>
      ) : (
        !loading && query.length > 0 && message === "" && <p className="mt-4 text-sm text-slate-500">Nenhum jogador encontrado.</p>
      )}
    </section>
  );
}
