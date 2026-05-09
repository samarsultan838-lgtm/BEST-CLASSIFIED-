import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import DashboardPage from "./pages/Dashboard";
import AdminDashboardPage from "./pages/AdminDashboard";
import AdminNewsPage from "./pages/AdminNews";
import AdminAdsPage from "./pages/AdminAds";
import PrivacyPage from "./pages/Privacy";
import TermsPage from "./pages/Terms";
import AboutPage from "./pages/About";
import ContactPage from "./pages/ContactPage";
import AdminSecurityGate from "./components/AdminSecurityGate";

import AdminLoginPage from "./pages/AdminLogin";

function PrivateRoute({ children, role, requireAdminLogin }: { children: React.ReactNode, role?: string, requireAdminLogin?: boolean }) {
  const { profile, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!profile) {
    if (requireAdminLogin) {
      return <Navigate to="/admin/login" />;
    }
    return <Navigate to="/login" />;
  }
  
  if (role && profile.role !== role && profile.role !== 'admin') {
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
            <Route path="/dashboard/*" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<PrivateRoute role="admin" requireAdminLogin><AdminSecurityGate><AdminDashboardPage /></AdminSecurityGate></PrivateRoute>} />
            <Route path="/admin/news" element={<PrivateRoute role="admin" requireAdminLogin><AdminSecurityGate><AdminNewsPage /></AdminSecurityGate></PrivateRoute>} />
            <Route path="/admin/ads" element={<PrivateRoute role="admin" requireAdminLogin><AdminSecurityGate><AdminAdsPage /></AdminSecurityGate></PrivateRoute>} />
          </Routes>
        </AppLayout>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}
