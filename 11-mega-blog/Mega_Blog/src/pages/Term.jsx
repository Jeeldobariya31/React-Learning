import React from "react";
import { Container } from "../components";

/**
 * =====================================================
 * TERMS OF SERVICE – BLOGZILLA
 * =====================================================
 * - Public page
 * - Legal content
 * - Clean & readable layout
 */

export default function Terms() {
  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <Container>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-blue-100 p-6 md:p-10">
          {/* HEADER */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-blue-500 mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          {/* CONTENT */}
          <section className="space-y-6 text-blue-800 leading-relaxed">
            <p>
              Welcome to <strong>Blogzilla</strong>. By accessing or using our
              platform, you agree to comply with and be bound by the following
              terms and conditions.
            </p>

            <h2 className="text-xl font-bold text-blue-900">
              1. Use of the Platform
            </h2>
            <p>
              Blogzilla allows users to create, read, edit, and delete blog
              posts. You agree to use the platform only for lawful purposes and
              in a way that does not infringe on the rights of others.
            </p>

            <h2 className="text-xl font-bold text-blue-900">
              2. User Accounts
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials. Any activity under your account is your
              responsibility.
            </p>

            <h2 className="text-xl font-bold text-blue-900">
              3. Content Ownership
            </h2>
            <p>
              You retain ownership of content you create. By posting on
              Blogzilla, you grant us permission to display and distribute your
              content within the platform.
            </p>

            <h2 className="text-xl font-bold text-blue-900">
              4. Prohibited Content
            </h2>
            <p>
              You may not post content that is illegal, abusive, hateful,
              misleading, or violates intellectual property rights.
            </p>

            <h2 className="text-xl font-bold text-blue-900">5. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              these terms without prior notice.
            </p>

            <h2 className="text-xl font-bold text-blue-900">
              6. Changes to Terms
            </h2>
            <p>
              We may update these Terms of Service at any time. Continued use of
              Blogzilla after changes indicates acceptance.
            </p>

            <h2 className="text-xl font-bold text-blue-900">7. Contact</h2>
            <p>
              If you have questions about these terms, please contact us via the
              platform.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
