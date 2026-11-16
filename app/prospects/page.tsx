/**
 * Prospects Dashboard — Client list and pipeline view
 */

"use client";

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import Link from 'next/link';

type Prospect = {
  id?: string;
  email: string;
  name?: string | null;
  creditScore?: number | null;
  tier?: 'A' | 'B' | 'C' | null;
  audit_score?: number | null;
  cards_applied?: Array<{
    issuer: string;
    product: string;
    status: 'not_applied' | 'applied' | 'approved' | 'approved_no_scrape';
    approvedLimit?: number;
    appliedAt?: string;
    approvedAt?: string;
  }>;
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
};

type PipelineStage = {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  due?: string;
  notes?: string;
};

export default function ProspectsDashboard() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'pending'>('all');

  useEffect(() => {
    loadProspects();
  }, [filter]);

  const loadProspects = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/prospects', { 
        method: 'GET',
        params: filter === 'active' ? { status: 'pending' } : undefined
      });
      setProspects(data.data || []);
    } catch (e) {
      console.error('Load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const getPipelineStages = (prospect: Prospect): PipelineStage[] => [
    {
      id: 'credit_reports',
      name: 'Credit Reports (Equifax/TU)',
      status: prospect.creditScore ? 'completed' : 'pending',
    },
    {
      id: 'audit',
      name: '$497 Audit Purchase',
      status: prospect.audit_score ? 'completed' : 'pending',
    },
    {
      id: 'card_sequencing',
      name: 'Card Sequencing',
      status: prospect.cards_applied && prospect.cards_applied.length > 0 
        ? prospect.cards_applied.some(c => c.status === 'approved') ? 'completed' 
        : 'in_progress'
        : 'in_progress',
    },
    {
      id: 'justice_fcu',
      name: 'Justice FCU Loan',
      status: prospect.activeLoanApplication ? 'in_progress' : 'pending',
      due: prospect.fcra_deadline,
    },
    {
      id: 'certified_mail',
      name: 'Certified Mail Dispatch',
      status: prospect.trackingId ? 'completed' : (prospect.activeLoanApplication ? 'pending' : 'blocked'),
      notes: prospect.activeLoanApplication ? 'Queued after approval' : 'Requires Justice FCU approval',
    },
  ];

  const filterProspects = (prospects: Prospect[]): Prospect[] => {
    if (filter === 'active') {
      return prospects.filter(p => !p.creditScore || p.activeLoanApplication || !p.trackingId);
    }
    if (filter === 'pending') {
      return prospects.filter(p => !p.trackingId);
    }
    return prospects;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <h1 className="text-2xl font-bold mb-4">Prospects Dashboard</h1>
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  const filteredProspects = filterProspects(prospects);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Prospects Dashboard</h1>
        
        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
          >
            All ({prospects.length})
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-white border'}`}
          >
            Pending
          </button>
        </div>

        {/* Prospect List */}
        {filteredProspects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-slate-600">No prospects found</p>
            <Link href="/" className="text-blue-600 hover:underline">Return to Tier-1 Dashboard</Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProspects.map(prospect => (
              <div key={prospect.id || prospect.email} className="bg-white rounded-lg p-4 shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-bold text-lg">{prospect.name || prospect.email}</h2>
                    <p className="text-sm text-slate-600">{prospect.email}</p>
                    {prospect.tier && (
                      <span className={`inline-block px-2 py-0.5 text-xs rounded mt-1 ${
                        prospect.tier === 'A' ? 'bg-green-100 text-green-800' :
                        prospect.tier === 'B' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        Tier {prospect.tier}
                      </span>
                    )}
                  </div>
                  <Link href={`/tier1?prospect=${prospect.id || prospect.email}`} className="text-blue-600 hover:underline">
                    View Details →
                  </Link>
                </div>

                {/* Pipeline */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Pipeline</h3>
                  <div className="flex gap-2 flex-wrap">
                    {getPipelineStages(prospect).map(stage => (
                      <span key={stage.id} className={`px-2 py-0.5 text-xs rounded ${
                        stage.status === 'completed' ? 'bg-green-100 text-green-800' :
                        stage.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        stage.status === 'blocked' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {stage.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}