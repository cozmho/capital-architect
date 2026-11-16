import { test as setup } from "@playwright/test";
import { clerkSetup } from "@clerk/testing/playwright";

setup("clerk setup", async () => {
  await clerkSetup();
});
