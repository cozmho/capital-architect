import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Capital Architect",
  description: "Terms and conditions for using Capital Architect's website and services.",
};

const businessDetails = {
  name: "Capital Architect",
  address: "Madison, WI",
  email: "legal@capitalarchitect.tech",
  effectiveDate: "September 2025",
};

export default function TermsPage() {
  return (
    <div className="policy-page">
      <h1>Terms &amp; Conditions</h1>
      <p className="policy-date">Last updated: {businessDetails.effectiveDate}</p>

      <section aria-labelledby="accept-heading">
        <h2 id="accept-heading">Acceptance of Terms</h2>
        <p>
          By accessing and using Capital Architect's website and services, you accept and agree to be
          bound by the terms and provisions of this agreement. If you do not agree to all the terms
          and provisions, you may not access or use the services.
        </p>
      </section>

      <section aria-labelledby="services-heading">
        <h2 id="services-heading">Description of Services</h2>
        <p>
          Capital Architect provides fundability assessments, credit optimization guidance, and
          funding strategy recommendations to business owners. Our services are informational and
          advisory in nature and do not constitute financial advice, legal advice, or a guarantee of
          funding approval.
        </p>
      </section>

      <section aria-labelledby="disclaimer-heading">
        <h2 id="disclaimer-heading">No Guarantee of Results</h2>
        <p>
          All assessments, scores, and recommendations provided by Capital Architect are estimates
          based on the information you provide. We make no representations or warranties as to the
          accuracy or completeness of the information you provide, and we cannot guarantee that any
          funding application will be approved, that any credit score will improve, or that any
          specific financial outcome will be achieved.
        </p>
        <p>
          You acknowledge that lending decisions are made solely by third-party lenders and financial
          institutions, not by Capital Architect.
        </p>
      </section>

      <section aria-labelledby="user-heading">
        <h2 id="user-heading">User Responsibilities</h2>
        <ul>
          <li>Provide accurate and complete information in all intake forms and communications.</li>
          <li>Keep your account credentials confidential.</li>
          <li>Not use the website for any illegal or unauthorized purpose.</li>
          <li>Not attempt to interfere with or compromise the security of the website.</li>
        </ul>
      </section>

      <section aria-labelledby="ip-heading">
        <h2 id="ip-heading">Intellectual Property</h2>
        <p>
          All content on this website, including text, graphics, logos, icons, and software, is the
          property of Capital Architect or its content suppliers and is protected by applicable
          intellectual property laws. You may not reproduce, distribute, or create derivative works
          from our content without prior written permission.
        </p>
      </section>

      <section aria-labelledby="limit-heading">
        <h2 id="limit-heading">Limitation of Liability</h2>
        <p>
          Capital Architect shall not be liable for any indirect, incidental, consequential, or
          punitive damages arising from your use of the website or services, including but not limited
          to loss of data, loss of profits, or failure to achieve any expected funding outcome, even if
          advised of the possibility of such damages.
        </p>
      </section>

      <section aria-labelledby="changes-heading">
        <h2 id="changes-heading">Changes to Terms</h2>
        <p>
          We reserve the right to modify or revise these terms at any time. Changes will be effective
          immediately upon posting. Your continued use of the website after changes constitutes
          acceptance of the revised terms.
        </p>
      </section>

      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading">Contact</h2>
        <p>
          For questions about these Terms &amp; Conditions, contact:
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
