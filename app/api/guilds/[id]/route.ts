import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function userId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

async function leader(guildId: string, id: string) {
  const member = await prisma.guildMember.findUnique({ where: { guildId_userId: { guildId, userId: id } } });
  return member?.role === "LEADER";
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = await userId();
  if (!id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const guild = await prisma.guild.findUnique({
    where: { id: params.id },
    include: {
      members: { include: { user: { select: { id: true, name: true, gameNick: true, image: true } } } },
      requests: { where: { status: "PENDING" }, include: { requester: { select: { id: true, name: true, gameNick: true, image: true } } } },
      recommendations: { include: { build: { include: { class: true, author: { select: { name: true, gameNick: true } } } } }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!guild) return NextResponse.json({ error: "Guilda não encontrada" }, { status: 404 });
  if (!(await prisma.guildMember.findUnique({ where: { guildId_userId: { guildId: guild.id, userId: id } } }))) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  return NextResponse.json(guild);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const id = await userId();
  if (!id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const body = await request.json() as { action?: string; userId?: string; requestId?: string; buildId?: string };
  const action = body.action;
  const isLeader = await leader(params.id, id);
  if (action === "request") {
    const member = await prisma.guildMember.findUnique({ where: { guildId_userId: { guildId: params.id, userId: id } } });
    if (member) return NextResponse.json({ error: "Você já é membro" }, { status: 409 });
    const requestRow = await prisma.guildJoinRequest.upsert({
      where: { guildId_requesterId: { guildId: params.id, requesterId: id } },
      update: { status: "PENDING" },
      create: { guildId: params.id, requesterId: id },
    });
    return NextResponse.json(requestRow, { status: 201 });
  }
  if (!isLeader) return NextResponse.json({ error: "Apenas líderes podem executar esta ação" }, { status: 403 });
  if (action === "approve" || action === "reject") {
    if (!body.requestId) return NextResponse.json({ error: "Solicitação inválida" }, { status: 400 });
    const joinRequest = await prisma.guildJoinRequest.findUnique({ where: { id: body.requestId } });
    if (!joinRequest || joinRequest.guildId !== params.id) return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
    await prisma.guildJoinRequest.update({ where: { id: joinRequest.id }, data: { status: action === "approve" ? "ACCEPTED" : "REJECTED" } });
    if (action === "approve") await prisma.guildMember.upsert({ where: { guildId_userId: { guildId: params.id, userId: joinRequest.requesterId } }, update: {}, create: { guildId: params.id, userId: joinRequest.requesterId, role: "MEMBER" } });
    return NextResponse.json({ success: true });
  }
  if (action === "set-leader" || action === "remove-leader") {
    if (!body.userId || body.userId === id) return NextResponse.json({ error: "Membro inválido" }, { status: 400 });
    const member = await prisma.guildMember.findUnique({ where: { guildId_userId: { guildId: params.id, userId: body.userId } } });
    if (!member) return NextResponse.json({ error: "Membro não encontrado" }, { status: 404 });
    await prisma.guildMember.update({ where: { guildId_userId: { guildId: params.id, userId: body.userId } }, data: { role: action === "set-leader" ? "LEADER" : "MEMBER" } });
    return NextResponse.json({ success: true });
  }
  if (action === "leave") {
    if (isLeader) return NextResponse.json({ error: "O criador deve transferir a liderança antes de sair" }, { status: 400 });
    await prisma.guildMember.delete({ where: { guildId_userId: { guildId: params.id, userId: id } } });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
}
