import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const { status } = await request.json();
  if (!["ACCEPTED", "REJECTED", "BLOCKED"].includes(status)) return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  const friendship = await prisma.friendship.findUnique({ where: { id: params.id } });
  if (!friendship || friendship.recipientId !== session.user.id) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  const updated = await prisma.friendship.update({ where: { id: params.id }, data: { status } });
  return NextResponse.json(updated);
}
