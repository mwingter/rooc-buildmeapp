"use client";

import { useMemo, useState } from "react";
import { SkillTreeEditor } from "@/components/skill-tree-editor";

type PresetCategory = {
  id: string;
  label: string;
  description: string;
  options: string[];
};

const categories: PresetCategory[] = [
  { id: "stats", label: "Atributos", description: "Distribuição de STR, AGI, VIT, INT, DEX e LUK.", options: ["PvE balanceado", "MVP crítico", "PvP resistência", "WG suporte"] },
  { id: "skills", label: "Skills", description: "Árvore de habilidades e níveis recomendados.", options: ["Dano principal", "Suporte", "Controle", "Farm"] },
  { id: "equipment", label: "Equipamentos", description: "Conjunto por slot, refino e bônus.", options: ["Dano físico", "Dano mágico", "Tanque", "Guerra da Guilda"] },
  { id: "cards", label: "Cartas", description: "Cartas por equipamento e objetivo.", options: ["MVP", "PvE", "PvP", "Resistência"] },
  { id: "feathers", label: "Penas", description: "Combinação de penas e atributos secundários.", options: ["Dano", "Sobrevivência", "Precisão", "Suporte"] },
  { id: "enchants", label: "Encantamentos", description: "Encantamentos por peça e prioridade.", options: ["Finalização", "Atributos", "Defesa", "Utilidade"] },
  { id: "runes", label: "Runas", description: "Runas, caminhos e prioridades de ativação.", options: ["Ofensiva", "Defensiva", "Híbrida", "Guilda"] },
  { id: "astrocore", label: "Astrocore", description: "Núcleo, constelações e efeitos escolhidos.", options: ["DPS", "Tank", "Suporte", "MVP"] },
];

type PresetState = Record<string, string>;

export function PresetEditor({
  onChange,
  skillLevels,
  onSkillLevelsChange,
}: {
  onChange: (value: PresetState) => void;
  skillLevels: Record<string, number>;
  onSkillLevelsChange: (value: Record<string, number>) => void;
}) {
  const [active, setActive] = useState("stats");
  const [selected, setSelected] = useState<PresetState>({});
  const [search, setSearch] = useState("");

  const category = categories.find((item) => item.id === active) ?? categories[0];
  const options = useMemo(
    () => category.options.filter((option) => option.toLowerCase().includes(search.toLowerCase())),
    [category, search],
  );

  function choose(option: string) {
    const next = { ...selected, [category.id]: option };
    setSelected(next);
    onChange(next);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">Preset de personagem</p>
          <p className="mt-1 text-sm text-slate-500">Cada opção salva uma configuração independente para esta build.</p>
        </div>
        <span className="hidden rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800 sm:inline dark:bg-violet-950 dark:text-violet-300">8 categorias</span>
      </div>
      <div className="grid md:grid-cols-[190px_1fr]">
        <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 p-3 md:block md:space-y-1 md:border-b-0 md:border-r dark:border-slate-700" aria-label="Categorias do preset">
          {categories.map((item) => (
            <button
              className={`flex w-full shrink-0 items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${active === item.id ? "bg-violet-700 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
              key={item.id}
              type="button"
              onClick={() => { setActive(item.id); setSearch(""); }}
              aria-current={active === item.id ? "page" : undefined}
            >
              <span>{item.label}</span>
              {selected[item.id] && <span aria-label="Configurado">✓</span>}
            </button>
          ))}
        </nav>
        <section className="min-w-0 p-4 sm:p-5" aria-labelledby={`preset-${category.id}`}>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <h3 className="text-lg font-black" id={`preset-${category.id}`}>{category.label}</h3>
              <p className="text-sm text-slate-500">{category.description}</p>
            </div>
            <input className="input sm:max-w-52" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Buscar ${category.label.toLowerCase()}`} aria-label={`Buscar em ${category.label}`} />
          </div>
          {category.id === "skills" ? (
            <div className="mt-4">
              <SkillTreeEditor value={skillLevels} onChange={onSkillLevelsChange} />
            </div>
          ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {options.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => choose(option)}
                className={`rounded-xl border p-4 text-left transition hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/40 ${selected[category.id] === option ? "border-violet-600 bg-violet-50 ring-2 ring-violet-200 dark:bg-violet-950/40 dark:ring-violet-900" : "border-slate-200 dark:border-slate-700"}`}
              >
                <span className="flex items-center justify-between font-bold">{option}<span>{selected[category.id] === option ? "✓" : "＋"}</span></span>
                <span className="mt-1 block text-xs text-slate-500">Abrir configuração detalhada</span>
              </button>
            ))}
          </div>
          )}
          {options.length === 0 && category.id !== "skills" && <p className="py-8 text-center text-sm text-slate-500">Nenhuma opção encontrada no catálogo.</p>}
        </section>
      </div>
    </div>
  );
}
