import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const { nick } = await request.json();
  if (typeof nick !== "string" || nick.trim().length < 3 || nick.trim().length > 30) {
    return NextResponse.json({ error: "Nick inválido" }, { status: 400 });
  }
  const code = `ROOC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  await prisma.user.update({
    where: { id: session.user.id },
    data: { gameNick: nick.trim(), nickVerified: false, nickCode: code, nickCodeExpires: new Date(Date.now() + 15 * 60_000) },
  });
  return new NextResponse(code);
}
