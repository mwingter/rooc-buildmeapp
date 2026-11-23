import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const { action } = await request.json();
  if (action === "like") {
    await prisma.like.upsert({ where: { userId_buildId: { userId: session.user.id, buildId: params.id } }, create: { userId: session.user.id, buildId: params.id }, update: {} });
  } else if (action === "favorite") {
    await prisma.favorite.upsert({ where: { userId_buildId: { userId: session.user.id, buildId: params.id } }, create: { userId: session.user.id, buildId: params.id }, update: {} });
  } else {
    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
