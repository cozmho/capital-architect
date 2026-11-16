/**
 * SBA 7(a)/504 Loan Application API - Gate 4
 * 
 * Bank statement lines + DSCR ≥ 1.25
 * Justice FCU Equifax-pull loan (0 inquiries)
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type SBARequest = {
  prospectId: string;
  program: '7a' | '504';
  loanAmount: number;
  purpose: string;
  dscr?: number;
};

export async function POST(req: NextRequest) {
  try {
    const body: SBARequest = await req.json();
    
    if (!body.prospectId || !body.program || !body.loanAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const { data: prospect, error } = await supabase
      .from('prospects')
      .select('*')
      .eq('id', body.prospectId)
      .single();
      
    if (error || !prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }
    
    // Check bank statement lines
    const bankLines = prospect.bank_statement_lines || 0;
    if (bankLines < 3) {
      return NextResponse.json({
        error: 'Insufficient bank statement lines',
        required: 3,
        current: bankLines,
      }, { status: 400 });
    }
    
    // Check DSCR
    const dscr = body.dscr || prospect.dscr;
    if (dscr && dscr < 1.25) {
      return NextResponse.json({
        error: 'DSCR below minimum',
        required: 1.25,
        actual: dscr,
      }, { status: 400 });
    }
    
    // Check loan application flag
    if (prospect.activeLoanApplication) {
      return NextResponse.json({
        error: 'Loan application already in progress',
        lender: prospect.loanLender,
      }, { status: 409 });
    }
    
    // Mark as applying
    await supabase
      .from('prospects')
      .update({
        activeLoanApplication: true,
        loanProgram: body.program,
        loanAmount: body.loanAmount,
        loanPurpose: body.purpose,
        loanStatus: 'applying',
      })
      .eq('id', body.prospectId);
    
    return NextResponse.json({
      status: 'submitted',
      prospectId: body.prospectId,
      program: body.program,
      loanAmount: body.loanAmount,
      dscr,
      bankLines,
      nextStep: 'Justice FCU Equifax pull (0 inquiries)',
    });
    
  } catch (error) {
    console.error('SBA application error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { prospectId, status, lender, approvedAmount } = body;
    
    if (!prospectId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const update: any = { loanStatus: status };
    if (lender) update.loanLender = lender;
    if (approvedAmount) update.loanApprovedAmount = approvedAmount;
    
    if (status === 'approved') {
      update.activeLoanApplication = false;
      update.loanApprovedAt = new Date().toISOString();
    }
    
    const { error } = await supabase
      .from('prospects')
      .update(update)
      .eq('id', prospectId);
      
    if (error) throw error;
    
    return NextResponse.json({ success: true, ...update });
    
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}