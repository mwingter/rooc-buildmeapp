import { PrismaClient, Role, BuildVisibility, BuildContent } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.gameClass.upsert({
    where: { slug: "lord-knight" },
    update: {},
    create: { name: "Lord Knight", slug: "lord-knight", specializations: ["Spear", "Two-Hand Sword"], license: "Neutral placeholder" },
  });
  await prisma.gameClass.upsert({
    where: { slug: "high-priest" },
    update: {},
    create: { name: "High Priest", slug: "high-priest", specializations: ["Full Support", "Melee", "Magic"], license: "Neutral placeholder" },
  });
  await prisma.gameClass.upsert({
    where: { slug: "sniper" },
    update: {},
    create: { name: "Sniper", slug: "sniper", specializations: ["Bow", "Gunslinger"], license: "Neutral placeholder" },
  });
  await prisma.catalogItem.createMany({
    skipDuplicates: true,
    data: [
      { type: "equipment", name: "Training Spear", slug: "training-spear", description: "Curated placeholder item.", license: "Unlicensed placeholder" },
      { type: "equipment", name: "Brave Hero Armor", slug: "brave-hero-armor", description: "Curated placeholder item.", license: "Unlicensed placeholder" },
      { type: "card", name: "Mandragora Card", slug: "mandragora-card", description: "Curated placeholder card.", license: "Unlicensed placeholder" },
      { type: "skill", name: "Bowling Bash", slug: "bowling-bash", description: "Curated placeholder skill.", license: "Unlicensed placeholder" },
    ],
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@rooc.local" },
    update: {},
    create: { name: "Guild Master", email: "admin@rooc.local", role: Role.ADMIN, gameNick: "GuildMaster", nickVerified: true },
  });
  const lk = await prisma.gameClass.findUniqueOrThrow({ where: { slug: "lord-knight" } });
  await prisma.build.upsert({
    where: { id: "seed-lk-mvp" },
    update: {},
    create: {
      id: "seed-lk-mvp",
      authorId: admin.id,
      name: "Spear MVP Vanguard",
      description: "Build equilibrada para MVP com foco em sobrevivencia e pressao constante.",
      classId: lk.id,
      specialization: "Spear",
      role: "MVP",
      content: [BuildContent.MVP, BuildContent.PVE],
      patchVersion: "2026.11",
      visibility: BuildVisibility.PUBLIC,
      official: true,
      attributes: { str: 60, agi: 24, vit: 45, int: 18, dex: 35, luk: 12 },
      skills: [{ name: "Pierce", level: 10 }, { name: "Brandish Spear", level: 5 }],
      equipment: [{ slot: "weapon", name: "Training Spear" }, { slot: "armor", name: "Brave Hero Armor" }],
      cards: [{ slot: "weapon", name: "Mandragora Card" }],
      runes: { points: "Placeholder curado" },
      astrocore: { name: "Guardiath", level: 3 },
      mechanics: { style: "Tank/DPS" },
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
