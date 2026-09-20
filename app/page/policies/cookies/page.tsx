import Link from "next/link";

export const metadata = {
  title: "Cookies Policy | Capital Architect",
  description: "Capital Architect cookies policy — what cookies we use and how to manage them.",
};

const businessDetails = {
  name: "Capital Architect",
  email: "privacy@capitalarchitect.tech",
  effectiveDate: "September 2025",
};

export default function CookiePolicyPage() {
  return (
    <div className="policy-page">
      <h1>Cookies Policy</h1>
      <p className="policy-date">Last updated: {businessDetails.effectiveDate}</p>

      <section aria-labelledby="what-heading">
        <h2 id="what-heading">What Are Cookies</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you
          visit a website. They are widely used to make websites work more effectively and to provide
          information to the website owners.
        </p>
      </section>

      <section aria-labelledby="use-heading">
        <h2 id="use-heading">How We Use Cookies</h2>
        <p>
          Capital Architect uses cookies for the following purposes:
        </p>
        <ul>
          <li>
            <strong>Essential cookies:</strong> necessary for the website to function properly
            (e.g., Clerk authentication sessions). These are set regardless of your consent.
          </li>
          <li>
            <strong>Analytics cookies:</strong> help us understand how visitors interact with our
            website (e.g., Vercel Analytics). These are only set after you give consent.
          </li>
          <li>
            <strong>Functional cookies:</strong> enable enhanced functionality and personalization
            (e.g., remembering your preferences).
          </li>
        </ul>
      </section>

      <section aria-labelledby="third-heading">
        <h2 id="third-heading">Third-Party Cookies</h2>
        <p>
          In addition to our own cookies, we may use various third-party cookies to report usage
          statistics, deliver advertisements, and for other purposes. These include:
        </p>
        <ul>
          <li>
            <strong>Vercel Analytics:</strong> used to understand site traffic and usage patterns.
            Disabled until cookie consent is given.
          </li>
          <li>
            <strong>Stripe:</strong> may set cookies related to payment processing when you proceed to
            checkout. These are essential for the payment functionality.
          </li>
          <li>
            <strong>Clerk:</strong> sets cookies for authentication session management. These are
            essential for logged-in functionality.
          </li>
        </ul>
        <p>
          We do not use third-party advertising networks or tracking pixels that share data with
          advertising partners.
        </p>
      </section>

      <section aria-labelledby="manage-heading">
        <h2 id="manage-heading">Managing Cookies</h2>
        <p>
          You can control and manage cookies in several ways. Most browsers allow you to:
        </p>
        <ul>
          <li>View what cookies are stored on your device.</li>
          <li>Delete specific cookies or all cookies.</li>
          <li>Block cookies from specific sites.</li>
          <li>Block all third-party cookies.</li>
          <li>Set browsers to notify you when a cookie is set.</li>
        </ul>
        <p>
          Please note that blocking or deleting cookies may impair some of the features and
          functionality of our website.
        </p>
        <p>
          You can withdraw your consent at any time by clearing your cookies or using our cookie
          consent banner to change your preferences.
        </p>
      </section>

      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading">Contact Us</h2>
        <p>
          If you have questions about our use of cookies, contact:
        </p>
        <p>
          <strong>{businessDetails.name}</strong><br />
          <a href={`mailto:${businessDetails.email}`} className="policy-link">
            {businessDetails.email}
          </a>
        </p>
      </section>
    </div>
  );
}
