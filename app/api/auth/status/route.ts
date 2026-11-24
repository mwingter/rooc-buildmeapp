import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  let database: "ok" | "error" = "ok";
  let authTables: "ok" | "error" = "ok";
  try {
    await prisma.user.count();
  } catch {
    database = "error";
  }
  try {
    await prisma.account.count();
    await prisma.session.count();
  } catch {
    authTables = "error";
  }
  let nextAuthUrl = null as string | null;
  try {
    nextAuthUrl = process.env.NEXTAUTH_URL
      ? new URL(process.env.NEXTAUTH_URL).host
      : null;
  } catch {}
  return NextResponse.json({
    authenticated: !!session?.user,
    configuration: {
      discord: !!process.env.DISCORD_CLIENT_ID && !!process.env.DISCORD_CLIENT_SECRET,
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl,
      database,
      authTables,
      callbackUrl: "https://rooc-buildmeapp.vercel.app/api/auth/callback/discord",
    },
    user: session?.user
      ? {
          name: session.user.name,
          image: session.user.image ?? null,
          id: (session.user as typeof session.user & { id?: string }).id ?? null,
        }
      : null,
  });
}
