import { test, expect } from "@playwright/test";

test("explore, create and view a build", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Construa. Compartilhe. Evolua." })).toBeVisible();
  await page.getByRole("link", { name: "Nova build" }).click();
  await expect(page.getByRole("heading", { name: "Criar nova build" })).toBeVisible();
  await page.getByLabel("Nome da build").fill("Build E2E");
  await page.getByLabel("Descrição").fill("Uma descrição completa para validar o editor de build.");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Build E2E")).toBeVisible();
});
