import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FriendActions } from "@/components/friend-actions";

export const dynamic = "force-dynamic";

export default async function FriendsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [received, sent, accepted] = await Promise.all([
    prisma.friendship.findMany({
      where: { recipientId: session.user.id, status: "PENDING" },
      include: { requester: { select: { id: true, name: true, gameNick: true, image: true } } },
    }),
    prisma.friendship.findMany({
      where: { requesterId: session.user.id, status: "PENDING" },
      include: { recipient: { select: { id: true, name: true, gameNick: true, image: true } } },
    }),
    prisma.friendship.findMany({
      where: {
        status: "ACCEPTED",
        OR: [{ requesterId: session.user.id }, { recipientId: session.user.id }],
      },
      include: { requester: true, recipient: true },
    }),
  ]);

  const friends = accepted.map((item) =>
    item.requesterId === session.user.id ? item.recipient : item.requester,
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-bold text-violet-700 dark:text-violet-300">Rede social</p>
        <h1 className="text-3xl font-black">Amigos</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="card p-5">
          <h2 className="text-xl font-black">Amigos ({friends.length})</h2>
          {friends.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700">Nenhum amigo adicionado.</div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {friends.map((friend) => (
                <article key={friend.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-violet-700 text-sm font-black text-white">{(friend.gameNick ?? friend.name ?? "J").slice(0, 1).toUpperCase()}</div>
                  <div className="min-w-0"><p className="truncate font-bold">{friend.gameNick ?? friend.name ?? "Jogador"}</p><p className="text-xs text-slate-500">Builds privadas entre amigos habilitadas</p></div>
                </article>
              ))}
            </div>
          )}
        </section>
        <aside className="space-y-4">
          <section className="card p-5">
            <h2 className="font-black">Solicitações recebidas</h2>
            {received.length === 0 ? <p className="mt-3 text-sm text-slate-500">Nenhuma solicitação pendente.</p> : (
              <div className="mt-3 space-y-2">
                {received.map((item) => (
                  <FriendActions key={item.id} friendshipId={item.id} name={item.requester.gameNick ?? item.requester.name ?? "Jogador"} />
                ))}
              </div>
            )}
          </section>
          <section className="card p-5">
            <h2 className="font-black">Solicitações enviadas</h2>
            {sent.length === 0 ? <p className="mt-3 text-sm text-slate-500">Nenhuma solicitação enviada.</p> : (
              <div className="mt-3 space-y-2">{sent.map((item) => <p key={item.id} className="rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">{item.recipient.gameNick ?? item.recipient.name ?? "Jogador"} · Pendente</p>)}</div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
