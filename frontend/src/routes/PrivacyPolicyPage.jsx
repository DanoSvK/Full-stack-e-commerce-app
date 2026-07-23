function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-zinc-200 -mt-24">
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-zinc-400 mb-8">Last updated: June 28, 2026</p>

      <p className="mb-8">
        This Privacy Policy explains how <strong>BESTshop</strong> ("the
        Application") collects, uses, and protects your personal data.
      </p>

      {/* 1 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          1. Information We Collect
        </h2>

        <h3 className="text-lg font-semibold mt-4 mb-2">Account Information</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>Name</li>
          <li>Email address</li>
          <li>Username</li>
          <li>Google account information (if used)</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">User-Generated Data</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>Reviews</li>
          <li>Comments</li>
          <li>Wishlists</li>
          <li>Customer-related properties</li>
          <li>Order-related data (if implemented)</li>
          <li>Any content users create in the Application</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">Technical Data</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>IP address</li>
          <li>Browser and device information</li>
          <li>Login timestamps</li>
          <li>Activity logs</li>
          <li>Authentication data (JWT session info)</li>
        </ul>
      </section>

      {/* 2 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          2. How We Use Information
        </h2>

        <ul className="list-disc ml-6 space-y-2">
          <li>To authenticate and manage user accounts</li>
          <li>To provide access to the Application</li>
          <li>To ensure security and prevent abuse</li>
          <li>To debug and improve system functionality</li>
          <li>To support testing and development activities</li>
          <li>To maintain logs for operational purposes</li>
        </ul>
      </section>

      {/* 3 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          3. Cookies and Authentication
        </h2>
        <p>
          The Application uses cookies to store JSON Web Tokens (JWTs) for
          authentication purposes. These cookies are required for secure login
          and session management.
        </p>
      </section>

      {/* 4 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. Third-Party Services</h2>

        <p className="mb-3">
          The Application currently uses third-party services such as:
        </p>

        <ul className="list-disc ml-6 space-y-1">
          <li>Bloomreach Engagement</li>
        </ul>

        <p className="mt-3">
          Additional third-party services may be introduced in the future for
          analytics, monitoring, hosting, or improvements.
        </p>
      </section>

      {/* 5 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">5. Data Storage</h2>

        <p>
          Data is stored on secure servers operated by the Application or its
          hosting provider. Hosting details will be defined separately.
        </p>
      </section>

      {/* 6 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">6. Data Security</h2>

        <p>
          We use reasonable technical and organizational measures to protect
          personal data. Passwords are securely hashed and never stored in plain
          text.
        </p>
      </section>

      {/* 7 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">7. Data Retention</h2>

        <p>
          Data is retained only as long as necessary for application operation,
          debugging, security, or legal requirements.
        </p>
      </section>

      {/* 8 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">8. Data Deletion</h2>

        <p>
          Users may request deletion of their account and personal data. Some
          data may be retained where required for security, auditing, or
          technical reasons.
        </p>
      </section>

      {/* 9 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">9. Your Rights</h2>

        <p className="mb-3">
          Depending on applicable laws, you may have the right to:
        </p>

        <ul className="list-disc ml-6 space-y-1">
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Request information about processing activities</li>
        </ul>
      </section>

      {/* 10 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          10. Administrator Access
        </h2>

        <p>
          The system administrator may access user data for debugging,
          maintenance, security, and operational purposes.
        </p>
      </section>

      {/* 11 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">11. Changes</h2>

        <p>
          This Privacy Policy may be updated at any time. Continued use of the
          Application means acceptance of the updated version.
        </p>
      </section>

      {/* 12 */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">12. Contact</h2>

        <p>If you have questions about this Privacy Policy, contact:</p>

        <p className="mt-2 font-medium">daniel.kopac@bloomreach.com</p>
      </section>
    </main>
  );
}

export default PrivacyPolicyPage;
