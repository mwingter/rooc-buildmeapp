"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [nick, setNick] = useState("");
  const [code, setCode] = useState("");
  async function generateCode() {
    const response = await fetch("/api/profile/nick", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nick }) });
    if (response.ok) setCode(await response.text());
  }
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="card p-6">
        <div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-full bg-violet-700 text-xl font-black text-white">M</div><div><h1 className="text-2xl font-black">Meu perfil</h1><p className="text-sm text-slate-500">Jogador da comunidade</p></div></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3"><div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-2xl font-black">3</p><p className="text-xs text-slate-500">Builds públicas</p></div><div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-2xl font-black">297</p><p className="text-xs text-slate-500">Curtidas</p></div><div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-2xl font-black">12</p><p className="text-xs text-slate-500">Amigos</p></div></div>
      </section>
      <section className="card p-6">
        <h2 className="text-xl font-black">Verificar nick do jogo</h2>
        <p className="mt-1 text-sm text-slate-500">Nenhuma senha da conta do jogo é necessária.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row"><input className="input" value={nick} onChange={(e) => setNick(e.target.value)} placeholder="Nick no Ragnarok Origin" aria-label="Nick no Ragnarok Origin" /><button className="button-primary" type="button" onClick={generateCode}>Gerar código</button></div>
        {code && <div className="mt-4 rounded-xl border border-dashed border-violet-400 bg-violet-50 p-4 dark:bg-violet-950"><p className="text-sm text-slate-600 dark:text-slate-300">Exiba este código temporariamente no campo público correspondente do seu perfil do jogo:</p><p className="mt-2 text-2xl font-black tracking-widest">{code}</p></div>}
      </section>
      <section className="card p-6"><h2 className="text-xl font-black">Amigos</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800"><span>RangerLuna</span><button className="button-secondary h-9 px-3" type="button">Convidar</button></div><div className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800"><span>PriestMain</span><button className="button-secondary h-9 px-3" type="button">Aceitar</button></div></div></section>
    </div>
  );
}
