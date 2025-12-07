import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-700">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="mb-4">
          This Privacy Policy explains how{" "}
          <span className="font-semibold">JD&apos;s Website</span> collects,
          uses, and protects your information when you use this site.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          1. Information We Collect
        </h2>
        <p className="mb-3">
          This is a demo / practice project, so we currently do not actively
          collect personal data through forms, except what you intentionally
          provide (like name, email, or message in the contact form).
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside space-y-1 mb-3">
          <li>To respond to your messages or queries.</li>
          <li>To improve the design and functionality of this website.</li>
          <li>To learn and practice frontend development concepts.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          3. Cookies & Analytics
        </h2>
        <p className="mb-3">
          This project does not use advanced tracking or analytics tools in
          production, but basic browser logs or dev tools may be used locally
          during development.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          4. Third-Party Links
        </h2>
        <p className="mb-3">
          This site may contain links to external websites (like GitHub). We are
          not responsible for the privacy practices of those websites.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          5. Contact
        </h2>
        <p>
          If you have any questions about this Privacy Policy, you can reach out
          via the contact page.
        </p>
      </div>
    </div>
  );
}
