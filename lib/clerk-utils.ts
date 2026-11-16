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
    role?: string;
    metadata?: { role?: string };
    publicMetadata?: { role?: string };
    public_metadata?: { role?: string };
  };

  return (
    claims.role ??
    claims.metadata?.role ??
    claims.publicMetadata?.role ??
    claims.public_metadata?.role
  );
}

/**
 * Checks if user has paid membership status
 * Looks for hasPaidMembership in both metadata and publicMetadata
 */
export function hasPaidMembership(sessionClaims: Record<string, unknown> | null): boolean {
  if (!sessionClaims) return false;

  const claims = sessionClaims as {
    hasPaidMembership?: boolean;
    has_paid_membership?: boolean;
    metadata?: { hasPaidMembership?: boolean };
    publicMetadata?: { hasPaidMembership?: boolean };
    public_metadata?: { hasPaidMembership?: boolean; has_paid_membership?: boolean };
  };

  return Boolean(
    claims.hasPaidMembership ??
      claims.has_paid_membership ??
      claims.metadata?.hasPaidMembership ??
      claims.publicMetadata?.hasPaidMembership ??
      claims.public_metadata?.hasPaidMembership ??
      claims.public_metadata?.has_paid_membership
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
