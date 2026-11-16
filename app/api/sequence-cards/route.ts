/**
 * Credit Card Sequencing API - Gate 4
 * 
 * Tier-1 Corporate Banking Sequences:
 * 1. Chase Ink (5/24, 2/30; loan≠5/24)
 * 2. Amex Biz (2/90)
 * 3. Elan/US Bank 18mo 0%
 * 
 * Avoid: Discover, TD, personal-reporting CapOne
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type ApplicationStatus = 'not_applied' | 'applied' | 'approved' | 'rejected' | 'approved_no_scrape';
type CardInfo = {
  issuer: 'Chase' | 'Amex' | 'Elan' | 'USBank';
  product: string;
  status: ApplicationStatus;
  appliedAt?: string;
  approvedAt?: string;
  approvedLimit?: number;
};

type SequencingResult = {
  prospectId: string;
  creditScore: number;
  tier: 'A' | 'B' | 'C';
  cards: CardInfo[];
  nextAction: string;
  velocity: { months: number; applications: number };
};

// Check credit score tier
const getTier = (score: number): 'A' | 'B' | 'C' => {
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  return 'C';
};

// Validate velocity (max 2/24 for Chase, 1/24 for others)
const validateVelocity = (prospect: any, newIssuer: string): { ok: boolean; reason?: string } => {
  const cards = prospect.cards_applied || [];
  const last24mo = cards.filter((c: CardInfo) => {
    const date = new Date(c.appliedAt || c.approvedAt || '');
    return date && (Date.now() - date.getTime()) < 86400000 * 24;
  });
  
  if (newIssuer === 'Chase' && last24mo.filter((c: CardInfo) => c.issuer === 'Chase').length >= 2) {
    return { ok: false, reason: 'Chase 2/24 velocity exceeded' };
  }
  
  if (newIssuer !== 'Chase' && last24mo.length >= 3) {
    return { ok: false, reason: 'Total velocity check failed' };
  }
  
  return { ok: true };
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prospectId, initiateFirstStep = false } = body;
    
    if (!prospectId) {
      return NextResponse.json({ error: 'prospectId required' }, { status: 400 });
    }
    
    // Get prospect
    const { data: prospect, error } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', prospectId)
      .single();
      
    if (error || !prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }
    
    // Ensure credit score exists
    if (!prospect.creditScore) {
      return NextResponse.json({ 
        error: 'Credit score required - complete assessment first' 
      }, { status: 400 });
    }
    
    const tier = getTier(prospect.creditScore);
    const existingCards = prospect.cards_applied || [];
    
    // Define sequencing rules
    const sequence: CardInfo[] = [
      { issuer: 'Chase', product: 'Ink Business Unlimited', status: existingCards.find((c: CardInfo) => c.issuer === 'Chase')?.status || 'not_applied' },
      { issuer: 'Amex', product: 'Blue Business Plus', status: existingCards.find((c: CardInfo) => c.issuer === 'Amex')?.status || 'not_applied' },
      { issuer: 'Elan', product: 'USBank Business Curve', status: existingCards.find((c: CardInfo) => c.issuer === 'Elan')?.status || 'not_applied' },
    ];
    
    // Determine next step
    let nextIssuer = 'Chase';
    let nextProduct = 'Ink Business Unlimited';
    let nextAction = 'Chase Ink application';
    
    for (const card of sequence) {
      const vel = validateVelocity(prospect, card.issuer);
      if (!vel.ok) {
        // Skip to next in sequence
        continue;
      }
      
      if (card.status === 'not_applied') {
        nextIssuer = card.issuer;
        nextProduct = card.product;
        nextAction = `${card.issuer} ${card.product} application`;
        break;
      }
      
      if (card.status === 'approved_no_scrape') {
        // Use pre-existing credit for better odds
        nextIssuer = card.issuer;
        nextProduct = card.product;
        nextAction = `${card.issuer} ${card.product} with existing limit`;
        break;
      }
    }
    
    const result: SequencingResult = {
      prospectId,
      creditScore: prospect.creditScore,
      tier,
      cards: sequence,
      nextAction,
      velocity: {
        months: 6,
        applications: existingCards.length
      }
    };
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Sequencing error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { prospectId, issuer, status, limit } = body;
    
    if (!prospectId || !issuer || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Get current cards
    const { data: prospect } = await supabase
      .from('prospects')
      .select('cards_applied')
      .eq('id', prospectId)
      .single();
      
    const cards = prospect?.cards_applied || [];
    
    // Update or add card
    const existing = cards.find((c: any) => c.issuer === issuer);
    if (existing) {
      existing.status = status;
      if (limit) existing.approvedLimit = limit;
      if (status === 'approved') existing.approvedAt = new Date().toISOString();
    } else {
      cards.push({
        issuer,
        product: body.product || 'Unknown',
        status,
        approvedAt: status === 'approved' ? new Date().toISOString() : undefined,
        approvedLimit: limit
      });
    }
    
    // Save
    const { error } = await supabase
      .from('prospects')
      .update({ cards_applied: cards })
      .eq('id', prospectId);
      
    if (error) throw error;
    
    return NextResponse.json({ success: true, cards });
    
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}