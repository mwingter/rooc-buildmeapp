import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  if (isRateLimited(`comment:${session.user.id}`, 20)) return NextResponse.json({ error: "Muitas tentativas" }, { status: 429 });
  const parsed = commentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const build = await prisma.build.findUnique({ where: { id: params.id } });
  if (!build) return NextResponse.json({ error: "Acesso negado" }, { status: 404 });
  if (build.visibility === "PRIVATE" && build.authorId !== session.user.id) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 404 });
  }
  if (build.visibility === "FRIENDS" && build.authorId !== session.user.id) {
    const friend = await prisma.friendship.findFirst({
      where: {
        status: "ACCEPTED",
        OR: [
          { requesterId: session.user.id, recipientId: build.authorId },
          { requesterId: build.authorId, recipientId: session.user.id },
        ],
      },
    });
    if (!friend) return NextResponse.json({ error: "Acesso negado" }, { status: 404 });
  }
  if (build.visibility === "GUILD" && build.authorId !== session.user.id) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!user || !["MODERATOR", "ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 404 });
    }
  }
  const comment = await prisma.comment.create({
    data: { buildId: params.id, authorId: session.user.id, body: parsed.data.body, parentId: parsed.data.parentId },
  });
  if (build.authorId !== session.user.id) {
    await prisma.notification.create({ data: { userId: build.authorId, type: "COMMENT", body: "Sua build recebeu um novo comentário.", href: `/builds/${build.id}` } });
  }
  return NextResponse.json(comment, { status: 201 });
}
