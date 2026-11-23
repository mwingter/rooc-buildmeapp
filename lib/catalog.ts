export type DemoBuild = {
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

export const demoBuilds: DemoBuild[] = [
  {
    id: "seed-lk-mvp",
    name: "Spear MVP Vanguard",
    className: "Lord Knight",
    specialization: "Spear",
    role: "MVP",
    content: ["MVP", "PvE"],
    patchVersion: "2026.11",
    description: "Build equilibrada para MVP com foco em sobrevivência e pressão constante.",
    official: true,
    author: "GuildMaster",
    likes: 128,
    attributes: { STR: 60, AGI: 24, VIT: 45, INT: 18, DEX: 35, LUK: 12 },
    skills: [{ name: "Pierce", level: 10 }, { name: "Brandish Spear", level: 5 }],
    equipment: [{ slot: "Arma", name: "Training Spear" }, { slot: "Armadura", name: "Brave Hero Armor" }],
    cards: [{ slot: "Arma", name: "Mandragora Card" }],
  },
  {
    id: "seed-hp-wg",
    name: "Sagrada de Guerra",
    className: "High Priest",
    specialization: "Full Support",
    role: "Suporte",
    content: ["WG", "PvP"],
    patchVersion: "2026.11",
    description: "Kit defensivo para posicionamento em equipe e cura rápida durante Guerra da Guilda.",
    official: true,
    author: "GuildMaster",
    likes: 96,
    attributes: { STR: 18, AGI: 20, VIT: 48, INT: 70, DEX: 55, LUK: 10 },
    skills: [{ name: "Magnus Exorcismus", level: 5 }, { name: "Safety Wall", level: 10 }],
    equipment: [{ slot: "Arma", name: "Mace of Grace" }, { slot: "Armadura", name: "Toga do Bispo" }],
    cards: [{ slot: "Arma", name: "Hydra Card" }],
  },
  {
    id: "seed-sniper-pve",
    name: "Falcão de Campo",
    className: "Sniper",
    specialization: "Bow",
    role: "Dano",
    content: ["PvE"],
    patchVersion: "2026.10",
    description: "Acúmulo seguro de dano à distância para instâncias e grind prolongado.",
    official: false,
    author: "RangerLuna",
    likes: 73,
    attributes: { STR: 15, AGI: 62, VIT: 25, INT: 12, DEX: 58, LUK: 30 },
    skills: [{ name: "Sharp Shooting", level: 5 }, { name: "Arrow Shower", level: 10 }],
    equipment: [{ slot: "Arma", name: "Hunter Bow" }, { slot: "Armadura", name: "Wind Coat" }],
    cards: [{ slot: "Arma", name: "Skel Archer Card" }],
  },
];
