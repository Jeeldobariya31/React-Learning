import React from "react";
import { Signup as SignupComponent } from "../components";

// Blue & White themed Signup page
export default function Signup() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <SignupComponent />
    </div>
  );
}
