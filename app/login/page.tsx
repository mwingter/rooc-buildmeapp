import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md py-10">
      <div className="card p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-700 text-xl font-black text-white">RO</div>
        <h1 className="mt-5 text-2xl font-black">Entre na comunidade</h1>
        <p className="mt-2 text-sm text-slate-500">Use sua conta do Discord para criar e compartilhar builds.</p>
        <Link href="/api/auth/signin/discord" className="button-primary mt-6 w-full">Continuar com Discord</Link>
        <p className="mt-4 text-xs text-slate-500">Ambiente local: use o provedor “Discord mock” na tela do Auth.js.</p>
      </div>
    </div>
  );
}
