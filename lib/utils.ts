/**
 * Utility functions for Capital Architect
 */

export function getRandomUUID(): string {
  return crypto.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-' + 'xxxxxxxxxxxx'.replace(/x/g, () => Math.random().toString(16)[2]);
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}