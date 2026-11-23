"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function DiscordLoginButton({ enabled }: { enabled: boolean }) {
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!enabled) return;
    setLoading(true);
    await signIn("discord", { callbackUrl: "/profile" });
  }

  return (
    <button
      className="button-primary mt-6 w-full"
      type="button"
      onClick={login}
      disabled={!enabled || loading}
    >
      {loading ? "Abrindo Discord..." : "Continuar com Discord"}
    </button>
  );
}
