export default function TermsPage() {
  return (
    <div className="wifi-page bg-white px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="wifi-card p-6 md:p-8">
          <h1 className="wifi-page-title text-3xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-sm text-[var(--color-text-muted)] mb-8">
            Please read these terms carefully before using WifiWala services.
          </p>

          <div className="space-y-6 text-sm text-[var(--color-text-muted)] leading-6">
            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">1. Service Usage</h2>
              <p>
                By accessing or using WifiWala services, you agree to use the platform lawfully
                and only for permitted personal or business internet service purposes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">2. Account Responsibility</h2>
              <p>
                You are responsible for maintaining accurate account information and for all
                activity carried out under your registered mobile number or account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">3. Plans, Billing, and Changes</h2>
              <p>
                Prices, benefits, validity, bundled OTT services, and promotional offers may change
                from time to time. Any active subscription remains subject to installation
                feasibility and local service availability.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">4. Support and Requests</h2>
              <p>
                Complaint requests, plan changes, and port or installation requests are processed
                subject to verification. Submission of a request does not guarantee approval.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">5. Acceptable Use</h2>
              <p>
                Users must not misuse the service, interfere with network operations, attempt
                unauthorized access, or use WifiWala services for illegal activities.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">6. Limitation</h2>
              <p>
                WifiWala is not liable for interruption caused by maintenance, local outages,
                third-party platform issues, force majeure events, or factors outside operational
                control.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-2">7. Contact</h2>
              <p>
                For clarification regarding these terms, please use the support contact information
                provided inside the app.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
