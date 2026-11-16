/**
 * Dispute Letter API - Generate Metro 2 compliant letters
 */

import { NextRequest, NextResponse } from 'next/server';
import { DISPUTE_TEMPLATES } from '@/lib/dispute-templates';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { template, params } = body;

    if (!template || !params) {
      return NextResponse.json({ success: false, error: 'Missing template or params' }, { status: 400 });
    }

    const validTemplates = ['initial', 'croa', 'fcra1681i', 'attorneySetoff'];
    if (!validTemplates.includes(template)) {
      return NextResponse.json({ success: false, error: 'Invalid template' }, { status: 400 });
    }

    const letter = DISPUTE_TEMPLATES[template as keyof typeof DISPUTE_TEMPLATES](params);

    return NextResponse.json({ 
      success: true, 
      letter,
      filename: `${template}-${Date.now()}.txt`
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    templates: ['initial', 'croa', 'fcra1681i', 'attorneySetoff'],
    statuses: ['filed', 'investigating', 'resolved', 'escalated', 'closed']
  });
}