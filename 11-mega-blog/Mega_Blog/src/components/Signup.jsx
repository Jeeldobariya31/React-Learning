import React, { useState } from "react";
import authService from "../appWrite/auth";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import Popup from "./Popup";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

export default function Signup() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [showError, setShowError] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const create = async (data) => {
    setServerError("");
    try {
      // create account (assumes authService.createAccount returns session or success flag)
      await authService.createAccount(data);

      // fetch current user and update redux
      const userData = await authService.getCurrentUser();
      if (userData) dispatch(login(userData));

      // navigate home
      navigate("/");
    } catch (err) {
      const msg = err?.message || "Signup failed";
      setServerError(msg);
      setShowError(true);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center ">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-blue-100 shadow-md p-8">
        <div className="mb-4 flex justify-center">
          <span className="inline-block">
            <Logo size={36} />
          </span>
        </div>

        <h2 className="text-center text-2xl font-extrabold text-blue-900 leading-tight">
          Create your account
        </h2>

        <p className="mt-2 text-center text-sm text-blue-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-700 hover:underline">
            Sign In
          </Link>
        </p>

        <Popup
          title="Signup failed"
          message={serverError}
          open={showError}
          onClose={() => setShowError(false)}
        />

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
                  value:
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
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

            <Button type="submit" className="w-full" loading={isSubmitting} aria-disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create Account"}
            </Button>
          </div>
        </form>

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
