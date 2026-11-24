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
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      gameNick: nick.trim(),
      nickVerified: false,
      nickCode: null,
      nickCodeExpires: null,
    },
  });
  return NextResponse.json({ nick: nick.trim(), saved: true });
}
