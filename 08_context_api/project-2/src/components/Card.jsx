import React from "react";

export default function Card() {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="px-5 py-6">
        {/* Name */}
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Jeel Dobariya
        </h5>

        {/* Role / About */}
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          B.Tech CSE Student • React & TypeScript Learner • Building cool
          projects like car pooling web apps, login UIs, quizzes and more.
        </p>

        {/* Skills / Chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
            React
          </span>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
            TypeScript
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-purple-200 dark:text-purple-900">
            Node.js
          </span>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900">
            Tailwind CSS
          </span>
        </div>

        {/* Bottom section */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            “Learning daily. Shipping projects. Breaking and fixing things.”
          </span>
          <a
            href="https://github.com/jeeldobariya31"
            target="_blank"
            rel="noreferrer"
            className="ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
                       focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
                       text-sm px-5 py-2.5 text-center dark:bg-blue-600 
                       dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            View GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
