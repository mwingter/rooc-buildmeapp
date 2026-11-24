import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const member = await prisma.guildMember.findUnique({ where: { guildId_userId: { guildId: params.id, userId: session.user.id } } });
  if (member?.role !== "LEADER") return NextResponse.json({ error: "Apenas líderes podem recomendar builds" }, { status: 403 });
  const body = await request.json() as { buildId?: string };
  if (!body.buildId) return NextResponse.json({ error: "Build inválida" }, { status: 400 });
  const build = await prisma.build.findUnique({ where: { id: body.buildId }, select: { id: true, authorId: true, visibility: true } });
  if (!build || (build.visibility !== "PUBLIC" && build.authorId !== session.user.id)) return NextResponse.json({ error: "A build precisa ser pública ou sua" }, { status: 400 });
  const recommendation = await prisma.guildRecommendation.upsert({
    where: { guildId_buildId: { guildId: params.id, buildId: body.buildId } },
    update: { addedById: session.user.id },
    create: { guildId: params.id, buildId: body.buildId, addedById: session.user.id },
  });
  return NextResponse.json(recommendation, { status: 201 });
}
