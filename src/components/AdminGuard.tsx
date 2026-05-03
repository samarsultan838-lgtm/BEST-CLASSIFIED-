import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminGuard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-950">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Allow both admins and editors to access administrative features
  if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
