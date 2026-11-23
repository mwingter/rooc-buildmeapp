"use client";

import { useMemo, useState } from "react";

export type SkillLevel = {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
};

type SkillNode = SkillLevel & {
  tier: number;
  branches: string[];
  prerequisites?: string;
};

const skillTree: SkillNode[] = [
  { id: "owl-eye", name: "Olho da Coruja", level: 0, maxLevel: 10, tier: 1, branches: ["Hunter"] },
  { id: "vulture-eye", name: "Olho do Abutre", level: 0, maxLevel: 10, tier: 1, branches: ["Hunter"], prerequisites: "Olho da Coruja 3" },
  { id: "improve-concentration", name: "Melhorar Concentração", level: 0, maxLevel: 10, tier: 1, branches: ["Hunter"] },
  { id: "arrow-shower", name: "Chuva de Flechas", level: 0, maxLevel: 10, tier: 1, branches: ["Hunter"] },
  { id: "double-strafe", name: "Rajada Dupla", level: 0, maxLevel: 10, tier: 1, branches: ["Hunter"] },
  { id: "blitz-beat", name: "Ataque Blitz", level: 0, maxLevel: 5, tier: 1, branches: ["Hunter"] },
  { id: "steel-crow", name: "Corvo de Aço", level: 0, maxLevel: 10, tier: 2, branches: ["Sniper"], prerequisites: "Olho do Abutre 10" },
  { id: "falcon", name: "Falcão", level: 0, maxLevel: 1, tier: 2, branches: ["Sniper"], prerequisites: "Ataque Blitz 5" },
  { id: "spring-trap", name: "Armadilha de Mola", level: 0, maxLevel: 5, tier: 2, branches: ["Sniper"], prerequisites: "Detectar 1" },
  { id: "land-mine", name: "Mina Terrestre", level: 0, maxLevel: 5, tier: 2, branches: ["Sniper"], prerequisites: "Armadilha de Mola 5" },
  { id: "shockwave-trap", name: "Armadilha de Choque", level: 0, maxLevel: 5, tier: 2, branches: ["Sniper"], prerequisites: "Armadilha de Mola 5" },
  { id: "freezing-trap", name: "Armadilha Congelante", level: 0, maxLevel: 5, tier: 2, branches: ["Sniper"], prerequisites: "Armadilha de Mola 5" },
  { id: "sharp-shooting", name: "Tiro Preciso", level: 0, maxLevel: 5, tier: 3, branches: ["Sniper"] },
  { id: "true-sight", name: "Visão Verdadeira", level: 0, maxLevel: 5, tier: 3, branches: ["Sniper"], prerequisites: "Corvo de Aço 10" },
  { id: "wind-walker", name: "Caminhante do Vento", level: 0, maxLevel: 10, tier: 3, branches: ["Sniper"] },
  { id: "gale-storm", name: "Tempestade de Vento", level: 0, maxLevel: 10, tier: 3, branches: ["Sniper"], prerequisites: "Visão Verdadeira 1" },
];

const tierLabels = ["Classe base", "Hunter", "Sniper"];

export const SKILL_NAMES: Record<string, string> = Object.fromEntries(
  skillTree.map((skill) => [skill.id, skill.name]),
);

export function SkillTreeEditor({
  value,
  onChange,
}: {
  value: Record<string, number>;
  onChange: (skills: Record<string, number>) => void;
}) {
  const [levels, setLevels] = useState<Record<string, number>>(value);
  const [search, setSearch] = useState("");

  const visibleSkills = useMemo(
    () => skillTree.filter((skill) => skill.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  function changeLevel(skill: SkillNode, delta: number) {
    const nextLevel = Math.max(0, Math.min(skill.maxLevel, (levels[skill.id] ?? 0) + delta));
    const next = { ...levels, [skill.id]: nextLevel };
    setLevels(next);
    onChange(next);
  }

  function setLevel(skill: SkillNode, level: number) {
    const nextLevel = Math.max(0, Math.min(skill.maxLevel, level));
    const next = { ...levels, [skill.id]: nextLevel };
    setLevels(next);
    onChange(next);
  }

  const assignedPoints = Object.values(levels).reduce((sum, level) => sum + level, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-[#eef5ff] dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-col gap-3 border-b border-slate-300 bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
        <div>
          <p className="text-sm font-black">Árvore de skills · Hunter / Sniper</p>
          <p className="text-xs text-blue-100">Selecione o nível de cada skill exatamente como no jogo</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-9 w-44 rounded-lg border-0 bg-white px-3 text-sm text-slate-900 outline-none ring-blue-300 placeholder:text-slate-400 focus:ring-2"
            placeholder="Buscar skill"
            aria-label="Buscar skill"
          />
          <span className="rounded-lg bg-white/20 px-3 py-2 text-xs font-black">{assignedPoints} pts</span>
        </div>
      </div>

      <div className="overflow-x-auto p-4 sm:p-6">
        <div className="min-w-[760px]">
          {[1, 2, 3].map((tier) => {
            const skills = visibleSkills.filter((skill) => skill.tier === tier);
            if (skills.length === 0) return null;
            return (
              <section key={tier} className="mb-5 last:mb-0" aria-labelledby={`skill-tier-${tier}`}>
                <div className="mb-3 flex items-center gap-3">
                  <h4 className="w-28 text-sm font-black text-slate-700 dark:text-slate-200" id={`skill-tier-${tier}`}>{tierLabels[tier - 1]}</h4>
                  <div className="h-px flex-1 bg-gradient-to-r from-blue-300 to-transparent" />
                </div>
                <div className="grid grid-cols-6 gap-3 pl-28">
                  {skills.map((skill) => {
                    const level = levels[skill.id] ?? 0;
                    return (
                      <article
                        key={skill.id}
                        className={`group relative rounded-2xl border bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-950 ${level > 0 ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900" : "border-slate-300 dark:border-slate-700"}`}
                      >
                        <div className="absolute left-1/2 top-[-10px] -translate-x-1/2 rounded-full border border-slate-200 bg-white px-2 text-[10px] font-black text-slate-500 opacity-0 transition group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900">
                          Lv. {level}/{skill.maxLevel}
                        </div>
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-slate-200 bg-gradient-to-br from-slate-100 to-slate-300 shadow-inner dark:border-slate-700 dark:from-slate-800 dark:to-slate-700" aria-label={`Ícone neutro da skill ${skill.name}`}>
                          <span className="text-lg font-black text-slate-500 dark:text-slate-300">{skill.name.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <h5 className="mt-2 min-h-9 text-center text-xs font-black leading-4 text-slate-700 dark:text-slate-200">{skill.name}</h5>
                        {skill.prerequisites && <p className="mt-1 truncate text-center text-[10px] text-slate-400" title={skill.prerequisites}>Req. {skill.prerequisites}</p>}
                        <div className="mt-2 flex items-center justify-center gap-1">
                          <button type="button" onClick={() => changeLevel(skill, -1)} disabled={level === 0} className="grid h-7 w-7 place-items-center rounded-lg border border-slate-300 bg-slate-50 text-sm font-black text-slate-700 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" aria-label={`Diminuir nível de ${skill.name}`}>−</button>
                          <input
                            type="number"
                            min={0}
                            max={skill.maxLevel}
                            value={level}
                            onChange={(event) => setLevel(skill, Number(event.target.value))}
                            className="h-7 w-12 rounded-lg border border-slate-300 bg-white text-center text-xs font-black outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
                            aria-label={`Nível de ${skill.name}`}
                          />
                          <button type="button" onClick={() => changeLevel(skill, 1)} disabled={level === skill.maxLevel} className="grid h-7 w-7 place-items-center rounded-lg border border-slate-300 bg-slate-50 text-sm font-black text-slate-700 disabled:opacity-30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" aria-label={`Aumentar nível de ${skill.name}`}>＋</button>
                        </div>
                        {level > 0 && <div className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-blue-600 text-[10px] font-black text-white">{level}</div>}
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
