"use client";

import { useState } from "react";

export function NickVerification({ initialNick }: { initialNick: string }) {
  const [nick, setNick] = useState(initialNick);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function saveNick() {
    setError("");
    setSaved(false);
    const response = await fetch("/api/profile/nick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nick }),
    });
    if (!response.ok) {
      setError("Não foi possível associar o nick.");
      return;
    }
    setSaved(true);
  }

  return (
    <section className="card p-6">
      <h2 className="text-xl font-black">Nick do Ragnarok Origin</h2>
      <p className="mt-1 text-sm text-slate-500">Informe o personagem que você usa. Não é necessária senha ou verificação da conta.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input className="input" value={nick} onChange={(event) => setNick(event.target.value)} placeholder="Nick no Ragnarok Origin" aria-label="Nick no Ragnarok Origin" />
        <button className="button-primary" type="button" onClick={saveNick}>Salvar nick</button>
      </div>
      {saved && <p role="status" className="mt-3 rounded-xl bg-emerald-100 p-3 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Nick associado ao perfil.</p>}
      {error && <p role="alert" className="mt-3 text-sm font-bold text-red-700">{error}</p>}
    </section>
  );
}
