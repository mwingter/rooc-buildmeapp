import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    ...(process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
      ? [
          DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.ENABLE_MOCK_AUTH === "true" && process.env.NODE_ENV !== "production"
      ? [
          CredentialsProvider({
            name: "Desenvolvimento mock",
            credentials: { name: { label: "Name", type: "text" } },
            async authorize(credentials) {
              const name = credentials?.name?.trim() || "Jogador Demo";
              return (
                (await prisma.user.findFirst({ where: { name } })) ??
                prisma.user.create({ data: { name, email: `${name.replace(/\\W/g, "").toLowerCase()}@mock.local` } })
              );
            },
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.uid === "string") (session.user as typeof session.user & { id: string }).id = token.uid;
      return session;
    },
  },
  pages: { signIn: "/login" },
};
