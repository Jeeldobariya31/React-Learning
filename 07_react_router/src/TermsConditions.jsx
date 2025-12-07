import React from "react";

export default function TermsConditions() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-700">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p className="mb-4">
          By accessing and using{" "}
          <span className="font-semibold">JD&apos;s Website</span>, you agree to
          the following terms and conditions. This site is primarily built for
          learning and portfolio purposes.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          1. Use of Website
        </h2>
        <p className="mb-3">
          You agree to use this website only for lawful purposes and in a way
          that does not infringe the rights of others or restrict their use and
          enjoyment of the site.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          2. No Warranty
        </h2>
        <p className="mb-3">
          This website is provided on an &quot;as is&quot; basis. While efforts
          are made to keep the content accurate and up to date, no guarantees
          are made regarding completeness or reliability.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          3. Portfolio &amp; Practice Project
        </h2>
        <p className="mb-3">
          The website is mainly used for frontend practice (React, Tailwind,
          routing, components, etc.). Features may change, break, or be removed
          at any time as part of learning.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          4. Limitation of Liability
        </h2>
        <p className="mb-3">
          We are not liable for any loss or damage arising from your use of this
          site, including bugs, downtime, or broken features.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
          5. Changes to These Terms
        </h2>
        <p className="mb-3">
          Terms &amp; Conditions may be updated from time to time. Continued use
          of the site after changes means you accept the updated terms.
        </p>
      </div>
    </div>
  );
}
