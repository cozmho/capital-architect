import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export type Prospect = {
  email: string;
  name?: string | null;
  audit_score?: number | null;
  tier?: string | null;
  created_at?: string;
};

export async function upsertProspect(prospect: Prospect): Promise<void> {
  const { error } = await supabase.from("prospects").upsert(prospect, {
    onConflict: "email",
  });
  if (error) throw error;
}