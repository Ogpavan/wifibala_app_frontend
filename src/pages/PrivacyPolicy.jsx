import { getTelHref, getWhatsAppHref } from "../utils/settings";

const LAST_UPDATED = "May 17, 2026";
const COMPANY_NAME = "Wifibala";
const SUPPORT_EMAIL = "ushopstore.in@gmail.com";
const SUPPORT_PHONE = "636276376";
const SUPPORT_WHATSAPP = "6396276376";

const sections = [
  {
    title: "1. Scope",
    body: [
      "This Privacy Policy explains how Wifibala collects, uses, stores, shares, and protects personal information when you use the app and related service features.",
    ],
  },
  {
    title: "2. Information We Collect",
    body: [
      "We collect the information you provide directly, including your name, mobile number, email address, and service address.",
      "We may also collect service-related details such as plan requests, complaint details, wallet or referral records, and support communication.",
      "If you contact us, we may store the contents of your messages and any follow-up notes needed to resolve your request.",
    ],
  },
  {
    title: "3. How We Use Information",
    body: [
      "We use your information to create and manage your account, provide services, verify requests, respond to complaints, and contact you about your service.",
      "We may use your details to display your profile, subscription status, wallet history, referral history, and support status in the app.",
    ],
  },
  {
    title: "4. Data Sharing",
    body: [
      "We do not sell your personal information.",
      "We may share necessary data with service operators, support staff, hosting providers, email or WhatsApp communication providers, payment or billing partners if used, and authorities when required by law.",
    ],
  },
  {
    title: "5. Data Retention and Deletion",
    body: [
      "We keep personal information only as long as needed to provide services, maintain records, handle complaints, manage billing, prevent fraud, and meet legal obligations.",
      "You may request deletion or correction of your account details by contacting support. Some records may be retained where required for legal, tax, billing, or security reasons.",
    ],
  },
  {
    title: "6. Permissions and Device Data",
    body: [
      "The current app flow is designed around account, subscription, complaint, wallet, and referral features.",
      "The app does not require camera, contact list, or precise location access for its core features unless a future feature explicitly needs it and requests permission.",
    ],
  },
  {
    title: "7. Payments, Wallet, and Refunds",
    body: [
      "If the app shows wallet balances, referral credits, or payment-related information, that data is used for account servicing and records. The wallet may be used to provide discounts and promotional credits now, and may later support grocery shopping features when those features are launched.",
      "If any payment or recharge is handled through a third-party provider, that provider may collect and process payment data under its own policy.",
      "Refund handling, if applicable, will depend on the service circumstances and applicable law.",
    ],
  },
  {
    title: "8. Third-Party Services",
    body: [
      "We may rely on third-party services for hosting, messaging, notifications, email delivery, or payment processing.",
      "Those services may process limited data on our behalf and are only used where needed to operate the app or support your requests.",
    ],
  },
  {
    title: "9. Security",
    body: [
      "We use reasonable safeguards to protect your information from unauthorized access, loss, misuse, or disclosure.",
      "No online service can guarantee absolute security, so you should keep your password and OTPs private.",
    ],
  },
  {
    title: "10. Your Choices",
    body: [
      "You may request access, correction, or deletion of your information by contacting support.",
      "You may also update your contact or address details through the app where those features are available.",
    ],
  },
  {
    title: "11. Children",
    body: [
      "The app is not intended for children who are not legally permitted to consent to online services in their jurisdiction.",
    ],
  },
  {
    title: "12. Changes to This Policy",
    body: [
      "We may update this policy when the app, our data practices, or legal requirements change.",
      "The updated version will take effect when posted in the app unless stated otherwise.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  const telHref = getTelHref(SUPPORT_PHONE);
  const whatsappHref = getWhatsAppHref(SUPPORT_WHATSAPP);

  return (
    <div className="wifi-page bg-white px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="wifi-card p-6 md:p-8">
          <h1 className="wifi-page-title text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">
            This policy explains how {COMPANY_NAME} handles personal information in the app.
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
                  If you have privacy questions, access or correction requests, or concerns about
                  data handling, contact {COMPANY_NAME} using the details below.
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
