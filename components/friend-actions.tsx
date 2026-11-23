"use client";

import { useState } from "react";

export function FriendActions({ friendshipId, name }: { friendshipId: string; name: string }) {
  const [status, setStatus] = useState("");

  async function respond(value: "ACCEPTED" | "REJECTED") {
    setStatus("Atualizando...");
    const response = await fetch(`/api/friends/${friendshipId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value }),
    });
    setStatus(response.ok ? (value === "ACCEPTED" ? "Aceita" : "Recusada") : "Erro");
  }

  return (
    <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
      <p className="font-bold">{name}</p>
      {status ? <p className="mt-2 text-sm text-slate-500" role="status">{status}</p> : (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button className="button-primary h-9 px-3" type="button" onClick={() => respond("ACCEPTED")}>Aceitar</button>
          <button className="button-secondary h-9 px-3" type="button" onClick={() => respond("REJECTED")}>Recusar</button>
        </div>
      )}
    </div>
  );
}
