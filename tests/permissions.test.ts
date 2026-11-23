import { describe, expect, it } from "vitest";
import { canEditBuild, canViewBuild } from "../lib/permissions";
import { buildSchema, commentSchema } from "../lib/validation";

describe("build permissions", () => {
  it("allows only public builds for anonymous users", () => {
    expect(canViewBuild({ authorId: "a", visibility: "PUBLIC" }, null)).toBe(true);
    expect(canViewBuild({ authorId: "a", visibility: "PRIVATE" }, null)).toBe(false);
  });
  it("enforces friend, guild and ownership rules", () => {
    const user = { id: "b", role: "USER" as const };
    expect(canViewBuild({ authorId: "a", visibility: "FRIENDS" }, user, true)).toBe(true);
    expect(canViewBuild({ authorId: "a", visibility: "GUILD" }, user)).toBe(false);
    expect(canViewBuild({ authorId: "b", visibility: "PRIVATE" }, user)).toBe(true);
  });
  it("allows only the author to edit", () => {
    expect(canEditBuild({ authorId: "a" }, { id: "a" })).toBe(true);
    expect(canEditBuild({ authorId: "a" }, { id: "b" })).toBe(false);
  });
});

describe("validation", () => {
  it("rejects malformed builds and comments", () => {
    expect(buildSchema.safeParse({ name: "x" }).success).toBe(false);
    expect(commentSchema.safeParse({ body: "" }).success).toBe(false);
  });
});
