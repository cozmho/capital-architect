/**
 * Dispute Letter Templates - Metro 2 Compliance
 */

export const DISPUTE_TEMPLATES = {
  /**
   * Initial Dispute Letter (Metro 2 Format)
   */
  initial: (params: {
    consumerName: string;
    consumerId: string;
    address: string;
    creditorName: string;
    accountNumber: string;
    disputeReason: string;
    supportingDocs: string[];
  }): string => {
    const date = new Date().toISOString().split('T')[0];
    return [
      `DATE: ${date}`,
      '',
      params.consumerName,
      params.address,
      '',
      `Re: Account Dispute - ${params.creditorName} - ${params.accountNumber}`,
      '',
      `Dear ${params.creditorName},`,
      '',
      'I am writing to formally dispute the accuracy and completeness of the information ',
      'reported to consumer reporting agencies for the above-referenced account under ',
      'Metro 2 Reporting Standards (15 U.S.C. § 1681 et seq.).',
      '',
      'SPECIFIC ITEMS IN DISPUTE:',
      params.disputeReason,
      '',
      'SUPPORTING DOCUMENTATION PROVIDED:',
      ...params.supportingDocs.map(d => `- ${d}`),
      '',
      'Pursuant to FCRA § 609 and Metro 2 requirements, you are obligated to:',
      '1. Conduct a reasonable investigation of this dispute within 30 days',
      '2. Provide written notice of investigation results to consumer reporting agencies',
      '3. Include date opened, payment history, and delinquency status for all accounts',
      '4. Provide account descriptor, authorized user status, and credit limit',
      '',
      'Within 30 days of receipt, please either:',
      '- Provide documentation substantiating the reported information',
      '- Correct/delete the disputed items',
      '- Provide written notice of deletion if account cannot be verified',
      '',
      `REFERENCE NUMBER: ${params.consumerId}`,
      `TRACKING ID: DISPUTE-${Date.now()}`,
      '',
      'Sincerely,',
      params.consumerName,
    ].join('\n');
  },

  /**
   * CROA 72-Hour Notice - Certified Mail Rejection Follow-up
   */
  croa: (params: {
    consumerName: string;
    address: string;
    creditorName: string;
    accountNumber: string;
    certifiedMailTracking: string;
  }): string => {
    const date = new Date().toISOString().split('T')[0];
    return [
      `DATE: ${date}`,
      '',
      params.consumerName,
      params.address,
      '',
      `RE: Certified Mail Rejection - CROA 72-Hour Notice`,
      `Account: ${params.creditorName} - ${params.accountNumber}`,
      `Tracking: ${params.certifiedMailTracking}`,
      '',
      'Under the Contract Review and Oversight Act (CROA), you have 72 hours',
      'from certified mail delivery notification to:',
      '',
      '1. Provide delivery confirmation or proof of attempted delivery',
      '2. If rejected, immediately update the account status to "Delivered - Certified Return"',
      '3. Document the rejection in all consumer reporting files',
      '4. Provide written notice of status change within 30 days',
      '',
      'Failure to comply may constitute unfair/deceptive acts under FTC regulations.',
      '',
      'ACTION REQUIRED WITHIN 72 HOURS:',
      '- Send delivery confirmation via USPS tracking API',
      '- Update consumer report files',
      '- Provide written acknowledgment to consumer',
      '',
      'This letter is being sent via certified mail with return receipt requested.',
      `Delivery date: ${date}`,
      '',
      'Sincerely,',
      params.consumerName,
    ].join('\n');
  },

  /**
   * FCRA 1681i Letter - 30-Day Dispute Extension
   */
  fcra1681i: (params: {
    consumerName: string;
    creditorName: string;
    accountNumber: string;
    disputeDate: string;
  }): string => {
    const date = new Date().toISOString().split('T')[0];
    const deadline = new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0];
    return [
      `DATE: ${date}`,
      '',
      'NOTICE: FCRA § 1681i(a)(1) - 30-Day Investigation Window',
      '',
      params.consumerName,
      `Re: ${params.creditorName} - ${params.accountNumber}`,
      '',
      'This letter serves as formal notice under FCRA § 1681i(a)(1) that the',
      'information in question on your consumer report requires investigation.',
      '',
      `ORIGINAL DISPUTE DATE: ${params.disputeDate}`,
      'INVESTIGATION WINDOW: 30 calendar days from dispute date',
      `DEADLINE: ${deadline}`,
      '',
      'REQUIRED ACTIONS:',
      '1. Complete investigation within 30-day window',
      '2. Report findings to all three consumer reporting agencies',
      '3. Correct/delete inaccurate information',
      '4. Provide written notice to consumer if information changed',
      '',
      'Failure to complete investigation within the statutory timeframe',
      'entitles the consumer to seek actual damages in court.',
      '',
      'Reference: FCRA § 1681i(a)(1) - Investigation of Information',
      '',
      params.consumerName,
    ].join('\n');
  },

  /**
   * Attorney Setoff Evidence Letter
   */
  attorneySetoff: (params: {
    clientName: string;
    attorneyName: string;
    attorneyBar: string;
    estateNumber: string;
    disputedAmount: number;
    accountDetails: string;
  }): string => {
    const date = new Date().toISOString().split('T')[0];
    return [
      'ATTORNEY EVIDENCE ADDENDUM',
      '',
      `TO: ${params.attorneyName}, Esq.`,
      `   ${params.attorneyBar} Bar #${params.attorneyBar}`,
      `   Estate #${params.estateNumber}`,
      '',
      `FROM: ${params.clientName}`,
      '',
      `RE: Evidence of Account Dispute - "${params.accountDetails}"`,
      `    Disputed Amount: $${params.disputedAmount}`,
      '',
      'SUMMARY OF EVIDENCE:',
      '1. Metro 2 Reporting Violations',
      '2. FCRA § 609 Non-Compliance',
      '3. CROA Certified Mail Issues',
      '',
      'ATTACHMENTS:',
      `- Dispute letter (DISPUTE-${Date.now()})`,
      '- Credit reports (Equifax, TransUnion, Experian)',
      '- Payment history discrepancies',
      '- Account descriptor inconsistencies',
      '',
      'REQUESTED ACTIONS:',
      '1. Freeze reporting pending investigation',
      '2. Delete disputed accounts after 30-day investigation',
      '3. Provide written confirmation of deletion',
      '4. File appropriate reporting with credit bureaus',
      '',
      'This evidence addendum supports the initial attorney settlement request',
      'and demonstrates good faith dispute activity.',
      '',
      `Date: ${date}`,
      `Bar: ${params.attorneyBar}`,
      `Estate: ${params.estateNumber}`,
    ].join('\n');
  },
};

/**
 * Dispute Status Tracker
 */
export type DisputeStatus = 'filed' | 'investigating' | 'resolved' | 'escalated' | 'closed';

export const DISPUTE_STATUSES = {
  filed: { label: 'Filed', color: 'blue' },
  investigating: { label: 'Under Investigation', color: 'yellow' },
  resolved: { label: 'Resolved', color: 'green' },
  escalated: { label: 'Escalated to Attorney', color: 'orange' },
  closed: { label: 'Closed', color: 'gray' },
};