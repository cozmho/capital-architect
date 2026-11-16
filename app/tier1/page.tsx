/**
 * Tier-1 Banking Dashboard - Gate 4
 * 
 * Visualizes credit card sequencing and loan status
 */

"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';

type CardStatus = 'approved' | 'applied' | 'not_applied';

type SequencingState = {
  prospectId: string;
  creditScore: number;
  tier: 'A' | 'B' | 'C';
  cards: Array<{
    issuer: string;
    product: string;
    status: CardStatus;
    approvedLimit?: number;
    appliedAt?: string;
    approvedAt?: string;
  }>;
  nextAction: string;
  velocity: { months: number; applications: number };
};

type LoanState = {
  program?: '7a' | '504' | null;
  status?: string;
  amount?: number;
  lender?: string;
};

export default function Tier1Dashboard() {
  const [state, setState] = useState<SequencingState | null>(null);
  const [loan, setLoan] = useState<LoanState>({});
  const [loading, setLoading] = useState(true);
  const [selectedProspect, setSelectedProspect] = useState('');

  const router = useRouter();

  // Load prospect ID from query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('prospect');
    if (id) {
      setSelectedProspect(id);
      loadSequencing(id);
    }
  }, []);

  const loadSequencing = async (prospectId: string) => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/sequence-cards', { method: 'POST', body: { prospectId } });
      setState(data);
      
      // Fetch loan status
      const loanData = await apiFetch('/api/sba-loan', { method: 'POST', body: { prospectId } });
      setLoan(loanData);
    } catch (e) {
      console.error('Load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplication = async (issuer: string) => {
    if (!selectedProspect) return;
    
    await apiFetch(`/api/sequence-cards`, {
      method: 'PUT',
      body: { prospectId: selectedProspect, issuer, status: 'applied' }
    });
    
    loadSequencing(selectedProspect);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (!state) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tier-1 Banking Sequence</h1>
        <p className="text-gray-600">Select a prospect to view sequencing</p>
      </div>
    );
  }

  const tierColors = { 'A': 'bg-green-500', 'B': 'bg-yellow-500', 'C': 'bg-red-500' };
  const statusColors = {
    'approved': 'bg-green-100 text-green-800',
    'applied': 'bg-blue-100 text-blue-800',
    'not_applied': 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tier-1 Banking Sequence</h1>
      
      {/* Credit Score & Tier */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Credit Profile</h2>
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold">{state.creditScore}</span>
          <span className={`px-3 py-1 rounded text-white ${tierColors[state.tier]}`}>
            Tier {state.tier}
          </span>
          <span className="text-gray-600">Velocity: {state.velocity.applications} apps in {state.velocity.months}mo</span>
        </div>
      </div>

      {/* Card Sequence */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Card Sequencing</h2>
        <div className="space-y-3">
          {state.cards.map((card, idx) => (
            <div key={card.issuer} className={`flex items-center gap-4 p-3 border rounded`}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                idx === 0 ? 'bg-blue-500' : 'bg-gray-300'
              }`}>
                {idx + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-medium">{card.issuer} {card.product}</h3>
                <p className="text-sm text-gray-600">{card.status.replace('_', ' ')}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${statusColors[card.status]}`}>
                {card.status}
              </span>
              {card.status === 'not_applied' && (
                <button 
                  onClick={() => handleApplication(card.issuer)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Apply
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Action */}
      <div className="mb-6 p-4 bg-blue-50 border rounded">
        <h2 className="font-semibold mb-2">Next Action</h2>
        <p className="text-blue-800">{state.nextAction}</p>
      </div>

      {/* Loan Status */}
      {loan.program && (
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">SBA Loan Status</h2>
          <p><strong>Program:</strong> {loan.program === '7a' ? 'SBA 7(a)' : 'SBA 504'}</p>
          <p><strong>Status:</strong> {loan.status}</p>
          {loan.amount && <p><strong>Amount:</strong> ${loan.amount.toLocaleString()}</p>}
          {loan.lender && <p><strong>Lender:</strong> {loan.lender}</p>}
        </div>
      )}
    </div>
  );
}