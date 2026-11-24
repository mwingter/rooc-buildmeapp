import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MyBuildsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const builds = await prisma.build.findMany({
    where: { authorId: session.user.id },
    include: { class: true, _count: { select: { likes: true, comments: true, favorites: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-sm font-bold text-violet-700 dark:text-violet-300">Biblioteca pessoal</p><h1 className="text-3xl font-black">Minhas builds</h1></div>
        <Link className="button-primary" href="/builds/create">Nova build</Link>
      </div>
      {builds.length === 0 ? (
        <div className="card py-16 text-center"><p className="text-lg font-black">Você ainda não criou uma build</p><p className="mt-1 text-sm text-slate-500">Monte seu primeiro preset e compartilhe com a comunidade.</p><Link className="button-primary mt-5 inline-flex" href="/builds/create">Criar build</Link></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {builds.map((build) => <article className="card p-5" key={build.id}>
            <p className="text-xs font-bold uppercase text-violet-700 dark:text-violet-300">{build.class.name} · {build.specialization}</p>
            <h2 className="mt-1 text-xl font-black"><Link href={`/builds/${build.id}`} className="hover:text-violet-700">{build.name}</Link></h2>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">{build.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500"><span>{build.visibility === "PUBLIC" ? "Pública" : build.visibility === "PRIVATE" ? "Privada" : build.visibility === "FRIENDS" ? "Amigos" : "Guilda"}</span><span>{build._count.likes} curtidas · {build._count.comments} comentários</span></div>
          </article>)}
        </div>
      )}
    </div>
  );
}
