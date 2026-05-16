import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Tags, 
  FileText, 
  CreditCard, 
  AlertTriangle, 
  Star, 
  Bell, 
  Settings, 
  LogOut,
  ShieldCheck,
  LayoutTemplate,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const links = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Ads", path: "/admin/ads", icon: ShoppingBag },
    { name: "Categories", path: "/admin/categories", icon: Tags },
    { name: "News & Articles", path: "/admin/news", icon: FileText },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Reports", path: "/admin/reports", icon: AlertTriangle },
    { name: "Homepage Control", path: "/admin/homepage", icon: LayoutTemplate },
    { name: "Notifications", path: "/admin/notifications", icon: Bell },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 group">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-lg font-black text-white tracking-widest uppercase">TRAZOT Admin</span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 overflow-y-auto custom-scrollbar">
           <div className="px-6 mb-6">
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Logged as</p>
              <div className="flex items-center gap-3">
                 <div className="flex-1">
                    <p className="text-sm font-bold text-white leading-none mb-1">{profile?.name || "Administrator"}</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{profile?.role}</p>
                 </div>
              </div>
           </div>

          <nav className="space-y-1 px-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                  isActive(link.path)
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <Button 
            variant="ghost" 
            className="w-full text-slate-400 hover:text-white hover:bg-slate-800 font-bold text-sm justify-start"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-slate-50 flex flex-col min-h-screen relative">
         <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:hidden sticky top-0 z-50 shadow-sm">
            <Link to="/" className="flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-emerald-500" />
               <span className="text-sm font-black text-slate-900 tracking-widest uppercase">TRAZOT Admin</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-slate-900">
               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
         </div>

         {/* Mobile Menu Dropdown */}
         {mobileMenuOpen && (
           <div className="md:hidden fixed inset-0 top-16 bg-slate-900 text-slate-300 z-40 overflow-y-auto">
              <div className="p-6">
                 <div className="mb-6">
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">Logged as</p>
                    <p className="text-sm font-bold text-white leading-none mb-1">{profile?.name || "Administrator"}</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{profile?.role}</p>
                 </div>
                 <nav className="space-y-1">
                  {links.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-bold transition-all ${
                        isActive(link.path)
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 pt-4 border-t border-slate-800">
                  <Button 
                    variant="ghost" 
                    className="w-full text-slate-400 hover:text-white hover:bg-slate-800 font-bold text-sm justify-start py-6"
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-5 h-5 mr-3" /> Logout
                  </Button>
                </div>
              </div>
           </div>
         )}
         
         <div className="p-4 md:p-8 flex-1 max-w-7xl mx-auto w-full">
            {children}
         </div>
      </main>
    </div>
  );
}
