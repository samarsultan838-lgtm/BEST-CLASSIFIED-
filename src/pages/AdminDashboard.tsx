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
  ArrowDownRight,
  ShieldAlert,
  ChevronRight,
  Zap,
  Star,
  ShoppingBag,
  UserCircle,
  Activity,
  DollarSign,
  Server,
  Database,
  Cpu,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAds, getPendingAds, getUsers } from "../lib/firestoreService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from "date-fns";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [pendingAds, setPendingAds] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allAds = await getAds({ status: 'approved' });
      const pending = await getPendingAds();
      setAds(allAds || []);
      setPendingAds(pending || []);
      
      const premiumCount = allAds?.filter(a => a.priority === 'premium' || a.priority === 'high').length || 0;
      const featuredCount = allAds?.filter(a => a.featured).length || 0;
      const usersData = await getUsers();
      setUsers(usersData || []);

      setStats([
        { label: "Total Revenue (MTD)", value: "$64,250", trend: "+12.5%", isUp: true, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Active Users", value: usersData?.length || 0, trend: "+5.2%", isUp: true, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Active Listings", value: allAds?.length || 0, trend: "+8.1%", isUp: true, icon: ShoppingBag, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { label: "Pending Approvals", value: pending?.length || 0, trend: "-2.4%", isUp: false, icon: ShieldAlert, color: "text-orange-500", bg: "bg-orange-500/10" },
      ]);
    } catch (error) {
      console.error("Dashboard intel failure:", error);
    }
  };

  const revenueData = [
    { name: 'Mon', total: 12400 },
    { name: 'Tue', total: 21000 },
    { name: 'Wed', total: 18500 },
    { name: 'Thu', total: 24200 },
    { name: 'Fri', total: 32000 },
    { name: 'Sat', total: 41500 },
    { name: 'Sun', total: 38000 },
  ];

  const trafficData = [
    { name: 'W1', visitors: 42000 },
    { name: 'W2', visitors: 38000 },
    { name: 'W3', visitors: 55000 },
    { name: 'W4', visitors: 62000 },
    { name: 'W5', visitors: 58000 },
    { name: 'W6', visitors: 71000 },
    { name: 'W7', visitors: 84000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-2">Command Center</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs">Advanced Platform Analytics & Operations</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Badge className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-black uppercase tracking-widest border-none text-[10px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2 inline-block"></span>
            System Online
          </Badge>
          <Link to="/admin/settings" className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs h-10 px-4">
             <Settings className="w-4 h-4 mr-2" /> Settings
          </Link>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="flex flex-nowrap overflow-x-auto pb-4 gap-4 hide-scrollbar">
         <Link to="/admin/ads" className="inline-flex items-center justify-center h-14 rounded-2xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 font-bold min-w-[200px] flex-shrink-0">
            <Plus className="w-4 h-4 mr-2 text-emerald-500" /> New Ad Campaign
         </Link>
         <Link to="/admin/news" className="inline-flex items-center justify-center h-14 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 text-slate-700 font-bold min-w-[200px] flex-shrink-0">
            <FileText className="w-4 h-4 mr-2 text-blue-500" /> Publish Article
         </Link>
         <Link to="/admin/homepage" className="inline-flex items-center justify-center h-14 rounded-2xl border border-slate-200 bg-white hover:border-purple-500 hover:bg-purple-50 text-slate-700 font-bold min-w-[200px] flex-shrink-0">
            <Star className="w-4 h-4 mr-2 text-purple-500" /> Modify Homepage
         </Link>
         <Link to="/admin/reports" className="inline-flex items-center justify-center h-14 rounded-2xl border border-slate-200 bg-white hover:border-orange-500 hover:bg-orange-50 text-slate-700 font-bold min-w-[200px] flex-shrink-0">
            <ShieldAlert className="w-4 h-4 mr-2 text-orange-500" /> Review Reports
         </Link>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-200/40 rounded-[2rem] bg-white group hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${stat.isUp ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                  {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />} 
                  {stat.trend}
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{stat.value}</p>
              <h3 className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{stat.label}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 border-none shadow-xl shadow-slate-200/40 rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="p-6 md:p-8 flex flex-row items-center justify-between">
             <div>
               <CardTitle className="text-xl font-black uppercase tracking-tighter text-slate-900">Revenue Flow</CardTitle>
               <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Platform gross volume (7 Days)</CardDescription>
             </div>
             <Badge className="bg-slate-100 text-slate-600 border-none font-bold">Total: $183,400</Badge>
          </CardHeader>
          <CardContent className="px-6 md:px-8 pb-8">
             <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 700 }} dx={-10} tickFormatter={(value) => `$${value/1000}k`} />
                    <RechartsTooltip 
                       cursor={{ fill: '#f8fafc' }}
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', padding: '12px 20px' }}
                       formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="total" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-xl shadow-slate-200/40 rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="p-6 md:p-8">
             <CardTitle className="text-xl font-black uppercase tracking-tighter text-slate-900">Traffic Analysis</CardTitle>
             <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Weekly active users</CardDescription>
          </CardHeader>
          <CardContent className="px-6 md:px-8 pb-8">
             <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 700 }} dy={10} />
                    <RechartsTooltip 
                       contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                       formatter={(value: number) => [value.toLocaleString(), 'Visitors']}
                    />
                    <Area type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorVis)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Lower Section: System Health & Verifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Verification Queue Section */}
         <Card className="lg:col-span-8 border-none shadow-xl shadow-slate-200/40 rounded-[2rem] bg-white overflow-hidden">
          <CardHeader className="p-6 md:p-8 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
            <div>
               <CardTitle className="text-xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-orange-500" /> Pending Verifications
               </CardTitle>
               <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Assets requiring manual review</CardDescription>
            </div>
            <Link to="/admin/ads?filter=pending" className="inline-flex items-center justify-center text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-bold text-xs uppercase tracking-widest h-10 px-4 rounded-xl">
               Review All
            </Link>
          </CardHeader>
          <CardContent className="p-0">
             <ScrollArea className="h-[380px]">
               <div className="divide-y divide-slate-50">
                 {pendingAds.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-bold text-sm">No pending assets to verify.</div>
                 ) : (
                    pendingAds.slice(0, 5).map((ad) => (
                      <div key={ad.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                         <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 shadow-inner">
                               {ad.images?.[0] ? (
                                  <img src={ad.images[0]} alt={ad.title} className="w-full h-full object-cover" />
                               ) : null}
                            </div>
                            <div>
                               <h4 className="font-black text-slate-900 text-sm md:text-base leading-tight mb-1">{ad.title}</h4>
                               <div className="flex items-center gap-3 mt-2">
                                  <Badge className="bg-orange-50 text-orange-600 font-bold text-[9px] uppercase tracking-widest border-none">Pending Review</Badge>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ad.category}</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                            <Link to={`/admin/ads`} className="inline-flex items-center justify-center flex-1 sm:flex-none border border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-10 rounded-xl font-bold text-[10px] uppercase tracking-widest px-4">
                               Process
                            </Link>
                         </div>
                      </div>
                    ))
                 )}
               </div>
             </ScrollArea>
          </CardContent>
        </Card>

         {/* System Health Monitor */}
         <Card className="lg:col-span-4 border-none shadow-xl shadow-slate-200/40 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
            <CardHeader className="p-8 pb-4 relative z-10 border-b border-white/5">
               <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 text-white">
                  <Activity className="w-5 h-5 text-emerald-400" /> Infrastructure Health
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 relative z-10 space-y-8">
               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-400 flex-wrap">
                     <span className="flex items-center gap-2"><Cpu className="w-4 h-4" /> Server Core Load</span>
                     <span>32%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-400 w-[32%] shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] md:text-xs font-black uppercase tracking-widest text-blue-400 flex-wrap">
                     <span className="flex items-center gap-2"><Database className="w-4 h-4" /> Datastore Capacity</span>
                     <span>64%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-400 w-[64%] shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] md:text-xs font-black uppercase tracking-widest text-amber-400 flex-wrap">
                     <span className="flex items-center gap-2"><Server className="w-4 h-4" /> Node Availability</span>
                     <span>99.9%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-400 w-[99%] shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                  </div>
               </div>

               <div className="pt-6 border-t border-white/10 space-y-3">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                     <div>
                        <p className="text-xs font-bold text-slate-300">Last System Backup</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-1">2 hours ago</p>
                     </div>
                     <Button variant="ghost" className="h-8 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-bold">Trigger</Button>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>

    </div>
  );
}
