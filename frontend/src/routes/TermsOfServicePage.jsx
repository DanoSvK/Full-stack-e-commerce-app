function TermsOfServicePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-zinc-200 -mt-24">
      <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
      <p className="text-zinc-400 mb-8">Last updated: June 28, 2026</p>

      <p className="mb-8">
        Welcome to <strong>BESTshop</strong> ("the Application"). These Terms of
        Service govern your access to and use of the Application. By creating an
        account or using the Application, you agree to these Terms.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. Purpose</h2>
        <p>
          BESTshop is an internal application intended for employee testing,
          debugging, training, and development activities. The Application is
          not intended for public use.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. Eligibility</h2>
        <p>
          The Application is intended for employees and authorized users only.
          Anyone may register an account; however, access and continued use may
          be restricted or revoked by the Application administrator at any time.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>

        <p className="mb-4">Users may register using:</p>

        <ul className="list-disc ml-6 space-y-2">
          <li>Username and password</li>
          <li>Google Sign-In</li>
        </ul>

        <p className="mt-4">
          Users are responsible for maintaining the confidentiality of their
          login credentials and for all activity performed using their accounts.
        </p>

        <p className="mt-4">
          Passwords are securely stored using industry-standard hashing
          algorithms and are never stored in plain text.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. User Content</h2>

        <p className="mb-4">
          Users may create, upload, or manage information within the
          Application, including but not limited to:
        </p>

        <ul className="list-disc ml-6 space-y-2">
          <li>Reviews</li>
          <li>Comments</li>
          <li>Customer properties</li>
          <li>Wishlists</li>
          <li>Product-related information</li>
          <li>Order-related information (where available)</li>
          <li>Other data created through the Application</li>
        </ul>

        <p className="mt-4">
          Users remain responsible for the accuracy and legality of any
          information they submit.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">5. Administrator Access</h2>

        <p>
          The Application administrator may access stored data for maintenance,
          debugging, development, security, system administration, and
          investigating technical issues.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">6. Availability</h2>

        <p>
          The Application is provided on an "as available" basis. The
          administrator may modify, suspend, or discontinue any feature or the
          entire Application at any time without prior notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">7. Account Deletion</h2>

        <p>
          Users may delete their accounts where this functionality is available
          or request deletion by contacting the administrator. Certain records
          may be retained where required for security, legal obligations, or
          operational purposes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">8. Privacy</h2>

        <p>
          Collection and processing of personal information is governed by the
          Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          9. Limitation of Liability
        </h2>

        <p>
          The Application is provided for internal use without warranties of any
          kind. The administrator shall not be liable for indirect, incidental,
          or consequential damages arising from the use of the Application.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          10. Changes to These Terms
        </h2>

        <p>
          These Terms may be updated at any time. Continued use of the
          Application after changes become effective constitutes acceptance of
          the revised Terms.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">11. Contact</h2>

        <p>Questions regarding these Terms may be directed to:</p>

        <p className="mt-2 font-medium">daniel.kopac@bloomreach.com</p>
      </section>
    </main>
  );
}

export default TermsOfServicePage;
