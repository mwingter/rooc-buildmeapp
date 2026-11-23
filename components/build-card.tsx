import Link from "next/link";
import type { BuildCardData } from "@/lib/catalog";

export function BuildCard({ build }: { build: BuildCardData }) {
  return (
    <article className="card group overflow-hidden">
      <div className="h-28 bg-gradient-to-br from-violet-100 via-amber-50 to-slate-100 p-5 dark:from-violet-950 dark:via-slate-900 dark:to-slate-800">
        <div className="flex items-start justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-violet-200 bg-white/80 text-lg font-black text-violet-700 dark:border-violet-800 dark:bg-slate-950">
            {build.className.slice(0, 2).toUpperCase()}
          </span>
          {build.official && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300">◆ Guilda oficial</span>}
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">{build.className} · {build.specialization}</p>
        <h3 className="mt-1 text-xl font-black">
          <Link className="hover:text-violet-700" href={`/builds/${build.id}`}>{build.name}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{build.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {build.content.map((content) => <span key={content} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold dark:bg-slate-800">{content}</span>)}
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
          <span className="text-slate-500">por <strong className="text-slate-800 dark:text-slate-200">{build.author}</strong></span>
          <span aria-label={`${build.likes} curtidas`}>♡ {build.likes}</span>
        </div>
      </div>
    </article>
  );
}
