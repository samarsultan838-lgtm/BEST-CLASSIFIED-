import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, ShoppingBag, Settings } from "lucide-react";

export function AdminNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const links = [
    { name: "Overview & Analytics", path: "/admin", icon: LayoutDashboard },
    { name: "Manage Ads", path: "/admin/ads", icon: ShoppingBag },
    { name: "News & Articles", path: "/admin/news", icon: FileText },
    { name: "Settings & SEO", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex bg-white rounded-2xl shadow-sm p-2 gap-2 mb-8 overflow-x-auto overflow-y-hidden border border-slate-100">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
            isActive(link.path)
              ? "bg-emerald-500 text-emerald-950 shadow-xl shadow-emerald-500/20"
              : "text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
          }`}
        >
          <link.icon className="w-4 h-4" />
          {link.name}
        </Link>
      ))}
    </div>
  );
}
