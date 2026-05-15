"use client";
import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { CheckCircle2 } from "lucide-react";

export default function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("resident");
  const [success, setSuccess] = useState(false);

  const { signUpWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingRole", role);
      }
      
      // For barangay officials, set approval_pending status
      const signupData = {
        email,
        password,
        name,
        callbackUrl: "/onboarding",
        redirect: false,
      };

      if (role === "official") {
        signupData.role = "pending_official";
      }

      await signUpWithCredentials(signupData);
      
      if (role === "official") {
        setSuccess(true);
      } else {
        // Redirect residents immediately
        window.location.href = "/onboarding";
      }
    } catch (err) {
      const errorMessages = {
        CredentialsSignin:
          "An account with this email already exists. Try signing in.",
        AccessDenied: "You don't have permission to sign up.",
        Configuration:
          "Sign-up isn't working right now. Please try again later.",
      };
      setError(
        errorMessages[err?.message] ||
          "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-2xl font-black text-blue-600">A</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            AyosPH
          </h1>
          <p className="text-blue-200 mt-1 text-sm">
            Community Issue Reporting
          </p>
        </div>

        {success ? (
          // Success message for pending officials
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Account Created Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your barangay official account is pending approval from the Super Admin. 
              You will receive an email notification once your account has been verified and approved.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-700">
                <strong>Email sent to:</strong> {email}
              </p>
            </div>
            <a
              href="/account/signin"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Back to Sign In
            </a>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Create your account
            </h2>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("resident")}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    role === "resident"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">🏠</div>
                  <div className="text-sm font-semibold">Resident</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Report issues
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("official")}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    role === "official"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">🏛️</div>
                  <div className="text-sm font-semibold">Official</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Resolve issues
                  </div>
                </button>
              </div>
              {role === "official" && (
                <p className="text-xs text-amber-600 mt-3 p-2 bg-amber-50 rounded-lg">
                  ⚠️ Official accounts require approval from the Super Admin.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan dela Cruz"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <a
                href="/account/signin"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign in
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
