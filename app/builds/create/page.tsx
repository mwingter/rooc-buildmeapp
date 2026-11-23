"use client";

import { useState } from "react";
import { classes } from "@/lib/catalog";

export default function CreateBuildPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
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
        skills: [{ name: "Skill principal", level: 10 }], equipment: [], cards: [], runes: {}, astrocore: {}, mechanics: {},
      }),
    });
    setStatus(response.ok ? "success" : "error");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="text-sm font-bold text-violet-700 dark:text-violet-300">Editor de build</p>
        <h1 className="text-3xl font-black">Criar nova build</h1>
      </div>
      <div className="mb-6 flex gap-2" aria-label="Etapas">
        {[1, 2, 3, 4].map((number) => <button key={number} type="button" onClick={() => setStep(number)} className={`h-2 flex-1 rounded-full ${step >= number ? "bg-violet-700" : "bg-slate-200 dark:bg-slate-800"}`} aria-label={`Ir para etapa ${number}`} />)}
      </div>
      <div className="card p-5 sm:p-8">
        {step === 1 && (
          <section className="space-y-5">
            <h2 className="text-xl font-black">1. Identificação</h2>
            <div><label className="label" htmlFor="name">Nome da build</label><input className="input" id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex.: Lançador de MVP" /></div>
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {(["str", "agi", "vit", "int", "dex", "luk"] as const).map((attribute) => <div key={attribute}><label className="label uppercase" htmlFor={attribute}>{attribute}</label><input className="input" id={attribute} type="number" min="1" max="999" value={form[attribute]} onChange={(e) => set(attribute, Number(e.target.value))} /></div>)}
            </div>
            <fieldset><legend className="label">Conteúdo recomendado</legend><div className="flex flex-wrap gap-2">{["PvE", "PvP", "MVP", "WG"].map((item) => <label key={item} className="rounded-xl border border-slate-300 px-4 py-2 has-[:checked]:border-violet-600 has-[:checked]:bg-violet-50 dark:border-slate-700 dark:has-[:checked]:bg-violet-950"><input className="mr-2" type="checkbox" checked={form.content.includes(item)} onChange={(e) => set("content", e.target.checked ? [...form.content, item] : form.content.filter((value) => value !== item))} />{item}</label>)}</div></fieldset>
          </section>
        )}
        {step === 3 && (
          <section className="space-y-5">
            <h2 className="text-xl font-black">3. Skills, equipamentos e cartas</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {["Skills", "Equipamentos", "Cartas"].map((section) => <div key={section}><label className="label">{section}</label><textarea className="input h-28 resize-none py-3" placeholder={`Adicionar ${section.toLowerCase()}...`} /></div>)}
            </div>
            <p className="text-sm text-slate-500">Os campos do catálogo suportam busca por nome. Assets licenciados podem ser conectados ao armazenamento de objetos.</p>
          </section>
        )}
        {step === 4 && (
          <section className="space-y-5">
            <h2 className="text-xl font-black">4. Revisão e publicação</h2>
            <div className="grid gap-4 rounded-xl bg-slate-100 p-5 sm:grid-cols-2 dark:bg-slate-800">
              <div><p className="text-xs text-slate-500">Nome</p><p className="font-bold">{form.name || "Sem título"}</p></div>
              <div><p className="text-xs text-slate-500">Classe</p><p className="font-bold">{form.className} · {form.specialization}</p></div>
              <div><p className="text-xs text-slate-500">Patch</p><p className="font-bold">{form.patchVersion}</p></div>
              <div><label className="label" htmlFor="visibility">Visibilidade</label><select className="input" id="visibility" value={form.visibility} onChange={(e) => set("visibility", e.target.value)}><option value="PUBLIC">Pública</option><option value="PRIVATE">Privada</option><option value="FRIENDS">Apenas amigos</option><option value="GUILD">Apenas guilda</option></select></div>
            </div>
            {status === "success" && <p role="status" className="rounded-xl bg-emerald-100 p-3 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Build publicada com sucesso.</p>}
            {status === "error" && <p role="alert" className="rounded-xl bg-red-100 p-3 font-bold text-red-800 dark:bg-red-950 dark:text-red-300">Não foi possível publicar. Verifique os campos.</p>}
          </section>
        )}
        <div className="mt-8 flex justify-between border-t border-slate-100 pt-5 dark:border-slate-800">
          <button className="button-secondary" type="button" disabled={step === 1} onClick={() => setStep(step - 1)}>Voltar</button>
          {step < 4 ? <button className="button-primary" type="button" onClick={() => setStep(step + 1)}>Continuar</button> : <button className="button-primary" type="button" onClick={publish} disabled={status === "loading"}>{status === "loading" ? "Publicando..." : "Publicar build"}</button>}
        </div>
      </div>
    </div>
  );
}
