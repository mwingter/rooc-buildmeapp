"use client";

import { FormEvent, useState } from "react";

type CommentData = {
  id: string;
  body: string;
  author: { name: string | null; gameNick: string | null };
  replies?: CommentData[];
};

export function BuildComments({ buildId, initialComments = [] }: { buildId: string; initialComments?: CommentData[] }) {
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState(initialComments);
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
      setComments((current) => [{
        id: `new-${Date.now()}`,
        body: String(body ?? ""),
        author: { name: "Você", gameNick: null },
        replies: [],
      }, ...current]);
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
      <div className="mt-5 space-y-3">
        {comments.map((comment) => (
          <article key={comment.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
            <p className="text-xs font-black text-violet-700 dark:text-violet-300">{comment.author.gameNick ?? comment.author.name ?? "Jogador"}</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{comment.body}</p>
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 space-y-2 border-l-2 border-slate-200 pl-3 dark:border-slate-700">
                {comment.replies.map((reply) => (
                  <div key={reply.id}>
                    <p className="text-xs font-black">{reply.author.gameNick ?? reply.author.name ?? "Jogador"}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{reply.body}</p>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
