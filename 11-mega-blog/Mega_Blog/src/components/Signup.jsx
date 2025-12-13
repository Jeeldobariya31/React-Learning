import React, { useState } from "react";
import authService from "../appWrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import Popup from "./Popup";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

// 📧 EmailJS util
import { sendSignupEmail } from "../utils/email";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [serverError, setServerError] = useState("");
  const [showError, setShowError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  /* ===================================================
     CREATE ACCOUNT HANDLER
     =================================================== */
  const create = async (data) => {
    setServerError("");

    try {
      /* ===========================
         1️⃣ CREATE ACCOUNT (APPWRITE)
         =========================== */
      await authService.createAccount(data);

      /* ===========================
         2️⃣ FETCH USER + REDUX LOGIN
         =========================== */
      const userData = await authService.getCurrentUser();
      if (userData) dispatch(login(userData));

      /* ===========================
         3️⃣ SEND WELCOME EMAIL
         (NON-BLOCKING)
         =========================== */
      sendSignupEmail({
        name: data.name,
        email: data.email,
      }).catch(() => {
        // ❗ Email failure should NOT break signup
        console.warn("⚠️ Welcome email failed");
      });

      /* ===========================
         4️⃣ REDIRECT TO HOME
         =========================== */
      navigate("/");
    } catch (err) {
      const msg = err?.message || "Signup failed";
      setServerError(msg);
      setShowError(true);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-blue-100 shadow-md p-8">
        {/* LOGO */}
        <div className="mb-4 flex justify-center">
          <Logo size={36} />
        </div>

        <h2 className="text-center text-2xl font-extrabold text-blue-900">
          Create your account
        </h2>

        <p className="mt-2 text-center text-sm text-blue-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-700 hover:underline"
          >
            Sign In
          </Link>
        </p>

        {/* ERROR POPUP */}
        <Popup
          title="Signup failed"
          message={serverError}
          open={showError}
          onClose={() => setShowError(false)}
        />

        {/* FORM */}
        <form onSubmit={handleSubmit(create)} className="mt-8" noValidate>
          <div className="space-y-5">
            <Input
              label="Full name"
              placeholder="Enter your full name"
              {...register("name", { required: "Full name is required" })}
              error={errors.name?.message}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Please enter a valid email address",
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              placeholder="Create a password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              className="w-full"
              loading={isSubmitting}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? "Creating…" : "Create Account"}
            </Button>
          </div>
        </form>

        {/* TERMS */}
        <div className="mt-6 text-center text-sm text-blue-500">
          By creating an account you agree to our{" "}
          <Link to="/terms" className="underline hover:text-blue-700">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-blue-700">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
