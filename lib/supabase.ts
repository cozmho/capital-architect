import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required Supabase environment variable: ${name}`);
  }
  return value;
}

export const supabase = createClient(
  requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
);

export type Prospect = {
  id?: string;
  email: string;
  name?: string | null;
  creditScore?: number | null;
  tier?: 'A' | 'B' | 'C' | null;
  audit_score?: number | null;
  cards_applied?: CardInfo[];
  bank_statement_lines?: number;
  dscr?: number | null;
  activeLoanApplication?: boolean;
  loanProgram?: '7a' | '504' | null;
  loanAmount?: number | null;
  loanStatus?: 'pending' | 'applying' | 'approved' | 'rejected';
  loanLender?: string;
  trackingId?: string;
  mailing_status?: 'pending' | 'delivered' | 'exception' | 'retransmitted';
  mailing_updated_at?: string;
  fcra_deadline?: string;
  created_at?: string;
  updated_at?: string;
};

export type CardInfo = {
  issuer: 'Chase' | 'Amex' | 'Elan' | 'USBank';
  product: string;
  status: 'not_applied' | 'applied' | 'approved' | 'approved_no_scrape';
  appliedAt?: string;
  approvedAt?: string;
  approvedLimit?: number;
};

export type SequencingState = {
  nextAction: string;
  remainingCards: number;
  velocity: { months: number; applications: number };
};

export async function upsertProspect(prospect: Prospect): Promise<void> {
  const { error } = await supabase.from("prospects").upsert(prospect, {
    onConflict: "email",
  });
  if (error) throw error;
}