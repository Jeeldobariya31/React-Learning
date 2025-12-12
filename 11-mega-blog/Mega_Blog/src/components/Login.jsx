import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import Popup from "./Popup";
import { useDispatch } from "react-redux";
import authService from "../appWrite/auth";
import { useForm } from "react-hook-form";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const [serverError, setServerError] = useState("");
  const [showError, setShowError] = useState(false);

  const login = async (data) => {
    setServerError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin(userData));
        navigate("/");
      }
    } catch (err) {
      const msg = err?.message || "Login failed";
      setServerError(msg);
      setShowError(true);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-blue-100 shadow-lg p-10">
        
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <Logo size={60} showText />
        </div>

        {/* Heading */}
        <h2 className="text-center text-3xl font-extrabold text-blue-900 leading-tight">
          Sign in to your account
        </h2>

        {/* Subheading */}
        <p className="mt-2 text-center text-sm text-blue-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-700 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {/* Error Popup */}
        <Popup
          title="Login failed"
          message={serverError}
          open={showError}
          onClose={() => setShowError(false)}
        />

        {/* Form */}
        <form onSubmit={handleSubmit(login)} className="mt-8" noValidate>
          <div className="space-y-6">

            {/* Email */}
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              className="py-3 text-lg"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Please enter a valid email address",
                },
              })}
              error={errors.email?.message}
            />

            {/* Password */}
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              className="py-3 text-lg"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={errors.password?.message}
            />

            {/* Server error */}
            {serverError && (
              <div className="text-sm text-red-600 px-1">{serverError}</div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3 text-lg"
              loading={isSubmitting}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>

        {/* Forgot Password */}
        
      </div>
    </div>
  );
}
