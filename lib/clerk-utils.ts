/**
 * Shared Clerk authentication utilities
 * Centralizes validation and role extraction logic to avoid duplication
 */

/**
 * Validates that a Clerk publishable key is properly configured
 * Rejects placeholder keys like "pk_xxx..." or keys with 8+ consecutive x's
 */
export function hasValidClerkPublishableKey(publishableKey: string): boolean {
  return Boolean(publishableKey && !/x{8,}/i.test(publishableKey));
}

/**
 * Validates that a Clerk secret key is properly configured
 * Rejects placeholder keys like "sk_xxx..." or keys with 8+ consecutive x's
 */
export function hasValidClerkSecretKey(secretKey: string): boolean {
  return Boolean(secretKey && !/x{8,}/i.test(secretKey));
}

/**
 * Extracts user role from Clerk session claims
 * Checks both metadata.role and publicMetadata.role
 */
export function getUserRole(sessionClaims: Record<string, unknown> | null): string | undefined {
  if (!sessionClaims) return undefined;
  
  const claims = sessionClaims as {
    metadata?: { role?: string };
    publicMetadata?: { role?: string };
  };
  
  return claims.metadata?.role ?? claims.publicMetadata?.role;
}

/**
 * Checks if user has paid membership status
 * Looks for hasPaidMembership in both metadata and publicMetadata
 */
export function hasPaidMembership(sessionClaims: Record<string, unknown> | null): boolean {
  if (!sessionClaims) return false;
  
  const claims = sessionClaims as {
    metadata?: { hasPaidMembership?: boolean };
    publicMetadata?: { hasPaidMembership?: boolean };
  };
  
  return Boolean(
    claims.metadata?.hasPaidMembership ?? claims.publicMetadata?.hasPaidMembership
  );
}

/**
 * Parses comma-separated God Mode user IDs from environment variable
 * Returns a Set for O(1) lookup performance
 */
export function parseGodModeUserIds(): Set<string> {
  const rawValue = process.env.GOD_MODE_USER_IDS ?? '';
  
  return new Set(
    rawValue
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );
}
