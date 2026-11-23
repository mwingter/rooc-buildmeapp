import { test, expect } from "@playwright/test";

test("explore, create and view a build", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Construa. Compartilhe. Evolua." })).toBeVisible();
  await page.getByRole("link", { name: "Nova build" }).click();
  await expect(page.getByRole("heading", { name: "Criar novo preset" })).toBeVisible();
  await page.getByLabel("Nome do preset").fill("Build E2E");
  await page.getByLabel("Descrição").fill("Uma descrição completa para validar o editor de build.");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Skills", exact: true }).click();
  await expect(page.getByText("Árvore de skills")).toBeVisible();
  await page.getByRole("button", { name: "Aumentar nível de Olho da Coruja" }).click();
  await expect(page.getByRole("spinbutton", { name: "Nível de Olho da Coruja" })).toHaveValue("1");
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Build E2E")).toBeVisible();
});
