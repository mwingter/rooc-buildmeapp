"use client";

import { useState } from "react";

export function BuildActions({ buildId }: { buildId: string }) {
  const [message, setMessage] = useState("");

  async function action(type: "like" | "favorite" | "clone") {
    setMessage("");
    const response = type === "clone"
      ? await fetch(`/api/builds/${buildId}/clone`, { method: "POST" })
      : await fetch(`/api/builds/${buildId}/actions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: type }),
        });
    setMessage(response.ok ? (type === "clone" ? "Build clonada." : "Ação concluída.") : "Faça login para continuar.");
  }

  return (
    <div className="card p-5">
      <p className="text-sm font-bold text-slate-500">Interações</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button className="button-secondary" type="button" onClick={() => action("like")} aria-label="Curtir">♡</button>
        <button className="button-secondary" type="button" onClick={() => action("favorite")} aria-label="Favoritar">☆</button>
        <button className="button-secondary" type="button" onClick={() => action("clone")} aria-label="Clonar">⧉</button>
      </div>
      {message && <p role="status" className="mt-3 text-sm font-bold">{message}</p>}
    </div>
  );
}
