import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setSubmitted(false);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.tel.trim()) {
      newErrors.tel = "Phone number is required.";
    } else if (!/^[0-9+\-\s]{7,15}$/.test(formData.tel)) {
      newErrors.tel = "Enter a valid phone number.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please write your message.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);
      return;
    }
    setErrors({});
    setSubmitted(true);

    // here you can send data to backend / API
    console.log("Form submitted:", formData);

    // optional: clear form
    setFormData({
      name: "",
      email: "",
      tel: "",
      message: "",
    });
  };

  return (
    <div className="relative flex items-top justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-50 sm:items-center sm:pt-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mt-4 overflow-hidden rounded-2xl shadow-lg bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* LEFT SIDE – INFO */}
            <div className="p-8 md:p-10 bg-gray-100">
              <h1 className="text-3xl sm:text-4xl text-gray-800 font-extrabold tracking-tight">
                Get in touch
              </h1>
              <p className="text-lg sm:text-xl font-medium text-gray-600 mt-3">
                Fill in the form and we’ll get back to you as soon as possible.
              </p>

              <div className="mt-8 space-y-4 text-gray-600">
                <div className="flex items-center">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-gray-500"
                  >
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="ml-4 text-md tracking-wide font-semibold">
                    Acme Inc, Street, State, Postal Code
                  </div>
                </div>

                <div className="flex items-center">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-gray-500"
                  >
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="ml-4 text-md tracking-wide font-semibold">
                    +44 1234567890
                  </div>
                </div>

                <div className="flex items-center">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-gray-500"
                  >
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="ml-4 text-md tracking-wide font-semibold">
                    info@acme.org
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE – FORM */}
            <form
              className="p-8 md:p-10 flex flex-col justify-center bg-white"
              onSubmit={handleSubmit}
            >
              {submitted && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                  ✅ Thank you! Your message has been sent.
                </div>
              )}

              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-300 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="flex flex-col mt-4">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-300 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col mt-4">
                <label
                  htmlFor="tel"
                  className="text-sm font-semibold text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="tel"
                  id="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  placeholder="Telephone Number"
                  className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-300 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                {errors.tel && (
                  <p className="mt-1 text-xs text-red-500">{errors.tel}</p>
                )}
              </div>

              <div className="flex flex-col mt-4">
                <label
                  htmlFor="message"
                  className="text-sm font-semibold text-gray-700"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="mt-2 py-3 px-3 rounded-lg bg-white border border-gray-300 text-gray-800 font-medium resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.message && (
                    <p className="text-xs text-red-500">{errors.message}</p>
                  )}
                  <p className="text-xs text-gray-400 ml-auto">
                    {formData.message.length}/500
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 inline-flex items-center justify-center md:w-40 bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition ease-in-out duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
