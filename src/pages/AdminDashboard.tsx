import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { 
  Users, 
  Tag, 
  FileText, 
  Settings, 
  BarChart3, 
  Bell, 
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Zap,
  Star,
  ShoppingBag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAds, getPendingAds } from "../lib/firestoreService";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const allAds = await getAds({ status: 'approved' });
      const pending = await getPendingAds();
      const premiumCount = allAds?.filter(a => a.priority === 'premium' || a.priority === 'high').length || 0;
      const featuredCount = allAds?.filter(a => a.featured).length || 0;

      setStats([
        { label: "Active Assets", value: allAds?.length || 0, icon: ShoppingBag, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Verification Queue", value: pending?.length || 0, icon: ShieldAlert, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Premium Protocols", value: premiumCount, icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Promoted Projects", value: featuredCount, icon: Star, color: "text-purple-500", bg: "bg-purple-500/10" },
      ]);
    } catch (error) {
      console.error("Dashboard intel failure:", error);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-4">Command Center</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Secure Administrative Environment | Logged as {profile?.role}</p>
        </div>
        <div className="flex gap-4">
          <Badge className="bg-emerald-950 text-emerald-500 px-6 py-2 rounded-xl font-black uppercase tracking-widest border-none shadow-lg">
            System Online
          </Badge>
          <div className="bg-white p-3 rounded-xl shadow-lg text-slate-400">
            <Bell className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => stat.label.includes('Ads') && window.location.assign('/admin/ads')}>
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-emerald-500 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                  <ArrowUpRight className="w-3 h-3" /> 12%
                </div>
              </div>
              <h3 className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1">{stat.label}</h3>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* News & Articles Control */}
        <Card className="lg:col-span-8 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
          <CardHeader className="p-10 pb-0">
             <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center justify-between">
                Intelligence Management
                <Link to="/admin/news" className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] hover:underline">Manage All Articles →</Link>
             </CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-4">
             {[1, 2, 3].map((item) => (
               <div key={item} className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 hover:bg-emerald-50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-white rounded-xl shadow-sm overflow-hidden flex-shrink-0">
                        <img src={`https://picsum.photos/seed/${item}/200`} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-slate-900 transition-colors group-hover:text-emerald-600">Global Market Trends Q2 2025</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Published 2h ago by Admin</p>
                     </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
               </div>
             ))}
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="lg:col-span-4 border-none shadow-2xl rounded-[3rem] bg-emerald-950 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px]"></div>
           <CardHeader className="p-10 relative z-10">
              <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                 <ShieldAlert className="w-6 h-6 text-emerald-500" />
                 System Health
              </CardTitle>
           </CardHeader>
           <CardContent className="p-10 pt-0 relative z-10 space-y-8">
              <div className="space-y-4">
                 <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-emerald-500/50">
                    <span>Server Load</span>
                    <span>24%</span>
                 </div>
                 <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-1/4"></div>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-emerald-500/50">
                    <span>Database Sync</span>
                    <span>Stable</span>
                 </div>
                 <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[95%]"></div>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                 <Button className="w-full h-16 bg-white/5 hover:bg-white/10 text-emerald-500 font-black uppercase tracking-widest rounded-2xl border-none">
                    Security Audit
                 </Button>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

const Button = ({ children, className, ...props }: any) => (
  <button className={`flex items-center justify-center transition-all ${className}`} {...props}>
    {children}
  </button>
);
