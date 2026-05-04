export default function PrivacyPolicyPage() {
  return (
    <div className="wifi-page bg-white px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="wifi-card p-6 md:p-8">
          <h1 className="wifi-page-title text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">
            This policy explains how WifiWala collects, uses, and protects your information.
          </p>

          <div className="space-y-6 text-sm text-[var(--color-text-muted)] leading-6">
            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">1. Information We Collect</h2>
              <p>
                We may collect your name, mobile number, email address, address, subscription
                preferences, complaint details, and other information required to provide service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">2. How We Use Information</h2>
              <p>
                Your information is used to create accounts, manage subscriptions, process support
                requests, improve service quality, communicate important updates, and maintain
                operational records.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">3. Sharing of Information</h2>
              <p>
                We do not sell personal data. Information may be shared only with service partners,
                installation teams, payment providers, or authorities where necessary for service
                delivery, compliance, or legal obligations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">4. Data Security</h2>
              <p>
                We take reasonable steps to protect stored information from unauthorized access,
                misuse, loss, or disclosure. However, no digital system can be guaranteed as
                completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">5. Retention</h2>
              <p>
                Data may be retained as long as required for account management, billing, support,
                dispute resolution, and legal or regulatory compliance.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">6. Your Rights</h2>
              <p>
                You may request correction of inaccurate information or contact support regarding
                questions about how your personal data is handled.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">7. Policy Updates</h2>
              <p>
                This policy may be updated from time to time to reflect operational, legal, or
                service changes. Continued use of the app indicates acceptance of the latest
                version.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
