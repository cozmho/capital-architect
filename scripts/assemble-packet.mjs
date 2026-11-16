#!/usr/bin/env node
/**
 * Gate 2: Packet Assembly & Blue-Ink Print Prep
 * 
 * Merges Equifax (*1876) pp. 4,37 and TransUnion (765650200675****) pp. 1,3
 * targeting TBOM/FORTIVA and "PERRY PRINGLE" alias
 * 
 * Usage: node scripts/assemble-packet.mjs [client-slug]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const CLIENT = process.argv[2] || 'terry-pringle-sr';
const KYC_DIR = join(process.cwd(), 'vault', 'kyc', CLIENT);
const INPUT_DIR = join(process.cwd(), 'vault', 'intake', CLIENT);
const OUTPUT_DIR = join(process.cwd(), 'vault', 'output');

// Ensure output directory exists
mkdirSync(OUTPUT_DIR, { recursive: true });

// Citation template for FCRA compliance
const createCitation = (section, page, source = 'Equifax') => `
[§1681i(a)(1) - 30-day dispute response window]
Source: ${source} · File: ${section}.pdf · Page: ${page}
Date pulled: ${new Date().toISOString().split('T')[0]}
`;

// Watermarked PDF creation (simplified - generates content + citation)
const assemblePacket = async () => {
  console.log(`🔧 Assembling packet for ${CLIENT}...`);
  
  // Check for KYC files
  const kycFiles = existsSync(KYC_DIR) ? [
    ...(existsSync(join(KYC_DIR, 'id.pdf')) ? ['id.pdf'] : []),
    ...(existsSync(join(KYC_DIR, 'bill.pdf')) ? ['bill.pdf'] : [])
  ] : [];
  
  if (kycFiles.length < 1) {
    console.log('⚠️  KYC files pending - stage ID + bill in vault/kyc/', CLIENT, '/');
    return { status: 'PENDING_KYC', kycNeeded: true };
  }
  
  // Mock credit report lines (in production, parse actual PDFs)
  const equifaxReport = {
    filename: 'equifax-*1876.pdf',
    pages: [4, 37],
    target: 'TBOM/FORTIVA',
    alias: 'PERRY PRINGLE'
  };
  
  const transunionReport = {
    filename: '765650200675****.pdf',
    pages: [1, 3],
    target: 'TBOM/FORTIVA',
    alias: 'PERRY PRINGLE'
  };
  
  // Generate packet content
  const packet = {
    client: CLIENT,
    created: new Date().toISOString(),
    kyc: kycFiles,
    sources: [equifaxReport, transunionReport],
    citations: {
      equifax: createCitation('Equifax', equifaxReport.pages.join(', '), 'Equifax'),
      transunion: createCitation('TransUnion', transunionReport.pages.join(', '), 'TransUnion')
    },
    nextStep: 'Verify attorney setoff items - stage Letter of Intent'
  };
  
  // Write output
  const outputPath = join(OUTPUT_DIR, `${CLIENT}-packet.json`);
  writeFileSync(outputPath, JSON.stringify(packet, null, 2));
  console.log(`✅ Packet written to ${outputPath}`);
  
  // Generate SMS print instructions
  const smsInstructions = `
📋 TERRY PRINGLE SR - PACKET ASSEMBLY COMPLETE

Sources: Equifax *1876 (£4,37), TU 765650200675**** (£1,3)
Target: TBOM/FORTIVA
Alias: PERRY PRINGLE

Next: Justice FCU loan approval → push to certified mail dispatch
`;
  console.log(smsInstructions);
  
  return packet;
};

// Run
assemblePacket().catch(e => {
  console.error('❌ Packet assembly failed:', e);
  process.exit(1);
});