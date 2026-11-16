import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Capital Architect",
  description: "Capital Architect privacy policy — how we collect, use, and protect your personal and business information.",
};

const businessDetails = {
  name: "Capital Architect",
  address: "Madison, WI",
  email: "privacy@capitalarchitect.tech",
  effectiveDate: "September 2025",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="policy-page">
      <h1>Privacy Policy</h1>
      <p className="policy-date">Last updated: {businessDetails.effectiveDate}</p>

      <section aria-labelledby="intro-heading">
        <h2 id="intro-heading">Introduction</h2>
        <p>
          Capital Architect ("we," "our," or "us") is committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, disclose, and safeguard your information when
          you visit our website and use our services.
        </p>
        <p>
          By using our website, you consent to the practices described in this policy. If you do not
          agree, please do not use our site.
        </p>
      </section>

      <section aria-labelledby="info-heading">
        <h2 id="info-heading">Information We Collect</h2>
        <ul>
          <li>
            <strong>Personal identification information:</strong> name, email address, phone number,
            business name — collected when you submit the intake form, sign up for an account, or
            contact us.
          </li>
          <li>
            <strong>Financial information:</strong> FICO score range, monthly revenue, time in
            business — collected via the intake form to generate your fundability assessment. We do
            not store full credit reports or Social Security Numbers.
          </li>
          <li>
            <strong>Usage data:</strong> pages visited, time spent, referral source — collected
            automatically via Vercel Analytics (disabled until cookie consent is given).
          </li>
          <li>
            <strong>Cookies:</strong> see our{" "}
            <Link href="/cookies" className="policy-link">Cookies Policy</Link> for details.
          </li>
        </ul>
      </section>

      <section aria-labelledby="use-heading">
        <h2 id="use-heading">How We Use Your Information</h2>
        <ul>
          <li>To generate your fundability score and provide personalized funding strategy
            recommendations.</li>
          <li>To communicate with you about your assessment, results, and follow-up opportunities.</li>
          <li>To improve our website, services, and user experience.</li>
          <li>To comply with applicable laws and regulations.</li>
          <li>To prevent fraud and protect the security of our platform.</li>
        </ul>
      </section>

      <section aria-labelledby="share-heading">
        <h2 id="share-heading">Information Sharing</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share
          information with:
        </p>
        <ul>
          <li>
            <strong>Service providers:</strong> vendors who assist us in operating our website,
            conducting our business, or serving our users (e.g., Clerk for authentication, Vercel for
            hosting, Supabase for database storage), provided they agree to keep your information
            confidential.
          </li>
          <li>
            <strong>Legal requirements:</strong> if required by law, subpoena, or governmental
            request.
          </li>
          <li>
            <strong>Business transfers:</strong> in connection with a merger, sale of assets, or
            acquisition of all or a portion of our business.
          </li>
        </ul>
      </section>

      <section aria-labelledby="security-heading">
        <h2 id="security-heading">Data Security</h2>
        <p>
          We implement reasonable security measures to protect your personal information. However, no
          method of transmission over the Internet or electronic storage is 100% secure. While we
          strive to protect your data, we cannot guarantee its absolute security.
        </p>
      </section>

      <section aria-labelledby="rights-heading">
        <h2 id="rights-heading">Your Rights</h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your data ("right to be forgotten").</li>
          <li>Opt out of marketing communications.</li>
          <li>Withdraw consent at any time.</li>
        </ul>
        <p>
          To exercise these rights, contact us at{" "}
          <a href={`mailto:${businessDetails.email}`} className="policy-link">{businessDetails.email}</a>.
        </p>
      </section>

      <section aria-labelledby="retention-heading">
        <h2 id="retention-heading">Data Retention</h2>
        <p>
          We retain your personal information only as long as necessary to fulfill the purposes
          described in this policy, unless a longer retention period is required by law. Leads and
          intake data are retained for the duration of the applicant relationship plus a reasonable
          period for compliance and dispute resolution.
        </p>
      </section>

      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading">Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, contact:
        </p>
        <p>
          <strong>{businessDetails.name}</strong><br />
          {businessDetails.address}<br />
          <a href={`mailto:${businessDetails.email}`} className="policy-link">
            {businessDetails.email}
          </a>
        </p>
      </section>
    </div>
  );
}
