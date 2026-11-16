import { test, expect, type Page } from "@playwright/test";
import { clerk } from "@clerk/testing/playwright";

type AssessmentOptions = {
  entity: "Private Trust" | "No Entity";
  inquiries: "0" | "3-4" | "5+";
  errors: "0" | "1-2" | "3+";
};

async function completeAssessment(page: Page, options: AssessmentOptions) {
  await page.goto("/assess");

  await page.getByPlaceholder("John Smith").fill("E2E Test User");
  await page.getByPlaceholder("john@example.com").fill(`e2e-${Date.now()}@example.com`);
  await page.getByPlaceholder("(555) 123-4567").fill("5551234567");

  const firstContinue = page.getByRole("button", { name: "Continue" }).first();
  await expect(firstContinue).toBeEnabled();
  await firstContinue.click();

  if (options.entity === "No Entity") {
    await page.getByRole("button", { name: "No" }).click();
  } else {
    await page.getByRole("button", { name: "Yes" }).click();
    await page.getByLabel("Entity Type").selectOption(options.entity);
  }

  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByLabel(/How many times has your credit been pulled/i).selectOption(options.inquiries);
  await page.getByLabel(/How many errors or negative items/i).selectOption(options.errors);

  await page.getByRole("button", { name: "Get My Results" }).click();
}

test.describe("Capital Architect smoke tests", () => {
  test("Tier A redirects to ready page", async ({ page }) => {
    await completeAssessment(page, {
      entity: "Private Trust",
      inquiries: "0",
      errors: "0",
    });

    await expect(page).toHaveURL(/\/assess\/results\/ready$/);
    await expect(page.getByRole("link", { name: "Book Your Strategy Call" })).toBeVisible();
  });

  test("Tier B redirects to prep page", async ({ page }) => {
    await completeAssessment(page, {
      entity: "No Entity",
      inquiries: "3-4",
      errors: "1-2",
    });

    await expect(page).toHaveURL(/\/assess\/results\/prep$/);
    await expect(page.getByRole("link", { name: /Funding Readiness Intensive/i })).toBeVisible();
  });

  test("Tier C redirects to repair page", async ({ page }) => {
    await completeAssessment(page, {
      entity: "No Entity",
      inquiries: "5+",
      errors: "3+",
    });

    await expect(page).toHaveURL(/\/assess\/results\/repair$/);
    await expect(page.getByRole("link", { name: /DIY Credit Repair Guide/i })).toBeVisible();
  });

  test("Auth pages load", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page).toHaveURL(/\/sign-in/);

    await page.goto("/sign-up");
    await expect(page).toHaveURL(/\/sign-up/);
  });

  test("Admin access uses Clerk identity", async ({ page }) => {
    test.skip(
      !process.env.CLERK_TESTING_TOKEN || !process.env.TEST_USER_EMAIL,
      "CLERK_TESTING_TOKEN and TEST_USER_EMAIL are required for Clerk test sign-in"
    );

    await page.goto("/");
    await clerk.signIn({ page, emailAddress: process.env.TEST_USER_EMAIL! });

    await page.goto("/dashboard/admin/scoring");

    if (process.env.TEST_USER_IS_ADMIN === "true") {
      await expect(page.getByRole("heading", { name: "God-Mode Dashboard" })).toBeVisible();
    } else {
      await expect(page).not.toHaveURL(/\/dashboard\/admin/);
    }
  });
});
