/**
 * Capital Stack Sequencing - Product Recommendations in Optimal Order
 * 
 * Based on credit profile, tier, and funding velocity constraints
 */

export type CreditTier = 'A' | 'B' | 'C';

export type CapitalProduct = {
  issuer: string;
  product: string;
  tierRequired: CreditTier;
  minCreditScore: number;
  maxInquiryCount: number;
  velocityWindowMonths: number;
  recommendedOrder: number;
  features: string[];
  caveats: string[];
  fundingSpeedDays: number;
  creditLimitRange: [number, number];
};

// Product catalog for each tier
export const CAPITAL_STACK: Record<CreditTier, CapitalProduct[]> = {
  A: [
    {
      issuer: 'Chase',
      product: 'Ink Business Unlimited',
      tierRequired: 'A',
      minCreditScore: 720,
      maxInquiryCount: 2,
      velocityWindowMonths: 24,
      recommendedOrder: 1,
      features: [
        '0% Intro APR for 15 months',
        '$750 sign-up bonus',
        '2.5% cash back on office supplies',
        'No annual fee'
      ],
      caveats: [
        'Requires 5/24 rule - max 5 recent inquiries',
        '2/30 rule: max 2 cards in 30 days, 30 total',
        'Must be business structure'
      ],
      fundingSpeedDays: 7,
      creditLimitRange: [5000, 25000]
    },
    {
      issuer: 'American Express',
      product: 'Blue Business Plus',
      tierRequired: 'A',
      minCreditScore: 720,
      maxInquiryCount: 1,
      velocityWindowMonths: 90,
      recommendedOrder: 2,
      features: [
        '15-month 0% intro APR',
        '$250 sign-up bonus after $3,000 spend',
        '2x Points on up to $50,000/year',
        'No foreign transaction fees'
      ],
      caveats: [
        '2/90 rule: max 2 Amex cards in 90 days',
        'No pre-set spending limit (PSLL available)',
        'Points value varies by redemption'
      ],
      fundingSpeedDays: 14,
      creditLimitRange: [10000, 50000]
    },
    {
      issuer: 'Elan Financial',
      product: 'Platinum Card',
      tierRequired: 'A',
      minCreditScore: 700,
      maxInquiryCount: 1,
      velocityWindowMonths: 18,
      recommendedOrder: 3,
      features: [
        '18-month 0% intro APR',
        '$150-$300 sign-up bonus',
        '3x Points on dining/entertainment',
        'No foreign transaction fees'
      ],
      caveats: [
        'US Bank partnership - use carefully',
        'May require secondary cardholder',
        'Points transfer to multiple partners'
      ],
      fundingSpeedDays: 21,
      creditLimitRange: [5000, 15000]
    }
  ],

  B: [
    {
      issuer: 'Capital One',
      product: 'SavorOne',
      tierRequired: 'B',
      minCreditScore: 685,
      maxInquiryCount: 1,
      velocityWindowMonths: 6,
      recommendedOrder: 1,
      features: [
        '3% Cash back on dining',
        '2% at grocery stores',
        '$200 bonus after $500 spend',
        'No foreign transaction fees'
      ],
      caveats: [
        'Recent 5/24 hits may block',
        'CreditWise monitoring recommended',
        'May require pre-approval check'
      ],
      fundingSpeedDays: 10,
      creditLimitRange: [3000, 10000]
    },
    {
      issuer: 'Citi',
      product: 'Double Cash',
      tierRequired: 'B',
      minCreditScore: 690,
      maxInquiryCount: 2,
      velocityWindowMonths: 12,
      recommendedOrder: 2,
      features: [
        '2% cash back on all purchases',
        'Instant $0% intro APR on purchases',
        '$0 annual fee',
        'No bonus category rotations'
      ],
      caveats: [
        'No sign-up bonus',
        'Balance transfer fees apply',
        'May require good history with Citi'
      ],
      fundingSpeedDays: 5,
      creditLimitRange: [2500, 8000]
    },
    {
      issuer: 'Discover',
      product: 'It Chrome',
      tierRequired: 'B',
      minCreditScore: 670,
      maxInquiryCount: 1,
      velocityWindowMonths: 18,
      recommendedOrder: 3,
      features: [
        '5% Cash back in categories (rotating)',
        '1% on everything else',
        '$0 annual fee',
        'No foreign transaction fees'
      ],
      caveats: [
        'Category caps at $1,500/quarter',
        'Can hurt credit if cancelled early',
        'Not accepted everywhere'
      ],
      fundingSpeedDays: 15,
      creditLimitRange: [1500, 5000]
    }
  ],

  C: [
    {
      issuer: 'Capital One',
      product: 'Secured Mastercard',
      tierRequired: 'C',
      minCreditScore: 600,
      maxInquiryCount: 1,
      velocityWindowMonths: 6,
      recommendedOrder: 1,
      features: [
        'Build credit with $49-$200 deposit',
        'Reports to all 3 bureaus',
        'No annual fee',
        'Higher limit potential after 6 months'
      ],
      caveats: [
        'Deposit required upfront',
        'May result in hard inquiry',
        'Lower initial limit impact'
      ],
      fundingSpeedDays: 14,
      creditLimitRange: [49, 200]
    },
    {
      issuer: 'Credit One',
      product: 'Bankcard',
      tierRequired: 'C',
      minCreditScore: 620,
      maxInquiryCount: 1,
      velocityWindowMonths: 12,
      recommendedOrder: 2,
      features: [
        '24-month intro 0% APR',
        '$0 annual fee',
        'Up to 29.99% ongoing APR',
        'Monthly account reviews for limit increases'
      ],
      caveats: [
        'High ongoing APR',
        'Interest charges apply',
        'May charge $ monthly fee'
      ],
      fundingSpeedDays: 10,
      creditLimitRange: [500, 1500]
    },
    {
      issuer: 'Community Credit Union',
      product: 'Share Secured',
      tierRequired: 'C',
      minCreditScore: 580,
      maxInquiryCount: 0,
      velocityWindowMonths: 24,
      recommendedOrder: 3,
      features: [
        'Secured by share savings account',
        'May not report to credit bureaus',
        'Lower fees than banks',
        'Local community focus'
      ],
      caveats: [
        'May not build credit quickly',
        'Requires membership',
        'Limited nationwide access'
      ],
      fundingSpeedDays: 30,
      creditLimitRange: [200, 1000]
    }
  ]
};

export type SequencingRecommendation = {
  prospectId: string;
  currentTier: CreditTier;
  creditScore: number;
  currentInquiryCount: number;
  nextProduct: CapitalProduct | null;
  timeline: Array<{
    step: number;
    product: string;
    issuer: string;
    expectedApproval: 'likely' | 'possible' | 'unlikely';
    daysToApply: number;
    notes: string;
  }>;
  velocityCheck: {
    remainingApplications: number;
    resetDate: string;
    safeToApply: boolean;
  };
};

/**
 * Generate sequencing recommendations based on credit profile
 */
export function generateSequencing(
  creditScore: number,
  inquiryCount: number,
  existingCards: string[] = []
): SequencingRecommendation {
  const tier: CreditTier = creditScore >= 720 ? 'A' : creditScore >= 685 ? 'B' : 'C';
  const products = CAPITAL_STACK[tier];

  // Calculate velocity constraints
  const remainingApplications = Math.min(
    tier === 'A' ? 24 - inquiryCount : tier === 'B' ? 6 - inquiryCount : 0,
    10
  );

  // Find next recommended product
  const nextProduct = products.find(p => 
    !existingCards.includes(p.product) && 
    p.minCreditScore <= creditScore
  ) || null;

  // Build timeline
  const timeline = products.slice(0, 3).map((product, index) => ({
    step: index + 1,
    product: product.product,
    issuer: product.issuer,
    expectedApproval: creditScore >= product.minCreditScore * 1.1 ? 'likely' as const : 
                     creditScore >= product.minCreditScore ? 'possible' as const : 'unlikely' as const,
    daysToApply: index * 30 + 1,
    notes: product.caveats.length > 0 ? product.caveats[0] : 'Recommended priority product'
  }));

  // Calculate reset date for velocity
  const velocityResetDate = new Date();
  velocityResetDate.setMonth(velocityResetDate.getMonth() + 24);

  return {
    prospectId: '',
    currentTier: tier,
    creditScore,
    currentInquiryCount: inquiryCount,
    nextProduct,
    timeline,
    velocityCheck: {
      remainingApplications,
      resetDate: velocityResetDate.toISOString().split('T')[0],
      safeToApply: remainingApplications > 0
    }
  };
}

/**
 * Check if application would violate velocity rules
 */
export function checkVelocityConstraints(
  tier: CreditTier,
  inquiryCount: number,
  applicationMonth: number
): { allowed: boolean; violation: string | null } {
  const constraints = {
    A: { maxPerYear: 24, maxPerMonth: 2, resetMonths: 30 },
    B: { maxPerYear: 6, maxPerMonth: 1, resetMonths: 12 },
    C: { maxPerYear: 0, maxPerMonth: 0, resetMonths: 24 }
  };

  const c = constraints[tier];
  
  if (inquiryCount >= c.maxPerYear) {
    return { allowed: false, violation: `Yearly inquiry limit reached (${c.maxPerYear})` };
  }

  // Check for pattern violations
  const monthInquiries = {
    5: inquiryCount >= 5 ? '5/24 rule violation' : null,
    30: inquiryCount >= 2 ? '2/30 rule violation' : null,
    90: inquiryCount >= 2 ? '2/90 rule violation' : null
  };

  for (const [window, violation] of Object.entries(monthInquiries)) {
    if (violation) {
      return { allowed: false, violation };
    }
  }

  return { allowed: true, violation: null };
}