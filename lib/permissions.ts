export type BuildVisibility = "PUBLIC" | "PRIVATE" | "FRIENDS" | "GUILD";
export type UserRole = "USER" | "MODERATOR" | "ADMIN";

export function canViewBuild(
  build: { authorId: string; visibility: BuildVisibility },
  user: { id: string; role: UserRole } | null,
  isFriend = false,
) {
  if (build.visibility === "PUBLIC") return true;
  if (!user) return false;
  if (build.authorId === user.id) return true;
  if (build.visibility === "FRIENDS") return isFriend;
  if (build.visibility === "GUILD") return user.role === "MODERATOR" || user.role === "ADMIN";
  return false;
}

export function canEditBuild(build: { authorId: string }, user: { id: string } | null) {
  return !!user && build.authorId === user.id;
}
