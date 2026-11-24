"use client";

import { useState } from "react";

export type SkillLevel = { id: string; name: string; level: number; maxLevel: number };
type SkillNode = SkillLevel & { tier: number; prerequisites?: Array<[string, number]>; kind: "active" | "passive" | "support" };

const trees: Record<string, { label: string; nodes: SkillNode[] }[]> = {
  "High Priest": [
    { label: "Noviço", nodes: [
      { id: "novice-heal", name: "Cura", level: 0, maxLevel: 10, tier: 1, kind: "active" },
      { id: "novice-blessing", name: "Benção", level: 0, maxLevel: 10, tier: 1, kind: "support" },
      { id: "novice-increase-agi", name: "Aumentar Agilidade", level: 0, maxLevel: 10, tier: 1, kind: "support" },
      { id: "novice-angelus", name: "Angelus", level: 0, maxLevel: 10, tier: 1, kind: "support" },
      { id: "novice-ruwach", name: "Revelação", level: 0, maxLevel: 1, tier: 1, kind: "active" },
    ] },
    { label: "Sacerdote", nodes: [
      { id: "priest-magnificat", name: "Magnificat", level: 0, maxLevel: 5, tier: 2, kind: "support", prerequisites: [["novice-blessing", 5]] },
      { id: "priest-gloria", name: "Glória", level: 0, maxLevel: 5, tier: 2, kind: "support", prerequisites: [["priest-magnificat", 3]] },
      { id: "priest-sanctuary", name: "Santuário", level: 0, maxLevel: 10, tier: 2, kind: "active", prerequisites: [["novice-heal", 5]] },
      { id: "priest-resurrection", name: "Ressuscitar", level: 0, maxLevel: 4, tier: 2, kind: "active", prerequisites: [["novice-heal", 4]] },
      { id: "priest-kyrie", name: "Kyrie Eleison", level: 0, maxLevel: 10, tier: 2, kind: "support", prerequisites: [["novice-angelus", 3]] },
    ] },
    { label: "Sumo Sacerdote", nodes: [
      { id: "high-priest-assumptio", name: "Assumptio", level: 0, maxLevel: 10, tier: 3, kind: "support", prerequisites: [["priest-kyrie", 5]] },
      { id: "high-priest-meditatio", name: "Meditação", level: 0, maxLevel: 10, tier: 3, kind: "passive", prerequisites: [["novice-heal", 10]] },
      { id: "high-priest-lex-aeterna", name: "Lex Aeterna", level: 0, maxLevel: 5, tier: 3, kind: "active", prerequisites: [["priest-gloria", 3]] },
      { id: "high-priest-suffragium", name: "Suffragium", level: 0, maxLevel: 5, tier: 3, kind: "support", prerequisites: [["priest-magnificat", 5]] },
      { id: "high-priest-sacrament", name: "Sacramento", level: 0, maxLevel: 5, tier: 3, kind: "passive", prerequisites: [["priest-sanctuary", 5]] },
    ] },
  ],
  "Lord Knight": [
    { label: "Espadachim", nodes: [
      { id: "swordsman-bash", name: "Impacto Explosivo", level: 0, maxLevel: 10, tier: 1, kind: "active" },
      { id: "swordsman-provoke", name: "Provocar", level: 0, maxLevel: 10, tier: 1, kind: "active" },
      { id: "swordsman-endure", name: "Vigor", level: 0, maxLevel: 10, tier: 1, kind: "support" },
      { id: "swordsman-magnum", name: "Golpe Magnum", level: 0, maxLevel: 10, tier: 1, kind: "active" },
      { id: "swordsman-sword-mastery", name: "Maestria de Espada", level: 0, maxLevel: 10, tier: 1, kind: "passive" },
    ] },
    { label: "Cavaleiro", nodes: [
      { id: "knight-spear-mastery", name: "Maestria de Lança", level: 0, maxLevel: 10, tier: 2, kind: "passive", prerequisites: [["swordsman-sword-mastery", 5]] },
      { id: "knight-brandish", name: "Brandir Lança", level: 0, maxLevel: 10, tier: 2, kind: "active", prerequisites: [["knight-spear-mastery", 3]] },
      { id: "knight-peco", name: "Montaria", level: 0, maxLevel: 5, tier: 2, kind: "support", prerequisites: [["swordsman-endure", 5]] },
      { id: "knight-concentration", name: "Concentração", level: 0, maxLevel: 5, tier: 2, kind: "support", prerequisites: [["swordsman-provoke", 5]] },
      { id: "knight-counter", name: "Contra-Ataque", level: 0, maxLevel: 5, tier: 2, kind: "active", prerequisites: [["swordsman-bash", 5]] },
    ] },
    { label: "Lorde", nodes: [
      { id: "lord-berserk", name: "Frenesi", level: 0, maxLevel: 5, tier: 3, kind: "active", prerequisites: [["knight-concentration", 3]] },
      { id: "lord-spiral", name: "Lança Espiral", level: 0, maxLevel: 10, tier: 3, kind: "active", prerequisites: [["knight-brandish", 5]] },
      { id: "lord-parry", name: "Bloqueio", level: 0, maxLevel: 10, tier: 3, kind: "passive", prerequisites: [["knight-counter", 3]] },
      { id: "lord-aurablade", name: "Lâmina de Aura", level: 0, maxLevel: 5, tier: 3, kind: "support", prerequisites: [["knight-spear-mastery", 5]] },
      { id: "lord-gospel", name: "Grito de Guerra", level: 0, maxLevel: 5, tier: 3, kind: "support", prerequisites: [["swordsman-provoke", 10]] },
    ] },
  ],
  Sniper: [
    { label: "Arqueiro", nodes: [
      { id: "archer-owl", name: "Olho da Coruja", level: 0, maxLevel: 10, tier: 1, kind: "passive" },
      { id: "archer-vulture", name: "Olho do Abutre", level: 0, maxLevel: 10, tier: 1, kind: "passive", prerequisites: [["archer-owl", 3]] },
      { id: "archer-concentration", name: "Concentração", level: 0, maxLevel: 10, tier: 1, kind: "support" },
      { id: "archer-double", name: "Rajada Dupla", level: 0, maxLevel: 10, tier: 1, kind: "active" },
      { id: "archer-shower", name: "Chuva de Flechas", level: 0, maxLevel: 10, tier: 1, kind: "active" },
    ] },
    { label: "Caçador", nodes: [
      { id: "hunter-blitz", name: "Ataque Blitz", level: 0, maxLevel: 5, tier: 2, kind: "active", prerequisites: [["archer-vulture", 5]] },
      { id: "hunter-falcon", name: "Falcão", level: 0, maxLevel: 1, tier: 2, kind: "support", prerequisites: [["hunter-blitz", 1]] },
      { id: "hunter-trap", name: "Armadilha de Mola", level: 0, maxLevel: 5, tier: 2, kind: "active" },
      { id: "hunter-detect", name: "Detectar", level: 0, maxLevel: 4, tier: 2, kind: "support" },
      { id: "hunter-steel-crow", name: "Corvo de Aço", level: 0, maxLevel: 10, tier: 2, kind: "passive", prerequisites: [["hunter-falcon", 1]] },
    ] },
    { label: "Atirador de Elite", nodes: [
      { id: "sniper-true-sight", name: "Visão Verdadeira", level: 0, maxLevel: 5, tier: 3, kind: "support", prerequisites: [["hunter-steel-crow", 5]] },
      { id: "sniper-sharp", name: "Tiro Preciso", level: 0, maxLevel: 5, tier: 3, kind: "active", prerequisites: [["archer-concentration", 5]] },
      { id: "sniper-wind", name: "Caminhante do Vento", level: 0, maxLevel: 10, tier: 3, kind: "support" },
      { id: "sniper-gale", name: "Tempestade de Vento", level: 0, maxLevel: 10, tier: 3, kind: "active", prerequisites: [["sniper-true-sight", 1]] },
      { id: "sniper-fear", name: "Flecha Assustadora", level: 0, maxLevel: 5, tier: 3, kind: "active", prerequisites: [["sniper-sharp", 3]] },
    ] },
  ],
};

const fallbackTree = trees.Sniper;
export const SKILL_NAMES: Record<string, string> = Object.fromEntries(Object.values(trees).flatMap((tree) => tree.flatMap((tier) => tier.nodes.map((skill) => [skill.id, skill.name]))));

export function SkillTreeEditor({ value, onChange, className }: { value: Record<string, number>; onChange: (skills: Record<string, number>) => void; className: string }) {
  const [levels, setLevels] = useState(value);
  const [search, setSearch] = useState("");
  const tree = trees[className] ?? fallbackTree;
  const allSkills = tree.flatMap((tier) => tier.nodes);
  const points = Object.values(levels).reduce((sum, level) => sum + level, 0);
  const visible = (skills: SkillNode[]) => skills.filter((skill) => skill.name.toLowerCase().includes(search.toLowerCase()));

  function canIncrease(skill: SkillNode) {
    return !skill.prerequisites?.some(([id, required]) => (levels[id] ?? 0) < required);
  }
  function update(skill: SkillNode, nextLevel: number) {
    if (nextLevel > (levels[skill.id] ?? 0) && !canIncrease(skill)) return;
    const next = { ...levels, [skill.id]: Math.max(0, Math.min(skill.maxLevel, nextLevel)) };
    setLevels(next);
    onChange(next);
  }

  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-slate-700 bg-[#101a2d] text-white shadow-2xl">
      <div className="border-b border-white/10 bg-gradient-to-r from-[#182d52] via-[#174a72] to-[#1d7890] p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Skill simulator</p><h3 className="mt-1 text-xl font-black">{className} · árvore de habilidades</h3><p className="mt-1 text-xs text-blue-100">Distribua os pontos respeitando os pré-requisitos de cada classe.</p></div>
          <div className="flex items-center gap-2"><input className="h-9 w-44 rounded-lg border border-white/20 bg-black/20 px-3 text-sm text-white outline-none placeholder:text-blue-100 focus:border-cyan-300" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar skill" aria-label="Buscar skill" /><span className="rounded-lg bg-black/20 px-3 py-2 text-xs font-black">{points} pts</span></div>
        </div>
      </div>
      <div className="space-y-5 overflow-x-auto p-4 sm:p-6">
        {tree.map((tier, index) => {
          const skills = visible(tier.nodes);
          if (!skills.length) return null;
          return <section key={tier.label} aria-labelledby={`skill-tier-${index}`}>
            <div className="mb-3 flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-cyan-400 text-xs font-black text-slate-950">{index + 1}</span><h4 id={`skill-tier-${index}`} className="text-sm font-black uppercase tracking-wider text-cyan-100">{tier.label}</h4><div className="h-px flex-1 bg-gradient-to-r from-cyan-400/60 to-transparent" /></div>
            <div className="grid min-w-[700px] grid-cols-5 gap-3">
              {skills.map((skill) => {
                const level = levels[skill.id] ?? 0;
                const locked = !canIncrease(skill) && level === 0;
                return <article key={skill.id} className={`relative rounded-xl border p-3 transition ${level > 0 ? "border-cyan-300 bg-cyan-950/60 shadow-[0_0_0_2px_rgba(103,232,249,.18)]" : locked ? "border-white/10 bg-white/[.03] opacity-60" : "border-white/15 bg-white/[.06] hover:border-cyan-300/70"}`}>
                  <div className="flex items-start justify-between gap-2"><div className={`grid h-12 w-12 place-items-center rounded-xl border text-sm font-black ${level > 0 ? "border-cyan-200 bg-cyan-400 text-slate-950" : "border-white/20 bg-gradient-to-br from-slate-500 to-slate-800 text-cyan-100"}`} aria-label={`Ícone da skill ${skill.name}`}>{skill.name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</div><span className="rounded bg-black/30 px-1.5 py-1 text-[10px] font-black text-cyan-100">{level}/{skill.maxLevel}</span></div>
                  <h5 className="mt-2 min-h-9 text-xs font-black leading-4">{skill.name}</h5>
                  <p className="mt-1 text-[10px] text-blue-100/70">{skill.kind === "active" ? "Ativa" : skill.kind === "support" ? "Suporte" : "Passiva"}{skill.prerequisites ? ` · Req. ${skill.prerequisites.map(([id, required]) => `${SKILL_NAMES[id]} ${required}`).join(", ")}` : ""}</p>
                  <div className="mt-3 flex items-center gap-1"><button type="button" className="grid h-7 w-7 place-items-center rounded-md bg-white/10 font-black disabled:opacity-30" disabled={level === 0} onClick={() => update(skill, level - 1)} aria-label={`Diminuir ${skill.name}`}>−</button><input className="h-7 min-w-0 flex-1 rounded-md border border-white/15 bg-black/20 text-center text-xs font-black" type="number" min={0} max={skill.maxLevel} value={level} disabled={locked} onChange={(event) => update(skill, Number(event.target.value))} aria-label={`Nível de ${skill.name}`} /><button type="button" className="grid h-7 w-7 place-items-center rounded-md bg-cyan-400 font-black text-slate-950 disabled:opacity-30" disabled={level === skill.maxLevel || !canIncrease(skill)} onClick={() => update(skill, level + 1)} aria-label={`Aumentar ${skill.name}`}>+</button></div>
                </article>;
              })}
            </div>
            {index < tree.length - 1 && <div className="mx-auto h-5 w-px bg-cyan-400/40" aria-hidden="true" />}
          </section>;
        })}
      </div>
      <div className="border-t border-white/10 bg-black/20 px-4 py-3 text-xs text-blue-100/80">Skills disponíveis: {allSkills.length} · Pontos investidos: {points} · Clique nos níveis ou use + e − para montar o preset.</div>
    </div>
  );
}
