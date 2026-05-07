import { expect, test } from "@playwright/test";

test("Numen loads and links to the public project", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /local-first literature review/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /star/i })).toHaveAttribute(
    "href",
    "https://github.com/baditaflorin/numen",
  );
  await expect(page.getByRole("link", { name: /paypal/i })).toHaveAttribute(
    "href",
    "https://www.paypal.com/paypalme/florinbadita",
  );
  await page.getByRole("button", { name: /library/i }).click();
  await expect(
    page.getByRole("heading", { name: "Paper Cache" }),
  ).toBeVisible();
  await page.getByRole("button", { name: /cite/i }).first().click();
  await expect(page.getByRole("heading", { name: "BibTeX" })).toBeVisible();
  await page.getByRole("button", { name: /system/i }).click();
  await expect(page.getByText(/Version/)).toBeVisible();
  await expect(page.getByText(/Commit/)).toBeVisible();
});
