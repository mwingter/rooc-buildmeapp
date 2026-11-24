import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function sessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function GET() {
  const userId = await sessionUser();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const guilds = await prisma.guild.findMany({
    include: {
      members: { include: { user: { select: { id: true, name: true, gameNick: true, image: true } } } },
      requests: { where: { status: "PENDING" }, include: { requester: { select: { id: true, name: true, gameNick: true, image: true } } } },
      recommendations: { include: { build: { include: { class: true, author: { select: { name: true, gameNick: true } } } } }, orderBy: { createdAt: "desc" } },
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(guilds.map((guild) => {
    const member = guild.members.some((item) => item.userId === userId);
    return member ? guild : { id: guild.id, name: guild.name, description: guild.description, members: [], requests: [], recommendations: [] };
  }));
}

export async function POST(request: NextRequest) {
  const userId = await sessionUser();
  if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const body = await request.json() as { name?: string; description?: string };
  const name = body.name?.trim();
  if (!name || name.length < 2 || name.length > 60) return NextResponse.json({ error: "Informe um nome de guilda válido" }, { status: 400 });
  const slug = `${name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)}-${Date.now().toString(36)}`;
  const guild = await prisma.guild.create({
    data: {
      name,
      slug,
      description: body.description?.trim().slice(0, 500) || null,
      ownerId: userId,
      members: { create: { userId, role: "LEADER" } },
    },
  });
  return NextResponse.json(guild, { status: 201 });
}
