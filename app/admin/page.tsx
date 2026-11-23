import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !["MODERATOR", "ADMIN"].includes(user.role)) redirect("/");
  let classes: { name: string; specializations: string[]; license: string | null }[] = [];
  let counts = { builds: 0, reports: 0, users: 0 };
  try {
    classes = await prisma.gameClass.findMany({ orderBy: { name: "asc" } });
    counts = {
      builds: await prisma.build.count(),
      reports: await prisma.report.count({ where: { status: "OPEN" } }),
      users: await prisma.user.count({ where: { deletedAt: null } }),
    };
  } catch {}
  return (
    <div className="space-y-6">
      <div><p className="text-sm font-bold text-violet-700 dark:text-violet-300">Área restrita</p><h1 className="text-3xl font-black">Administração</h1></div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[["Builds", String(counts.builds)], ["Denúncias", String(counts.reports)], ["Usuários", String(counts.users)]].map(([label, value]) => <div key={label} className="card p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-1 text-3xl font-black">{value}</p></div>)}
      </div>
      <section className="card p-5">
        <div className="flex items-center justify-between"><h2 className="text-xl font-black">Catálogo de classes</h2><button className="button-primary" type="button">Adicionar classe</button></div>
        <div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-slate-200 dark:border-slate-800"><tr><th className="py-3">Classe</th><th>Especializações</th><th>Licença</th><th></th></tr></thead><tbody>{classes.map((item) => <tr key={item.name} className="border-b border-slate-100 dark:border-slate-800"><td className="py-3 font-bold">{item.name}</td><td>{item.specializations.join(", ")}</td><td className="text-slate-500">{item.license ?? "Sem informação"}</td><td><button className="button-secondary h-9 px-3" type="button">Editar</button></td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
}
