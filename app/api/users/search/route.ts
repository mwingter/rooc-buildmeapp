import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ error: "Digite pelo menos 2 caracteres" }, { status: 400 });

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
      id: { not: session.user.id },
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { gameNick: { contains: q, mode: "insensitive" } },
        { accounts: { some: { provider: "discord", providerAccountId: { equals: q } } } },
      ],
    },
    select: {
      id: true,
      name: true,
      gameNick: true,
      image: true,
      accounts: { where: { provider: "discord" }, select: { providerAccountId: true } },
    },
    take: 20,
  });

  return NextResponse.json(users.map((user) => ({
    id: user.id,
    name: user.name,
    gameNick: user.gameNick,
    image: user.image,
    discordId: user.accounts[0]?.providerAccountId ?? null,
  })));
}
