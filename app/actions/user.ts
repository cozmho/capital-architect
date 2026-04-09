"use server";

import { getPrismaClient } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Ensures that the current Clerk user exists in the Prisma database.
 * Updates the user's role and email if they have changed.
 */
export async function syncUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    console.error("User sync failed: Clerk user has no email address", clerkUser.id);
    return null;
  }

  const prisma = getPrismaClient();
  
  // Extract role from Clerk public metadata or use default "SETTER"
  const rawRole = (clerkUser.publicMetadata?.role as string) || "SETTER";
  const role = rawRole.toUpperCase();

  try {
    const user = await prisma.user.upsert({
      where: { id: clerkUser.id },
      update: {
        email,
        role,
      },
      create: {
        id: clerkUser.id,
        email,
        role,
      },
    });

    return user;
  } catch (error) {
    console.error("Database error during user sync:", error);
    return null;
  }
}
