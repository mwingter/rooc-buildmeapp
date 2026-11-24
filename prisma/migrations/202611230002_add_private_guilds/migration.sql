CREATE TYPE "GuildRole" AS ENUM ('LEADER', 'MEMBER');
CREATE TYPE "GuildRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

CREATE TABLE "Guild" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "ownerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "GuildMember" (
  "guildId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "role" "GuildRole" NOT NULL DEFAULT 'MEMBER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("guildId", "userId")
);

CREATE TABLE "GuildJoinRequest" (
  "id" TEXT PRIMARY KEY,
  "guildId" TEXT NOT NULL,
  "requesterId" TEXT NOT NULL,
  "status" "GuildRequestStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  UNIQUE ("guildId", "requesterId")
);

CREATE TABLE "GuildRecommendation" (
  "guildId" TEXT NOT NULL,
  "buildId" TEXT NOT NULL,
  "addedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("guildId", "buildId")
);

ALTER TABLE "Guild" ADD CONSTRAINT "Guild_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "GuildMember" ADD CONSTRAINT "GuildMember_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE;
ALTER TABLE "GuildMember" ADD CONSTRAINT "GuildMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "GuildJoinRequest" ADD CONSTRAINT "GuildJoinRequest_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE;
ALTER TABLE "GuildJoinRequest" ADD CONSTRAINT "GuildJoinRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "GuildRecommendation" ADD CONSTRAINT "GuildRecommendation_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE;
ALTER TABLE "GuildRecommendation" ADD CONSTRAINT "GuildRecommendation_buildId_fkey" FOREIGN KEY ("buildId") REFERENCES "Build"("id") ON DELETE CASCADE;
ALTER TABLE "GuildRecommendation" ADD CONSTRAINT "GuildRecommendation_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE CASCADE;

CREATE INDEX "Guild_ownerId_createdAt_idx" ON "Guild"("ownerId", "createdAt");
CREATE INDEX "GuildMember_userId_role_idx" ON "GuildMember"("userId", "role");
CREATE INDEX "GuildJoinRequest_guildId_status_idx" ON "GuildJoinRequest"("guildId", "status");