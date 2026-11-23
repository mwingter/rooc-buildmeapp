import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const original = await prisma.build.findUnique({ where: { id: params.id } });
  if (!original || original.visibility === "PRIVATE") return NextResponse.json({ error: "Acesso negado" }, { status: 404 });
  const clone = await prisma.build.create({
    data: {
      authorId: session.user.id,
      name: `${original.name} — cópia`,
      description: original.description,
      classId: original.classId,
      specialization: original.specialization,
      role: original.role,
      content: original.content,
      patchVersion: original.patchVersion,
      official: false,
      visibility: "PRIVATE",
      attributes: original.attributes as Prisma.InputJsonValue,
      skills: original.skills as Prisma.InputJsonValue,
      equipment: original.equipment as Prisma.InputJsonValue,
      cards: original.cards as Prisma.InputJsonValue,
      runes: original.runes as Prisma.InputJsonValue,
      astrocore: original.astrocore as Prisma.InputJsonValue,
      mechanics: original.mechanics as Prisma.InputJsonValue,
    },
  });
  return NextResponse.json(clone, { status: 201 });
}
