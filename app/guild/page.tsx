import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function GuildPage() {
  let builds: Prisma.BuildGetPayload<{ include: { author: true; class: true } }>[] = [];
  try {
    builds = await prisma.build.findMany({
      where: { official: true, visibility: "PUBLIC" },
      include: { author: true, class: true },
      orderBy: { updatedAt: "desc" },
      take: 30,
    });
  } catch {}

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/20 blur-3xl" />
        <p className="text-sm font-bold uppercase tracking-wider text-amber-300">Guild hub</p>
        <h1 className="mt-1 text-3xl font-black">Recomendações da guilda</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">Builds aprovadas e destacadas por moderadores ou cargos administrativos.</p>
      </div>
      {builds.length === 0 ? (
        <div className="card py-16 text-center">
          <p className="text-lg font-black">Nenhuma recomendação publicada</p>
          <p className="mt-1 text-sm text-slate-500">Um moderador ou administrador pode destacar uma build pública.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {builds.map((build) => (
            <article className="card p-5" key={build.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-amber-700 dark:text-amber-300">◆ Recomendação oficial</p>
                  <h2 className="mt-1 text-lg font-black"><Link className="hover:text-violet-700" href={`/builds/${build.id}`}>{build.name}</Link></h2>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{build.description}</p>
              <p className="mt-4 text-xs font-bold text-slate-500">{build.class.name} · {build.specialization} · Patch {build.patchVersion}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
