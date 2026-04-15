"use client";

import { useEffect, useState } from "react";

export default function GoogleCallbackPage() {
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Fixed: Token is now stored in HTTP-only cookie by backend
        // We only need to get user data from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get("user");
        const error = urlParams.get("error");

        console.log("Google callback received:", { user, error });

        // Check for error from backend
        if (error) {
          console.error("Google login error:", error);
          setStatus("error");
          return;
        }

        if (user) {
          const userData = JSON.parse(decodeURIComponent(user));
          console.log("Saving user data:", userData);
          
          // Save user to localStorage
          localStorage.setItem("user", JSON.stringify(userData));
          
          // Also save a dummy token to indicate user is logged in
          // The real token is in HTTP-only cookie, but we need something in localStorage
          // for the useUserRole hook to detect the user is logged in
          localStorage.setItem("access_token", "google-oauth-session");
          
          // Small delay to ensure localStorage is written before redirect
          setTimeout(() => {
            // Redirect based on role
            if (userData.role === "admin") {
              console.log("Redirecting to admin");
              window.location.href = "/admin/admin-overview";
            } else {
              console.log("Redirecting to feeds");
              window.location.href = "/feeds";
            }
          }, 100);
        } else {
          console.error("No user data received");
          setStatus("error");
        }
      } catch (error) {
        console.error("Error handling Google callback:", error);
        setStatus("error");
      }
    };

    handleCallback();
  }, []);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-input)]">
        <div className="bg-[var(--color-bg-card-solid)] p-8 rounded-3xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Login Failed</h2>
          <p className="text-[var(--color-text-secondary)] mb-4">
            There was an error logging in with Google.
          </p>
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="bg-[#3647dc] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#2739d0] transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-input)]">
      <div className="bg-[var(--color-bg-card-solid)] p-8 rounded-3xl shadow-xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3647dc] mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
          Logging in with Google...
        </h2>
        <p className="text-[var(--color-text-secondary)]">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
}
