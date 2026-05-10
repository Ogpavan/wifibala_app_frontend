import {
  getTelHref,
  getWhatsAppHref,
  readCachedAppSettings,
} from "../utils/settings";

const LAST_UPDATED = "May 10, 2026";

const sections = [
  {
    title: "1. Scope of This Privacy Policy",
    body: [
      "This Privacy Policy explains how wifibala collects, uses, stores, shares, and protects information when you use the wifibala mobile application and related service request features.",
      "It applies to information collected through account creation, sign-in, plan browsing, subscription requests, complaint submission, support communication, and other app interactions.",
    ],
  },
  {
    title: "2. Information We Collect",
    body: [
      "Information you provide directly may include your name, mobile number, email address, address, login credentials, service request details, complaint descriptions, and plan preferences.",
      "When you request a subscription or service activation, we may collect account-related details such as selected plan, requested validity, pricing information, subscription status, offer usage, and related operational records.",
      "When you contact support, we may collect the contents of your messages, complaint tickets, call or WhatsApp support references, and follow-up notes needed to resolve the issue.",
      "The app may also store limited information locally on your device, including signed-in user details, cached app settings, and theme preferences, to improve app performance and user experience.",
      "Our backend or hosting systems may automatically record basic technical data such as request timestamps, IP address, browser or device type, and error logs for security, fraud prevention, analytics, and troubleshooting.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    body: [
      "We use your information to create and manage your account, authenticate access, provide customer support, process service or subscription requests, verify eligibility, and coordinate installation or follow-up communication.",
      "We may use your information to display account-related content in the app, including profile details, complaint status, support contact information, and wallet or subscription information where available.",
      "We use operational and technical information to maintain app security, prevent abuse, debug issues, improve service quality, and comply with legal or regulatory obligations.",
      "We may contact you by phone, SMS, WhatsApp, email, or in-app communication for service confirmation, complaint resolution, billing support, important notices, and customer care follow-up.",
    ],
  },
  {
    title: "4. Legal Basis and Purpose",
    body: [
      "We process personal information where necessary to provide requested services, fulfill subscription or support requests, protect legitimate business and security interests, meet legal obligations, or act with your consent where consent is required by applicable law.",
    ],
  },
  {
    title: "5. How We Share Information",
    body: [
      "We do not sell your personal information.",
      "We may share information with installation teams, broadband or service operators, support personnel, CRM or hosting providers, analytics or infrastructure providers, payment or billing partners if applicable, and law enforcement or government authorities when legally required.",
      "We may also share information within our affiliated business operations to administer customer support, service delivery, fraud prevention, and dispute handling.",
    ],
  },
  {
    title: "6. Payments and Financial Information",
    body: [
      "If the app currently displays wallet balances, pricing, or recharge-related information, that information may be retrieved from backend systems for account servicing purposes.",
      "If direct payments, UPI collections, card processing, or wallet top-ups are added in the future, payment transactions may be handled by third-party payment processors. In that case, their privacy practices and terms may also apply to the payment transaction.",
      "Unless otherwise stated in a future app update, sensitive card or banking credentials are not intended to be stored directly in this frontend application.",
    ],
  },
  {
    title: "7. Device Storage and Cookies-Like Technologies",
    body: [
      "The app uses local device storage to retain limited data such as signed-in user information, app settings, and theme preferences so the app can remain usable between sessions and load faster.",
      "You can clear locally stored information by signing out, clearing app data, or using your browser or device settings, but doing so may remove saved preferences and require you to sign in again.",
    ],
  },
  {
    title: "8. Data Retention",
    body: [
      "We retain personal information for as long as reasonably necessary to provide services, manage subscriptions, maintain complaint and support history, complete billing or operational tasks, resolve disputes, prevent fraud, and comply with legal obligations.",
      "Retention periods may vary depending on the nature of the data, active account status, and regulatory or contractual requirements.",
    ],
  },
  {
    title: "9. Data Security",
    body: [
      "We use reasonable administrative, technical, and organizational measures to protect personal information from unauthorized access, misuse, loss, disclosure, or alteration.",
      "No digital platform can guarantee absolute security. You should protect your login credentials and avoid sharing one-time passwords or passwords with unauthorized persons.",
    ],
  },
  {
    title: "10. Your Choices and Rights",
    body: [
      "Subject to applicable law, you may request access to, correction of, or deletion of inaccurate personal information, or ask questions about how your data is handled.",
      "You may also request that we update your contact details or service address if they are outdated or incorrect. Some information may still be retained where necessary for legal, billing, security, or dispute-resolution reasons.",
    ],
  },
  {
    title: "11. Children’s Privacy",
    body: [
      "The app is not intended for children under the age required by applicable law to provide valid consent. We do not knowingly collect personal information from children in violation of applicable law.",
    ],
  },
  {
    title: "12. Permissions and Data Minimization",
    body: [
      "The current version of the app is designed around account, subscription, and support features. It does not describe collecting precise location, contacts, microphone recordings, camera content, or photo library data as core requirements of the present app flows.",
      "If a future version requests additional device permissions or collects new categories of data, we will update this Privacy Policy and, where required, request permission through the device or app interface.",
    ],
  },
  {
    title: "13. Changes to This Privacy Policy",
    body: [
      "We may update this Privacy Policy from time to time to reflect changes in app features, security practices, service operations, or legal requirements. The updated version becomes effective when published in the app unless otherwise stated.",
      "Your continued use of the app after an update indicates acceptance of the revised Privacy Policy.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
          <h1 className="wifi-page-title text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-2">
            This policy explains how {companyName} handles personal and technical information in
            the wifibala application.
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
                  data handling, contact {companyName} using the details below or the support
                  options available in the app.
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
