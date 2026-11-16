/**
 * Capital Stack Dashboard - Product Sequencing & Dispute Management
 */

"use client";

import { useState } from 'react';
import { CAPITAL_STACK, generateSequencing } from '@/lib/sequencing';
import { DISPUTE_STATUSES } from '@/lib/dispute-templates';

export default function CapitalStackDashboard() {
  const [creditScore, setCreditScore] = useState(720);
  const [inquiryCount, setInquiryCount] = useState(2);
  const [tier, setTier] = useState<'A' | 'B' | 'C'>('A');
  const [showDispute, setShowDispute] = useState(false);

  const sequencing = generateSequencing(creditScore, inquiryCount);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Capital Stack Dashboard</h1>
        
        {/* Credit Profile Input */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h2 className="font-medium mb-3">Credit Profile</h2>
          <div className="flex gap-4">
            <div>
              <label className="text-sm text-slate-600">FICO Score</label>
              <input
                type="number"
                value={creditScore}
                onChange={e => setCreditScore(Number(e.target.value))}
                className="border rounded px-2 py-1 w-20"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Recent Inquiries</label>
              <input
                type="number"
                value={inquiryCount}
                onChange={e => setInquiryCount(Number(e.target.value))}
                className="border rounded px-2 py-1 w-20"
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Current Tier</label>
              <select
                value={tier}
                onChange={e => setTier(e.target.value as any)}
                className="border rounded px-2 py-1"
              >
                <option value="A">A (720+)</option>
                <option value="B">B (685-719)</option>
                <option value="C">C (600-684)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sequencing Recommendations */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h2 className="font-medium mb-3">Sequencing Recommendations</h2>
          <p className="text-sm text-slate-600 mb-2">
            Safe to apply: {sequencing.velocityCheck.safeToApply ? 'Yes' : 'No'}
            {sequencing.velocityCheck.remainingApplications > 0 && (
              <span> ({sequencing.velocityCheck.remainingApplications} applications remaining)</span>
            )}
          </p>
          
          <div className="space-y-3">
            {sequencing.timeline.map((step, i) => (
              <div key={i} className="border-l-4 py-2 pl-4" 
                   style={{ borderColor: step.expectedApproval === 'likely' ? '#22c55e' : step.expectedApproval === 'possible' ? '#eab308' : '#ef4444' }}>
                <div className="flex justify-between">
                  <span className="font-medium">{step.step}. {step.product}</span>
                  <span className="text-xs" style={{ color: step.expectedApproval === 'likely' ? '#22c55e' : step.expectedApproval === 'possible' ? '#eab308' : '#ef4444' }}>
                    {step.expectedApproval}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{step.notes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Product Catalog */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <h2 className="font-medium mb-3">Product Catalog</h2>
          {(['A', 'B', 'C'] as const).map(tierName => (
            <details key={tierName} className="mb-2">
              <summary className="cursor-pointer font-medium">
                Tier {tierName} — {CAPITAL_STACK[tierName].length} products
              </summary>
              <div className="mt-2 space-y-2">
                {CAPITAL_STACK[tierName].map((product, i) => (
                  <div key={i} className="border rounded p-3">
                    <div className="flex justify-between">
                      <strong>{product.issuer} — {product.product}</strong>
                      <span className="text-xs">Order: {product.recommendedOrder}</span>
                    </div>
                    <p className="text-sm mt-1">{product.features.slice(0, 2).join(', ')}</p>
                    <p className="text-xs text-amber-600 mt-1">{product.caveats[0]}</p>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>

        {/* Dispute Tools */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium">Dispute Management</h2>
            <button 
              onClick={() => setShowDispute(!showDispute)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
            >
              {showDispute ? 'Hide' : 'Show'} Templates
            </button>
          </div>
          
          {showDispute && (
            <div className="space-y-3 text-sm">
              <button 
                onClick={() => alert('Template loaded - copy to clipboard')}
                className="w-full text-left p-3 border rounded hover:bg-slate-50"
              >
                <strong>Initial Dispute Letter</strong> - Metro 2 compliant
              </button>
              <button 
                onClick={() => alert('Template loaded - copy to clipboard')}
                className="w-full text-left p-3 border rounded hover:bg-slate-50"
              >
                <strong>CROA 72-Hour Notice</strong> - Certified mail rejection
              </button>
              <button 
                onClick={() => alert('Template loaded - copy to clipboard')}
                className="w-full text-left p-3 border rounded hover:bg-slate-50"
              >
                <strong>FCRA 1681i Extension</strong> - 30-day dispute window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}