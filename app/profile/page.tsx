import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NickVerification } from "@/components/nick-verification";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      builds: { where: { visibility: "PUBLIC" } },
      _count: { select: { builds: true, favorites: true } },
    },
  });
  if (!user) redirect("/login");
  const friendships = await prisma.friendship.count({
    where: { status: "ACCEPTED", OR: [{ requesterId: user.id }, { recipientId: user.id }] },
  });
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="card p-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-violet-700 text-xl font-black text-white">
            {(user.gameNick ?? user.name ?? "J").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black">{user.name ?? "Jogador"}</h1>
            <p className="text-sm text-slate-500">{user.gameNick ? `Personagem: ${user.gameNick}` : "Nenhum personagem associado"}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-2xl font-black">{user._count.builds}</p><p className="text-xs text-slate-500">Builds</p></div>
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-2xl font-black">{user.builds.length}</p><p className="text-xs text-slate-500">Builds públicas</p></div>
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800"><p className="text-2xl font-black">{friendships}</p><p className="text-xs text-slate-500">Amigos</p></div>
        </div>
      </section>
      <NickVerification initialNick={user.gameNick ?? ""} />
    </div>
  );
}
