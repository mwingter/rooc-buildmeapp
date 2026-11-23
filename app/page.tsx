import Link from "next/link";
import { BuildCard } from "@/components/build-card";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let builds: Prisma.BuildGetPayload<{ include: { author: true; class: true } }>[] = [];
  try {
    builds = await prisma.build.findMany({
      where: { visibility: "PUBLIC" },
      include: { author: true, class: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch {
    builds = [];
  }

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white sm:px-10 sm:py-16">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-700/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-violet-300">Comunidade Ragnarok Origin</p>
          <h1 className="text-4xl font-black leading-tight sm:text-5xl">Construa. Compartilhe. Evolua.</h1>
          <p className="mt-4 max-w-xl text-slate-300">Planos de atributos, equipamentos e cartas revisados pela guilda e pela comunidade.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/builds" className="button-primary">Explorar builds</Link>
            <Link href="/builds/create" className="button border border-white/20 bg-white/10 text-white hover:bg-white/20">Criar minha build</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-violet-700 dark:text-violet-300">Em destaque</p>
            <h2 className="text-2xl font-black">Builds recomendadas</h2>
          </div>
          <Link href="/builds" className="text-sm font-bold text-violet-700 dark:text-violet-300">Ver todas →</Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {builds.map((build) => <BuildCard key={build.id} build={{
            id: build.id,
            name: build.name,
            className: build.class.name,
            specialization: build.specialization,
            role: build.role,
            content: build.content.map((value) => value === "PVE" ? "PvE" : value === "PVP" ? "PvP" : value),
            patchVersion: build.patchVersion,
            description: build.description,
            official: build.official,
            author: build.author.gameNick ?? build.author.name ?? "Jogador",
            likes: 0,
            attributes: {},
            skills: [],
            equipment: [],
            cards: [],
          }} />)}
        </div>
      </section>
    </div>
  );
}
