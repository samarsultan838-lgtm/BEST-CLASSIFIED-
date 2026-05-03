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
import AdminDashboardPage from "./pages/admin/AdminDashboard";

function PrivateRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const { profile, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!profile) return <Navigate to="/login" />;
  if (role && profile.role !== role && profile.role !== 'admin') return <Navigate to="/" />;
  
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
            
            {/* User Routes */}
            <Route path="/post-ad" element={<PrivateRoute><PostAdPage /></PrivateRoute>} />
            <Route path="/dashboard/*" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/*" element={<PrivateRoute role="admin"><AdminDashboardPage /></PrivateRoute>} />
          </Routes>
        </AppLayout>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}
