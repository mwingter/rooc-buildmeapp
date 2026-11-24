"use client";

import { useState } from "react";
import { classes } from "@/lib/catalog";
import { PresetEditor } from "@/components/preset-editor";
import { SKILL_NAMES } from "@/components/skill-tree-editor";

type PresetState = Record<string, string>;

export default function CreateBuildPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const [preset, setPreset] = useState<PresetState>({});
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});
  const [form, setForm] = useState({
    name: "", description: "", className: "Lord Knight", specialization: "Spear", patchVersion: "2026.11",
    role: "MVP", visibility: "PUBLIC", content: ["PvE"], str: 50, agi: 30, vit: 40, int: 20, dex: 30, luk: 10,
  });
  function set(field: string, value: string | number | string[]) { setForm((current) => ({ ...current, [field]: value })); }

  async function publish() {
    setStatus("loading");
    const response = await fetch("/api/builds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, description: form.description, className: form.className, specialization: form.specialization,
        role: form.role, content: form.content, patchVersion: form.patchVersion, visibility: form.visibility,
        attributes: { str: form.str, agi: form.agi, vit: form.vit, int: form.int, dex: form.dex, luk: form.luk },
        skills: Object.entries(skillLevels)
          .filter(([, level]) => level > 0)
          .map(([id, level]) => ({ name: SKILL_NAMES[id] ?? id, level })),
        equipment: preset.equipment ? [{ slot: "Preset", name: preset.equipment }] : [],
        cards: preset.cards ? [{ slot: "Preset", name: preset.cards }] : [],
        runes: { preset: preset.runes ?? null },
        astrocore: { preset: preset.astrocore ?? null },
        mechanics: { preset },
      }),
    });
    setStatus(response.ok ? "success" : "error");
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <p className="text-sm font-bold text-violet-700 dark:text-violet-300">Editor de build</p>
        <h1 className="text-3xl font-black">Criar novo preset</h1>
        <p className="mt-2 text-sm text-slate-500">Organize sua build como no menu de presets do jogo: cada categoria pode ser configurada e revisada separadamente.</p>
      </div>
      <div className="mb-6 flex gap-2" aria-label="Etapas">
        {[1, 2, 3, 4].map((number) => <button key={number} type="button" onClick={() => setStep(number)} className={`h-2 flex-1 rounded-full ${step >= number ? "bg-violet-700" : "bg-slate-200 dark:bg-slate-800"}`} aria-label={`Ir para etapa ${number}`} />)}
      </div>
      <div className="card p-5 sm:p-8">
        {step === 1 && (
          <section className="space-y-5">
            <h2 className="text-xl font-black">1. Identificação</h2>
            <div><label className="label" htmlFor="name">Nome do preset</label><input className="input" id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex.: Falcon Hunter PvE" /></div>
            <div><label className="label" htmlFor="description">Descrição</label><textarea className="input h-28 resize-none py-3" id="description" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Explique o objetivo e o estilo da build..." /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label" htmlFor="className">Classe</label><select className="input" id="className" value={form.className} onChange={(e) => set("className", e.target.value)}>{classes.map((item) => <option key={item.slug}>{item.name}</option>)}</select></div>
              <div><label className="label" htmlFor="specialization">Especialização</label><input className="input" id="specialization" value={form.specialization} onChange={(e) => set("specialization", e.target.value)} /></div>
            </div>
          </section>
        )}
        {step === 2 && (
          <section className="space-y-5">
            <h2 className="text-xl font-black">2. Atributos e conteúdo</h2>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
              <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-black">Pontos de atributos</p><p className="text-xs text-slate-500">Distribua os pontos entre os seis atributos do personagem.</p></div><span className="rounded-lg bg-violet-100 px-3 py-2 text-sm font-black text-violet-800 dark:bg-violet-950 dark:text-violet-200">{(["str", "agi", "vit", "int", "dex", "luk"] as const).reduce((sum, attribute) => sum + form[attribute], 0)} pontos</span></div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(["str", "agi", "vit", "int", "dex", "luk"] as const).map((attribute) => <div key={attribute} className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"><div className="flex items-center justify-between"><label className="text-xs font-black uppercase text-slate-500" htmlFor={attribute}>{attribute}</label><span className="text-lg font-black text-violet-700 dark:text-violet-300">{form[attribute]}</span></div><input className="mt-2 h-1.5 w-full accent-violet-700" id={attribute} type="range" min="1" max="999" value={form[attribute]} onChange={(e) => set(attribute, Number(e.target.value))} /><div className="mt-2 flex items-center justify-between gap-1"><button className="button-secondary px-2 py-1 text-xs" type="button" onClick={() => set(attribute, Math.max(1, form[attribute] - 1))} aria-label={`Diminuir ${attribute}`}>−</button><input className="input h-8 px-2 text-center text-sm" type="number" min="1" max="999" value={form[attribute]} onChange={(e) => set(attribute, Number(e.target.value))} aria-label={`Valor de ${attribute}`} /><button className="button-secondary px-2 py-1 text-xs" type="button" onClick={() => set(attribute, Math.min(999, form[attribute] + 1))} aria-label={`Aumentar ${attribute}`}>+</button></div></div>)}
              </div>
            </div>
            <fieldset><legend className="label">Conteúdo recomendado</legend><div className="flex flex-wrap gap-2">{["PvE", "PvP", "MVP", "WG"].map((item) => <label key={item} className="rounded-xl border border-slate-300 px-4 py-2 has-[:checked]:border-violet-600 has-[:checked]:bg-violet-50 dark:border-slate-700 dark:has-[:checked]:bg-violet-950"><input className="mr-2" type="checkbox" checked={form.content.includes(item)} onChange={(e) => set("content", e.target.checked ? [...form.content, item] : form.content.filter((value) => value !== item))} />{item}</label>)}</div></fieldset>
          </section>
        )}
        {step === 3 && (
          <section className="space-y-5">
            <div>
              <h2 className="text-xl font-black">3. Preset detalhado</h2>
              <p className="mt-1 text-sm text-slate-500">Clique em uma categoria e escolha a configuração. O catálogo real poderá ser expandido pela administração.</p>
            </div>
            <PresetEditor onChange={setPreset} skillLevels={skillLevels} onSkillLevelsChange={setSkillLevels} className={form.className} />
          </section>
        )}
        {step === 4 && (
          <section className="space-y-5">
            <h2 className="text-xl font-black">4. Revisão e publicação</h2>
            <div className="grid gap-4 rounded-xl bg-slate-100 p-5 sm:grid-cols-2 dark:bg-slate-800">
              <div><p className="text-xs text-slate-500">Preset</p><p className="font-bold">{form.name || "Sem título"}</p></div>
              <div><p className="text-xs text-slate-500">Classe</p><p className="font-bold">{form.className} · {form.specialization}</p></div>
              <div><p className="text-xs text-slate-500">Categorias configuradas</p><p className="font-bold">{Object.keys(preset).length}/8</p></div>
              <div><label className="label" htmlFor="visibility">Visibilidade</label><select className="input" id="visibility" value={form.visibility} onChange={(e) => set("visibility", e.target.value)}><option value="PUBLIC">Pública</option><option value="PRIVATE">Privada</option><option value="FRIENDS">Apenas amigos</option><option value="GUILD">Apenas guilda</option></select></div>
            </div>
            {Object.entries(preset).length > 0 && <div className="grid gap-2 sm:grid-cols-2">{Object.entries(preset).map(([key, value]) => <div className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700" key={key}><span className="font-bold capitalize">{key}</span><span className="ml-2 text-slate-500">{value}</span></div>)}</div>}
            {status === "success" && <p role="status" className="rounded-xl bg-emerald-100 p-3 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Preset publicado com sucesso.</p>}
            {status === "error" && <p role="alert" className="rounded-xl bg-red-100 p-3 font-bold text-red-800 dark:bg-red-950 dark:text-red-300">Não foi possível publicar. Verifique os campos e faça login.</p>}
          </section>
        )}
        <div className="mt-8 flex justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
          <button className="button-secondary" type="button" disabled={step === 1} onClick={() => setStep(step - 1)}>Voltar</button>
          {step < 4 ? <button className="button-primary" type="button" onClick={() => setStep(step + 1)}>Continuar</button> : <button className="button-primary" type="button" onClick={publish} disabled={status === "loading"}>{status === "loading" ? "Publicando..." : "Publicar preset"}</button>}
        </div>
      </div>
    </div>
  );
}
