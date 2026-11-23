import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildSchema } from "@/lib/validation";

type SessionShape = { user?: { id?: string } } | null;
type BuildShape = {
  id: string;
  authorId: string;
  visibility: "PUBLIC" | "PRIVATE" | "FRIENDS" | "GUILD";
};

async function canRead(session: SessionShape, build: BuildShape | null) {
  if (!build) return false;
  if (build.visibility === "PUBLIC") return true;
  const userId = session?.user?.id;
  if (!userId) return false;
  if (build.authorId === userId) return true;
  if (build.visibility === "FRIENDS") {
    return !!(await prisma.friendship.findFirst({
      where: { status: "ACCEPTED", OR: [{ requesterId: userId, recipientId: build.authorId }, { requesterId: build.authorId, recipientId: userId }] },
    }));
  }
  if (build.visibility === "GUILD") {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    return !!user && ["MODERATOR", "ADMIN"].includes(user.role);
  }
  return false;
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  try {
    const build = await prisma.build.findUnique({ where: { id: params.id }, include: { author: true, class: true, comments: { include: { author: true } } } });
    if (!(await canRead(session as unknown as SessionShape, build))) return NextResponse.json({ error: "Acesso negado" }, { status: 404 });
    return NextResponse.json(build);
  } catch {
    return NextResponse.json({ error: "Build não encontrada" }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const parsed = buildSchema.partial().safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const build = await prisma.build.findUnique({ where: { id: params.id } });
  if (!build || build.authorId !== session.user.id) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  await prisma.buildVersion.create({ data: { buildId: build.id, snapshot: build, note: "Versão anterior" } });
  const updated = await prisma.build.update({
    where: { id: params.id },
    data: {
      ...(parsed.data.name ? { name: parsed.data.name } : {}),
      ...(parsed.data.description ? { description: parsed.data.description } : {}),
      ...(parsed.data.specialization ? { specialization: parsed.data.specialization } : {}),
      ...(parsed.data.role ? { role: parsed.data.role } : {}),
      ...(parsed.data.visibility ? { visibility: parsed.data.visibility } : {}),
      ...(parsed.data.patchVersion ? { patchVersion: parsed.data.patchVersion } : {}),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const build = await prisma.build.findUnique({ where: { id: params.id } });
  if (!build || build.authorId !== session.user.id) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  await prisma.build.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
