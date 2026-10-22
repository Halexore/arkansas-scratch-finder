import { expect, test } from "@playwright/test";

test("ranks remaining top prizes high to low and keeps zero-prize games last", async ({ page }) => {
  await page.goto("/");

  const rows = page.locator(".game-row");
  await expect(rows).toHaveCount(8);

  const prizeCounts = await rows.locator(".prize-value").allTextContents();
  expect(prizeCounts.map(Number)).toEqual([11, 8, 7, 4, 2, 1, 0, 0]);
  await expect(rows.nth(6).locator(".game-name")).toHaveText("Lucky Lanterns");
  await expect(rows.nth(7).locator(".game-name")).toHaveText("Wildflower Win");
});

test("updates only the selected game's store slot", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Edit display slot for River Run Riches, currently 12" }).click();
  await page.getByLabel("New display slot for River Run Riches").fill("42");
  await page.getByRole("button", { name: "Save slot for River Run Riches" }).click();

  const riverRun = page.locator(".game-row").filter({ hasText: "River Run Riches" });
  const bigPine = page.locator(".game-row").filter({ hasText: "Big Pine Payday" });
  await expect(riverRun.locator(".slot-number")).toHaveText("42");
  await expect(bigPine.locator(".slot-number")).toHaveText("2");
});

test("search finds games by name and display slot", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Search games or slot" });

  await search.fill("Moonlit");
  await expect(page.locator(".game-row")).toHaveCount(1);
  await expect(page.locator(".game-name")).toHaveText("Moonlit Millions");

  await search.fill("12");
  await expect(page.locator(".game-row")).toHaveCount(1);
  await expect(page.locator(".game-name")).toHaveText("River Run Riches");
});

test("fits the iPhone viewport and labels data as fictional with a sample timestamp", async ({ page }) => {
  await page.goto("/");

  const widths = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  expect(widths.viewport).toBe(402);
  expect(widths.document).toBeLessThanOrEqual(widths.viewport);
  expect(widths.body).toBeLessThanOrEqual(widths.viewport);

  await expect(
    page.getByText("Fictional sample data — not real Arkansas Lottery information")
  ).toBeVisible();
  await expect(page.locator(".sample-time")).toHaveText(
    "Sample snapshot · March 18, 2025 · 8:30 AM CT"
  );
});
