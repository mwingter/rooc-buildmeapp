import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json({
    authenticated: !!session?.user,
    user: session?.user
      ? { name: session.user.name, id: (session.user as typeof session.user & { id?: string }).id ?? null }
      : null,
  });
}
