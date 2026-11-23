export type BuildCardData = {
  id: string;
  name: string;
  className: string;
  specialization: string;
  role: string;
  content: string[];
  patchVersion: string;
  description: string;
  official: boolean;
  author: string;
  likes: number;
  attributes: Record<string, number>;
  skills: { name: string; level: number }[];
  equipment: { slot: string; name: string }[];
  cards: { slot: string; name: string }[];
};

export const classes = [
  { name: "Lord Knight", slug: "lord-knight", specializations: ["Spear", "Two-Hand Sword"] },
  { name: "High Priest", slug: "high-priest", specializations: ["Full Support", "Melee", "Magic"] },
  { name: "Sniper", slug: "sniper", specializations: ["Bow", "Gunslinger"] },
  { name: "Assassin Cross", slug: "assassin-cross", specializations: ["Katar", "Dagger"] },
];

