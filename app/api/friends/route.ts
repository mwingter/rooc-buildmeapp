import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  if (isRateLimited(`friend:${session.user.id}`, 10)) return NextResponse.json({ error: "Muitas tentativas" }, { status: 429 });
  const { recipientId } = await request.json();
  if (typeof recipientId !== "string") return NextResponse.json({ error: "Destinatário inválido" }, { status: 400 });
  if (recipientId === session.user.id) return NextResponse.json({ error: "Você não pode adicionar a si mesmo" }, { status: 400 });
  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: session.user.id, recipientId },
        { requesterId: recipientId, recipientId: session.user.id },
      ],
    },
  });
  if (existing) {
    if (existing.status === "ACCEPTED") return NextResponse.json({ success: true, status: "ACCEPTED" });
    if (existing.status === "PENDING") return NextResponse.json({ success: true, status: "PENDING" });
  }
  const friendship = await prisma.friendship.upsert({
    where: { requesterId_recipientId: { requesterId: session.user.id, recipientId } },
    update: { status: "PENDING" },
    create: { requesterId: session.user.id, recipientId, status: "PENDING" },
  });
  return NextResponse.json(friendship, { status: 201 });
}
