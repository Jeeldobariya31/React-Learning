import React from "react";

export default function About() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <div className="space-y-10 md:space-y-0 md:flex md:gap-10 lg:items-center lg:gap-14">
          {/* Image */}
          <div className="md:w-5/12 lg:w-5/12">
            <img
              src="data:image/jpeg;base64,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"
              alt="Developer working on a React project"
              className="w-full h-auto rounded-xl shadow-lg"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="md:w-7/12 lg:w-7/12">
            <p className="text-sm font-semibold tracking-wide text-orange-600 uppercase">
              About JD&apos;s React Space
            </p>

            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Building clean, modern interfaces with React & Tailwind CSS
            </h2>

            <p className="mt-6 text-base md:text-lg text-gray-600">
              Hi, I&apos;m{" "}
              <span className="font-semibold text-gray-900">JD</span>, a
              frontend developer who loves turning ideas into interactive user
              interfaces. I focus on building fast, responsive, and accessible
              web applications using{" "}
              <span className="font-semibold">
                React, Vite, and Tailwind CSS
              </span>
              .
            </p>

            <p className="mt-4 text-base md:text-lg text-gray-600">
              From small UI components to complete single-page applications, I
              enjoy writing clean code, reusable components, and learning new
              tools every day. This project is a collection of practice pages
              like routing, layouts, forms, and animations to sharpen my skills.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Main Stack
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  React · Vite · Tailwind
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Focus
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  UI/UX · Reusable Components
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Current Goal
                </p>
                <p className="mt-1 font-semibold text-gray-900">
                  Mastering React Router & advanced patterns
                </p>
              </div>
            </div>

            <button className="mt-8 inline-flex items-center rounded-lg bg-orange-700 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition">
              View My Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
