import {
  getTelHref,
  getWhatsAppHref,
  readCachedAppSettings,
} from "../utils/settings";

const LAST_UPDATED = "May 10, 2026";

const sections = [
  {
    title: "1. Acceptance of These Terms",
    body: [
      "These Terms and Conditions govern your access to and use of the wifibala mobile application, website integrations, and related broadband, internet, support, and subscription request services made available through the app.",
      "By creating an account, signing in, browsing plans, submitting a complaint, or requesting a subscription, installation, or support service, you agree to be bound by these Terms. If you do not agree, do not use the app.",
    ],
  },
  {
    title: "2. Eligibility and Account Registration",
    body: [
      "You must provide accurate and complete information when registering, including your name, mobile number, email address, and service address where required.",
      "You are responsible for maintaining the confidentiality of your login credentials and for all activity carried out through your account. You must promptly notify support if you believe your account has been accessed without authorization.",
      "You may use the app only for lawful purposes and only in connection with genuine service enquiries, plan requests, subscription management, and customer support.",
    ],
  },
  {
    title: "3. Services Available Through the App",
    body: [
      "wifibala may allow you to view plans, compare broadband or internet offerings, check promotional offers, submit subscription requests, view certain account-related information such as wallet balance where enabled, and raise complaints or support requests.",
      "Availability of plans, speeds, prices, installation timelines, service areas, bundled benefits, and promotional offers may vary by location and may change without prior notice.",
      "Information displayed in the app is provided for convenience. Final activation, installation, verification, and service feasibility remain subject to operational checks and confirmation by the service provider.",
    ],
  },
  {
    title: "4. Subscription Requests, Billing, and Payments",
    body: [
      "When you submit a plan or subscription request through the app, you authorize wifibala or its representatives to contact you to verify the request and complete activation or installation.",
      "A request submitted through the app is not an unconditional acceptance or guaranteed activation of service. It may be rejected, delayed, or modified if the plan is unavailable, the address is not serviceable, payment is not confirmed, or verification fails.",
      "If payments, recharges, wallet credits, refunds, or third-party billing services are introduced or used, those transactions may also be subject to the separate terms of the relevant payment processor, bank, UPI provider, gateway, or billing partner.",
      "You are responsible for reviewing plan details, validity, pricing, taxes, usage limits, and renewal conditions before submitting a request.",
    ],
  },
  {
    title: "5. Customer Support and Complaint Handling",
    body: [
      "The app may allow you to submit complaint details, support queries, or service-related issues. You agree to provide accurate descriptions and not to submit misleading, abusive, unlawful, or repetitive complaints.",
      "Complaint and support response times are estimates only. Resolution may depend on issue severity, service availability, third-party dependencies, field staff scheduling, and verification requirements.",
    ],
  },
  {
    title: "6. Acceptable Use Restrictions",
    body: [
      "You must not misuse the app or connected services. This includes attempting unauthorized access, interfering with networks or servers, introducing malicious code, impersonating another person, scraping app content at scale, or using the app to support unlawful activity.",
      "You must not submit false identity details, false subscription requests, false complaints, or inaccurate address information.",
    ],
  },
  {
    title: "7. Suspension, Restriction, or Termination",
    body: [
      "wifibala may suspend, restrict, or terminate access to the app or specific services if you violate these Terms, provide false information, misuse support channels, create security risks, or where access must be limited for legal, operational, billing, or fraud-prevention reasons.",
      "Termination or suspension of app access does not automatically cancel any underlying service obligations, dues, or legal responsibilities that may already apply between you and the service provider.",
    ],
  },
  {
    title: "8. Intellectual Property",
    body: [
      "The app interface, branding, text, graphics, plan presentation, logos owned by wifibala, and related software components are protected by applicable intellectual property laws.",
      "Third-party brand names, operator names, OTT logos, and trademarks shown in the app remain the property of their respective owners and are used for identification or informational purposes only.",
    ],
  },
  {
    title: "9. Disclaimers",
    body: [
      "The app and its content are provided on an as available and as is basis to the maximum extent permitted by law. wifibala does not guarantee uninterrupted availability, error-free operation, real-time accuracy of plan listings, or uninterrupted internet connectivity.",
      "Service interruptions may occur because of maintenance, outages, infrastructure issues, vendor dependency, force majeure events, technical failures, or factors outside reasonable control.",
    ],
  },
  {
    title: "10. Limitation of Liability",
    body: [
      "To the maximum extent permitted by applicable law, wifibala and its affiliates, personnel, and partners will not be liable for indirect, incidental, special, consequential, or punitive losses arising from app use, service delays, plan unavailability, data loss, or unauthorized account activity caused by your failure to secure your credentials.",
      "Nothing in these Terms excludes liability where exclusion is not permitted under applicable law.",
    ],
  },
  {
    title: "11. Privacy",
    body: [
      "Your use of the app is also governed by the wifibala Privacy Policy, which explains how personal information is collected, used, stored, and shared.",
    ],
  },
  {
    title: "12. Changes to These Terms",
    body: [
      "wifibala may update these Terms from time to time to reflect app changes, operational requirements, legal obligations, or security needs. The updated version becomes effective when published in the app unless otherwise stated.",
      "Your continued use of the app after an update means you accept the revised Terms.",
    ],
  },
  {
    title: "13. Governing Law",
    body: [
      "These Terms are intended to be interpreted in accordance with applicable laws of India. Any dispute related to the app or these Terms will be subject to the jurisdiction of the competent courts where the service provider operates, unless otherwise required by applicable consumer law.",
    ],
  },
];

export default function TermsPage() {
  const settings = readCachedAppSettings();
  const companyName = settings.company_name || "wifibala";
  const phone = settings.primary_number || "";
  const email = settings.email_id || "";
  const whatsapp = settings.whatsapp_number || settings.primary_number || "";
  const telHref = getTelHref(phone);
  const whatsappHref = getWhatsAppHref(whatsapp);

  return (
    <div className="wifi-page bg-white px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="wifi-card p-6 md:p-8">
          <h1 className="wifi-page-title text-3xl font-bold mb-2">Terms &amp; Conditions</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">
            These terms explain the rules for using the {companyName} application and related
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
                  requests, contact {companyName} using the support details provided in the app.
                </p>
                {phone ? (
                  <p>
                    Phone:{" "}
                    <a className="text-[var(--color-primary)]" href={telHref}>
                      {phone}
                    </a>
                  </p>
                ) : null}
                {whatsapp ? (
                  <p>
                    WhatsApp:{" "}
                    <a
                      className="text-[var(--color-primary)]"
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {whatsapp}
                    </a>
                  </p>
                ) : null}
                {email ? (
                  <p>
                    Email:{" "}
                    <a
                      className="text-[var(--color-primary)]"
                      href={`mailto:${email}`}
                    >
                      {email}
                    </a>
                  </p>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
