import { getTelHref, getWhatsAppHref } from "../utils/settings";

const LAST_UPDATED = "May 17, 2026";
const COMPANY_NAME = "Wifibala";
const SUPPORT_EMAIL = "ushopstore.in@gmail.com";
const SUPPORT_PHONE = "636276376";
const SUPPORT_WHATSAPP = "6396276376";

const sections = [
  {
    title: "1. Acceptance",
    body: [
      "These Terms govern your use of the Wifibala mobile application and related support, subscription, and service-request features.",
      "By creating an account, signing in, browsing plans, submitting a complaint, or requesting a service, you agree to these Terms. If you do not agree, do not use the app.",
    ],
  },
  {
    title: "2. Eligibility and Account Information",
    body: [
      "You must provide accurate account information, including your name, mobile number, email address, and service address, when requested.",
      "You are responsible for keeping your account secure and for all activity performed through your account.",
    ],
  },
  {
    title: "3. Services We Provide",
    body: [
      "The app may allow you to view plans, submit service or subscription requests, raise complaints, view wallet and referral information where available, and contact support.",
      "Plan availability, pricing, service areas, and activation timelines may change based on location and operational conditions.",
    ],
  },
  {
    title: "4. Subscription Requests",
    body: [
      "Submitting a request through the app does not guarantee activation, installation, or approval.",
      "A request may be rejected or delayed if the service is not available, details are incomplete, verification fails, or the address is not serviceable.",
    ],
  },
  {
    title: "5. Billing, Wallet, Refunds, and Payments",
    body: [
      "If the app shows wallet balances, rewards, or recharge information, those values represent a service wallet that may be used to apply discounts, promotional credits, or other account benefits now, and may also be used for future grocery shopping features when those features are introduced.",
      "If payments, refunds, or wallet top-ups are processed through third-party providers, those transactions are also subject to the provider's own terms and policies.",
      "Refunds, if any, will be handled according to the service circumstances and applicable law.",
    ],
  },
  {
    title: "6. Complaint and Support Usage",
    body: [
      "You may use the app to submit complaints or support requests.",
      "You agree to provide truthful and complete information and not to submit abusive, fraudulent, or repetitive false requests.",
    ],
  },
  {
    title: "7. Acceptable Use",
    body: [
      "You must not misuse the app, attempt unauthorized access, upload malicious content, interfere with services, or use the app for unlawful activity.",
      "You must not submit false identity, phone, email, address, or request details.",
    ],
  },
  {
    title: "8. Suspension and Termination",
    body: [
      "We may suspend or terminate access if you violate these Terms, misuse the app, create security risks, or provide false information.",
      "Termination of app access does not automatically cancel any service obligations or dues that already exist.",
    ],
  },
  {
    title: "9. Intellectual Property",
    body: [
      "The app design, text, graphics, and software belong to Wifibala unless stated otherwise.",
      "Third-party names, logos, and marks belong to their respective owners and are used only for identification.",
    ],
  },
  {
    title: "10. Privacy",
    body: [
      "Your use of the app is also governed by the Wifibala Privacy Policy.",
    ],
  },
  {
    title: "11. Changes to the Terms",
    body: [
      "We may update these Terms from time to time to reflect app changes, legal requirements, or operational updates.",
      "Continued use of the app after an update means you accept the revised Terms.",
    ],
  },
  {
    title: "12. Governing Law",
    body: [
      "These Terms are governed by the laws of India. Any dispute will be subject to the applicable courts and consumer law requirements.",
    ],
  },
];

export default function TermsPage() {
  const telHref = getTelHref(SUPPORT_PHONE);
  const whatsappHref = getWhatsAppHref(SUPPORT_WHATSAPP);

  return (
    <div className="wifi-page bg-white px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="wifi-card p-6 md:p-8">
          <h1 className="wifi-page-title text-3xl font-bold mb-2">Terms &amp; Conditions</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">
            These terms explain the rules for using the {COMPANY_NAME} application and related
            service request features.
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mb-8">
            Last updated: {LAST_UPDATED}
          </p>

          <div className="space-y-6 text-sm text-[var(--color-text-muted)] leading-6">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}

            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">14. Contact Us</h2>
              <div className="space-y-3">
                <p>
                  If you have questions about these Terms, billing issues, complaints, or service
                  requests, contact {COMPANY_NAME} using the support details below.
                </p>
                <p>
                  Phone:{" "}
                  <a className="text-[var(--color-primary)]" href={telHref}>
                    {SUPPORT_PHONE}
                  </a>
                </p>
                <p>
                  WhatsApp:{" "}
                  <a
                    className="text-[var(--color-primary)]"
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {SUPPORT_WHATSAPP}
                  </a>
                </p>
                <p>
                  Email:{" "}
                  <a className="text-[var(--color-primary)]" href={`mailto:${SUPPORT_EMAIL}`}>
                    {SUPPORT_EMAIL}
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
