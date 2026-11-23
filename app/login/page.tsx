import { DiscordLoginButton } from "@/components/discord-login-button";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const discordEnabled = authOptions.providers.some((provider) => "id" in provider && provider.id === "discord");
  return (
    <div className="mx-auto max-w-md py-10">
      <div className="card p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-violet-700 text-xl font-black text-white">RO</div>
        <h1 className="mt-5 text-2xl font-black">Entre na comunidade</h1>
        <p className="mt-2 text-sm text-slate-500">Use sua conta do Discord para criar e compartilhar builds.</p>
        <DiscordLoginButton enabled={discordEnabled} />
        {!discordEnabled && <p role="alert" className="mt-4 text-sm font-bold text-amber-700 dark:text-amber-300">Discord OAuth não está configurado no ambiente de produção.</p>}
        {process.env.ENABLE_MOCK_AUTH === "true" && <p className="mt-4 text-xs text-slate-500">Apenas o ambiente local pode habilitar o provedor de desenvolvimento.</p>}
      </div>
    </div>
  );
}
