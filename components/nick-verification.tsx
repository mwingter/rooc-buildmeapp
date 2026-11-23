"use client";

import { useState } from "react";

export function NickVerification({ initialNick }: { initialNick: string }) {
  const [nick, setNick] = useState(initialNick);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function generateCode() {
    setError("");
    setCode("");
    const response = await fetch("/api/profile/nick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nick }),
    });
    if (!response.ok) {
      setError("Não foi possível gerar o código.");
      return;
    }
    setCode(await response.text());
  }

  return (
    <section className="card p-6">
      <h2 className="text-xl font-black">Verificar nick do jogo</h2>
      <p className="mt-1 text-sm text-slate-500">Nenhuma senha da conta do jogo é necessária.</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input className="input" value={nick} onChange={(event) => setNick(event.target.value)} placeholder="Nick no Ragnarok Origin" aria-label="Nick no Ragnarok Origin" />
        <button className="button-primary" type="button" onClick={generateCode}>Gerar código</button>
      </div>
      {code && <div className="mt-4 rounded-xl border border-dashed border-violet-400 bg-violet-50 p-4 dark:bg-violet-950"><p className="text-sm">Exiba este código temporariamente no campo público correspondente do perfil do jogo:</p><p className="mt-2 text-2xl font-black tracking-widest">{code}</p></div>}
      {error && <p role="alert" className="mt-3 text-sm font-bold text-red-700">{error}</p>}
    </section>
  );
}
