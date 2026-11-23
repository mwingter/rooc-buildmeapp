import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { BuildActions } from "@/components/build-actions";
import { BuildComments } from "@/components/build-comments";

export const dynamic = "force-dynamic";

export default async function BuildDetailPage({ params }: { params: { id: string } }) {
  let build: Prisma.BuildGetPayload<{ include: { author: true; class: true } }> | null = null;
  try {
    build = await prisma.build.findUnique({
      where: { id: params.id },
      include: { author: true, class: true },
    });
  } catch {}
  if (!build) notFound();
  const attributes = build.attributes as unknown as Record<string, number>;
  const skills = build.skills as unknown as { name: string; level: number }[];
  const equipment = build.equipment as unknown as { slot: string; name: string }[];
  const cards = build.cards as unknown as { slot: string; name: string }[];
  const content = build.content.map((item) => item === "PVE" ? "PvE" : item === "PVP" ? "PvP" : item);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <article className="card p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-violet-700 dark:text-violet-300">{build.class.name} · {build.specialization}</p>
            <h1 className="mt-1 text-3xl font-black">{build.name}</h1>
            <p className="mt-2 text-sm text-slate-500">por {build.author.gameNick ?? build.author.name ?? "Jogador"} · Patch {build.patchVersion}</p>
          </div>
          {build.official && <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-black text-amber-800 dark:bg-amber-950 dark:text-amber-300">◆ Build oficial da guilda</span>}
        </div>
        <p className="mt-6 text-slate-700 dark:text-slate-300">{build.description}</p>

        <section className="mt-8">
          <h2 className="text-xl font-black">Atributos</h2>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {Object.entries(attributes).map(([name, value]) => (
              <div key={name} className="rounded-xl bg-slate-100 p-3 text-center dark:bg-slate-800"><p className="text-xs font-bold text-slate-500">{name}</p><p className="text-xl font-black">{value}</p></div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-black">Skills</h2>
            <ul className="mt-3 space-y-2">{skills.map((skill) => <li key={skill.name} className="flex justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800"><span>{skill.name}</span><strong>Nv. {skill.level}</strong></li>)}</ul>
          </div>
          <div>
            <h2 className="text-xl font-black">Equipamentos</h2>
            <ul className="mt-3 space-y-2">{equipment.map((item) => <li key={item.slot} className="flex justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800"><span className="text-slate-500">{item.slot}</span><strong>{item.name}</strong></li>)}</ul>
          </div>
        </section>
        <section className="mt-8">
          <h2 className="text-xl font-black">Cartas</h2>
          <div className="mt-3 flex flex-wrap gap-3">{cards.map((card) => <div key={card.name} className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800"><span className="text-slate-500">{card.slot}</span><strong className="ml-2">{card.name}</strong></div>)}</div>
        </section>
      </article>

      <aside className="space-y-4">
        <div className="card p-5">
          <p className="text-sm font-bold text-slate-500">Conteúdo recomendado</p>
          <div className="mt-3 flex flex-wrap gap-2">{content.map((item) => <span key={item} className="rounded-lg bg-violet-100 px-3 py-1.5 text-sm font-bold text-violet-800 dark:bg-violet-950 dark:text-violet-300">{item}</span>)}</div>
        </div>
        <BuildActions buildId={build.id} />
        <BuildComments buildId={build.id} />
      </aside>
    </div>
  );
}
