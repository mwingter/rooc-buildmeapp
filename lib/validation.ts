import { z } from "zod";

export const buildSchema = z.object({
  name: z.string().trim().min(3).max(80),
  description: z.string().trim().min(10).max(5000),
  className: z.string().min(1),
  specialization: z.string().min(1),
  role: z.string().min(1),
  content: z.array(z.enum(["PvE", "PvP", "MVP", "WG"])).min(1),
  patchVersion: z.string().regex(/^[0-9]{4}\.[0-9]{1,2}$/),
  visibility: z.enum(["PUBLIC", "PRIVATE", "FRIENDS", "GUILD"]),
  attributes: z.record(z.number().int().min(1).max(999)),
  skills: z.array(z.object({ name: z.string(), level: z.number().int().min(1).max(10) })).max(100),
  equipment: z.array(z.object({ slot: z.string(), name: z.string() })).max(20),
  cards: z.array(z.object({ slot: z.string(), name: z.string() })).max(20),
  runes: z.record(z.unknown()).optional(),
  astrocore: z.record(z.unknown()).optional(),
  mechanics: z.record(z.unknown()).optional(),
});

export const commentSchema = z.object({
  body: z.string().trim().min(1).max(2000),
  parentId: z.string().optional(),
});
