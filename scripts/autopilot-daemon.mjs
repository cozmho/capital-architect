#!/usr/bin/env node
/**
 * Gate 1: Autonomous Folder Watcher & Ops Daemon
 * 
 * Watches ./vault/intake/{client_slug}/ for PDFs → OCR → verdic-evaluator → dispute packets
 * 
 * Usage: node scripts/autopilot-daemon.mjs [client-slug]
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { execSync } from 'child_process';

const CLIENTS = ['terry-pringle-sr']; // Add more client slugs as needed
const INBOX_DIR = join(process.cwd(), 'vault', 'intake');

const isPdf = (file) => extname(file).toLowerCase() === '.pdf';

const processClient = (clientSlug) => {
  const clientDir = join(INBOX_DIR, clientSlug);
  console.log(`👀 Monitoring ${clientDir} for new PDFs...`);
  
  try {
    const files = readdirSync(clientDir);
    const pdfs = files.filter(isPdf);
    
    if (pdfs.length === 0) {
      console.log(`  No new PDFs for ${clientSlug}`);
      return;
    }
    
    console.log(`  Found ${pdfs.length} PDF(s): ${pdfs.join(', ')}`);
    
    // Run packet assembly
    console.log(`  🚀 Triggering assemble-packet.mjs...`);
    execSync(`node scripts/assemble-packet.mjs ${clientSlug}`, { stdio: 'inherit' });
    
    // Move processed PDFs to archive
    const archiveDir = join(process.cwd(), 'vault', 'archive', clientSlug);
    execSync(`mkdir -p ${archiveDir}`);
    pdfs.forEach(pdf => {
      execSync(`mv ${join(clientDir, pdf)} ${archiveDir}/`);
      console.log(`  📦 Archived ${pdf}`);
    });
    
  } catch (e) {
    console.error(`  Error processing ${clientSlug}:`, e.message);
  }
};

// Main loop - check every 30 seconds
console.log('🔧 Autopilot Daemon starting...');
console.log('Press Ctrl+C to stop\n');

const run = () => {
  CLIENTS.forEach(processClient);
};

run(); // Initial check
setInterval(run, 30000); // Check every 30 seconds