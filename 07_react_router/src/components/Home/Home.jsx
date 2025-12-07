import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden text-black rounded-lg sm:mx-16 mx-2 sm:py-20 py-12">
        <div className="relative z-10 max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            {/* Text */}
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                Hello, I&apos;m Jeel Dobariya
              </p>

              <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight text-gray-900">
                Frontend Developer & React Learner
              </h1>

              <p className="text-gray-600 text-base sm:text-lg max-w-xl">
                I build clean, responsive web interfaces using{" "}
                <span className="font-semibold">
                  React, Vite, and Tailwind CSS
                </span>
                . This site is my practice playground for routing, layouts,
                forms, and modern UI components.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center px-6 py-3 rounded-lg text-white font-medium bg-orange-700 hover:bg-orange-600 transition"
                >
                  View About Page
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-800 hover:bg-gray-50 transition"
                >
                  Contact Me
                </Link>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 text-sm text-gray-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Learning React every day
                </span>
                <span>·</span>
                <span>Building components, routing & UI layouts</span>
              </div>
            </div>

            {/* Illustration */}
            <div className="relative flex justify-center lg:justify-end">
              <img
                className="w-72 sm:w-96 drop-shadow-2xl"
                src="data:image/jpeg;base64,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"
                alt="Developer working remotely"
              />
            </div>
          </div>
        </div>

        {/* subtle background blob */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange-100 blur-3xl opacity-60" />
      </section>

      {/* SECOND IMAGE / FEATURE SECTION */}
      <section className="grid place-items-center sm:mt-16 mt-10 sm:mx-16 mx-2">
        <div className="flex flex-col items-center gap-6">
          <img
            className="sm:w-80 w-40"
            src="data:image/jpeg;base64,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"
            
            alt="Code and productivity illustration"
          />
          <p className="max-w-2xl text-center text-gray-600 text-sm sm:text-base">
            I focus on writing reusable React components, clean file structure,
            and Tailwind-based styling. This project includes pages like Home,
            About, Contact, Privacy Policy, and Terms &amp; Conditions to
            practice real-world app structure.
          </p>
        </div>
      </section>

      {/* HIGHLIGHTS / SKILLS */}
      <section className="sm:mt-16 mt-10 sm:mx-16 mx-2 pb-16">
        <h2 className="text-center text-2xl sm:text-4xl font-semibold text-gray-900 mb-8">
          What I&apos;m Practicing
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              React &amp; Routing
            </h3>
            <p className="text-sm text-gray-600">
              Building pages with{" "}
              <span className="font-medium">React Router</span> – layouts,
              nested routes, and navigation (Home, About, Contact, Privacy,
              Terms).
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tailwind UI
            </h3>
            <p className="text-sm text-gray-600">
              Creating responsive layouts, reusable components, and modern
              designs using Tailwind utility classes.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Real Project Structure
            </h3>
            <p className="text-sm text-gray-600">
              Organizing files into components, using layouts with header &
              footer, and preparing for larger React projects.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
