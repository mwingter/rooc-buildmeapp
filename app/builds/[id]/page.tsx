import { notFound } from "next/navigation";
import { demoBuilds } from "@/lib/catalog";

export default function BuildDetailPage({ params }: { params: { id: string } }) {
  const build = demoBuilds.find((item) => item.id === params.id);
  if (!build) notFound();
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <article className="card p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-violet-700 dark:text-violet-300">{build.className} · {build.specialization}</p>
            <h1 className="mt-1 text-3xl font-black">{build.name}</h1>
            <p className="mt-2 text-sm text-slate-500">por {build.author} · Patch {build.patchVersion}</p>
          </div>
          {build.official && <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300">◆ Build oficial da guilda</span>}
        </div>
        <p className="mt-6 text-slate-700 dark:text-slate-300">{build.description}</p>

        <section className="mt-8">
          <h2 className="text-xl font-black">Atributos</h2>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {Object.entries(build.attributes).map(([name, value]) => (
              <div key={name} className="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-800"><p className="text-xs font-bold text-slate-500">{name}</p><p className="text-xl font-black">{value}</p></div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-black">Skills</h2>
            <ul className="mt-3 space-y-2">{build.skills.map((skill) => <li key={skill.name} className="flex justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800"><span>{skill.name}</span><strong>Nv. {skill.level}</strong></li>)}</ul>
          </div>
          <div>
            <h2 className="text-xl font-black">Equipamentos</h2>
            <ul className="mt-3 space-y-2">{build.equipment.map((item) => <li key={item.slot} className="flex justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800"><span className="text-slate-500">{item.slot}</span><strong>{item.name}</strong></li>)}</ul>
          </div>
        </section>
        <section className="mt-8">
          <h2 className="text-xl font-black">Cartas</h2>
          <div className="mt-3 flex flex-wrap gap-3">{build.cards.map((card) => <div key={card.name} className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800"><span className="text-slate-500">{card.slot}</span><strong className="ml-2">{card.name}</strong></div>)}</div>
        </section>
      </article>

      <aside className="space-y-4">
        <div className="card p-5">
          <p className="text-sm font-bold text-slate-500">Conteúdo recomendado</p>
          <div className="mt-3 flex flex-wrap gap-2">{build.content.map((item) => <span key={item} className="rounded-lg bg-violet-100 px-3 py-1.5 text-sm font-bold text-violet-800 dark:bg-violet-950 dark:text-violet-300">{item}</span>)}</div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <button className="button-secondary" type="button" aria-label="Curtir">♡</button>
            <button className="button-secondary" type="button" aria-label="Favoritar">☆</button>
            <button className="button-secondary" type="button" aria-label="Clonar">⧉</button>
          </div>
        </div>
        <div className="card p-5">
          <h2 className="font-black">Comentários</h2>
          <p className="mt-2 text-sm text-slate-500">Faça login para participar da discussão.</p>
          <form className="mt-4">
            <label className="sr-only" htmlFor="comment">Comentário</label>
            <textarea className="input h-24 resize-none py-3" id="comment" placeholder="Escreva um comentário..." />
            <button className="button-primary mt-3 w-full" type="submit">Publicar</button>
          </form>
        </div>
      </aside>
    </div>
  );
}
