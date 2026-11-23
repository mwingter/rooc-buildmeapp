import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const user = session?.user?.id ? await prisma.user.findUnique({ where: { id: session.user.id } }) : null;
  if (!user || !["MODERATOR", "ADMIN"].includes(user.role)) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  const { official } = await request.json();
  if (typeof official !== "boolean") return NextResponse.json({ error: "Valor inválido" }, { status: 400 });
  const build = await prisma.build.update({ where: { id: params.id }, data: { official } });
  await prisma.auditLog.create({ data: { actorId: user.id, action: official ? "BUILD_MARK_OFFICIAL" : "BUILD_UNMARK_OFFICIAL", targetId: params.id } });
  return NextResponse.json(build);
}
