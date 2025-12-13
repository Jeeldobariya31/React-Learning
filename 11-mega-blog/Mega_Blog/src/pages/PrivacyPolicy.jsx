import React from "react";
import { Container } from "../components";

/**
 * =====================================================
 * PRIVACY POLICY – BLOGZILLA
 * =====================================================
 * - Public page
 * - Explains data usage clearly
 * - User-friendly language
 */

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-blue-100 p-6 md:p-10">
          {/* HEADER */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-blue-500 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          {/* CONTENT */}
          <section className="space-y-6 text-blue-800 leading-relaxed">
            <p>
              At <strong>Blogzilla</strong>, your privacy is important to us.
              This Privacy Policy explains how we collect, use, and protect your
              information.
            </p>

            <h2 className="text-xl font-bold text-blue-900">
              1. Information We Collect
            </h2>
            <p>
              We may collect personal information such as your name, email
              address, and content you create when you register or use our
              services.
            </p>

            <h2 className="text-xl font-bold text-blue-900">
              2. How We Use Information
            </h2>
            <p>
              Your information is used to:
              <ul className="list-disc ml-6 mt-2">
                <li>Provide and improve our services</li>
                <li>Authenticate users</li>
                <li>Display authorship of posts</li>
                <li>Ensure platform security</li>
              </ul>
            </p>

            <h2 className="text-xl font-bold text-blue-900">
              3. Data Storage & Security
            </h2>
            <p>
              We use Appwrite to securely store data. Reasonable security
              measures are applied, but no system is 100% secure.
            </p>

            <h2 className="text-xl font-bold text-blue-900">
              4. Sharing of Information
            </h2>
            <p>
              We do not sell or rent your personal information. Your content may
              be publicly visible depending on your posts.
            </p>

            <h2 className="text-xl font-bold text-blue-900">5. Cookies</h2>
            <p>
              We may use cookies or local storage to maintain sessions and
              improve user experience.
            </p>

            <h2 className="text-xl font-bold text-blue-900">6. Your Rights</h2>
            <p>
              You may update or delete your content and account at any time
              through the platform.
            </p>

            <h2 className="text-xl font-bold text-blue-900">
              7. Changes to Policy
            </h2>
            <p>
              This policy may be updated periodically. Continued use of
              Blogzilla means acceptance of the changes.
            </p>

            <h2 className="text-xl font-bold text-blue-900">8. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              through Blogzilla.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
