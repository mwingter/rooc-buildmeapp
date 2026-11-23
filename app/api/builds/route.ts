import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import type { BuildContent, Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  try {
    const builds = await prisma.build.findMany({
      where: {
        visibility: "PUBLIC",
        ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] } : {}),
      },
      include: { author: { select: { name: true, gameNick: true } }, class: true, _count: { select: { likes: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(builds);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  if (isRateLimited(`build:${session.user.id}`, 10, 60_000)) return NextResponse.json({ error: "Muitas tentativas" }, { status: 429 });
  const parsed = buildSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  try {
    const gameClass = await prisma.gameClass.findFirst({ where: { name: parsed.data.className } });
    if (!gameClass) return NextResponse.json({ error: "Classe inválida" }, { status: 400 });
    const content: BuildContent[] = parsed.data.content.map((value) => {
      if (value === "PvE") return "PVE";
      if (value === "PvP") return "PVP";
      if (value === "MVP") return "MVP";
      return "WG";
    });
    const build = await prisma.build.create({
      data: {
        authorId: session.user.id,
        name: parsed.data.name,
        description: parsed.data.description,
        classId: gameClass.id,
        specialization: parsed.data.specialization,
        role: parsed.data.role,
        content,
        patchVersion: parsed.data.patchVersion,
        visibility: parsed.data.visibility,
        attributes: parsed.data.attributes as Prisma.InputJsonValue,
        skills: parsed.data.skills as Prisma.InputJsonValue,
        equipment: parsed.data.equipment as Prisma.InputJsonValue,
        cards: parsed.data.cards as Prisma.InputJsonValue,
        runes: (parsed.data.runes ?? {}) as Prisma.InputJsonValue,
        astrocore: (parsed.data.astrocore ?? {}) as Prisma.InputJsonValue,
        mechanics: (parsed.data.mechanics ?? {}) as Prisma.InputJsonValue,
      },
    });
    await prisma.buildVersion.create({ data: { buildId: build.id, snapshot: build, note: "Versão inicial" } });
    return NextResponse.json(build, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Não foi possível salvar a build" }, { status: 500 });
  }
}
