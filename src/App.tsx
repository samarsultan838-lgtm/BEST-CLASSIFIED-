import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import { Toaster } from "@/components/ui/sonner";

// Pages
import HomePage from "./pages/Home";
import SearchPage from "./pages/Search";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import AdDetailPage from "./pages/AdDetail";
import PostAdPage from "./pages/PostAd";
import NewsPage from "./pages/News";
import ArticlePage from "./pages/Article";
import PrivacyPage from "./pages/Privacy";
import TermsPage from "./pages/Terms";
import AboutPage from "./pages/About";
import ContactPage from "./pages/ContactPage";

import AdminDashboard from "./pages/admin/AdminDashboard";

function PrivateRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const { profile, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!profile) {
    return <Navigate to="/login" />;
  }
  
  if (role && profile.role !== role) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/ad/:id/:slug" element={<AdDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<ArticlePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* User Routes */}
            <Route path="/post-ad" element={<PrivateRoute><PostAdPage /></PrivateRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/*" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />

          </Routes>
        </AppLayout>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}
