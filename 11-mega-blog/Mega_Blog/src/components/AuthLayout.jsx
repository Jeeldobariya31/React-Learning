import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for authStatus to resolve (true / false)
    if (authStatus === null || authStatus === undefined) return;

    // If route requires authentication but user is NOT authenticated
    if (authentication && authStatus === false) {
      navigate("/login");
    }

    // If route is guest-only (authentication=false) and user IS authenticated
    if (!authentication && authStatus === true) {
      navigate("/");
    }

    setLoading(false);
  }, [authStatus, authentication, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="animate-spin h-10 w-10 border-4 border-blue-300 border-t-blue-700 rounded-full"></div>
      </div>
    );
  }

  return <>{children}</>;
}
