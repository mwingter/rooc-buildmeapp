"use client";

import { FormEvent, useState } from "react";

export function BuildComments({ buildId }: { buildId: string }) {
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = event.currentTarget;
    const body = new FormData(form).get("body");
    const response = await fetch(`/api/builds/${buildId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (response.ok) {
      form.reset();
      setMessage("Comentário publicado.");
    } else {
      setMessage("Faça login para comentar ou verifique a permissão da build.");
    }
  }
  return (
    <div className="card p-5">
      <h2 className="font-black">Comentários</h2>
      <form className="mt-4" onSubmit={submit}>
        <label className="sr-only" htmlFor={`comment-${buildId}`}>Comentário</label>
        <textarea className="input h-24 resize-none py-3" id={`comment-${buildId}`} name="body" minLength={1} maxLength={2000} required placeholder="Escreva um comentário..." />
        <button className="button-primary mt-3 w-full" type="submit">Publicar</button>
      </form>
      {message && <p role="status" className="mt-3 text-sm font-bold">{message}</p>}
    </div>
  );
}
