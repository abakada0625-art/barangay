"use client";
import { useState, useEffect, useCallback } from "react";
import useUser from "@/utils/useUser";

export default function OnboardingPage() {
  const { data: user, loading } = useUser();
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState("resident");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pendingRole = localStorage.getItem("pendingRole");
      if (pendingRole) setRole(pendingRole);
    }
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("pendingRole");
        }
        setDone(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }, [role]);

  useEffect(() => {
    if (!loading && user) {
      handleSave();
    }
  }, [loading, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
          <span className="text-2xl font-black text-blue-600">A</span>
        </div>
        <h1 className="text-2xl font-black">AyosPH</h1>
        {done ? (
          <p className="text-blue-200 mt-2">✅ Account ready! Redirecting...</p>
        ) : (
          <p className="text-blue-200 mt-2">Setting up your account...</p>
        )}
      </div>
    </div>
  );
}
