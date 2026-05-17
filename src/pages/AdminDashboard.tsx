import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Bell, 
  ArrowUpRight,
  ShieldCheck,
  ShoppingBag,
  Zap,
  Star,
  ChevronRight,
  Users,
  LayoutDashboard,
  FileText,
  Settings,
  Search,
  CheckCircle,
  XCircle,
  LogOut,
  MapPin,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getAds, getPendingAds, getArticles, getUsers, approveAd, rejectAd } from "../lib/firestoreService";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type TabList = "overview" | "ads" | "users" | "news" | "settings";

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabList>("overview");
  
  const [stats, setStats] = useState({
    activeAssets: 0,
    verificationQueue: 0,
    premiumProtocols: 0,
    promotedProjects: 0
  });
  
  const [ads, setAds] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [pendingAds, setPendingAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const allAds = await getAds();
      const approvedAds = allAds?.filter(a => a.status === 'approved') || [];
      const pending = allAds?.filter(a => a.status !== 'approved') || [];
      const allArticles = await getArticles();
      const allUsers = await getUsers();
      
      const premiumCount = approvedAds.filter(a => a.priority === 'premium' || a.priority === 'high').length;
      const featuredCount = approvedAds.filter(a => a.featured).length;

      setStats({
        activeAssets: approvedAds.length,
        verificationQueue: pending.length,
        premiumProtocols: premiumCount,
        promotedProjects: featuredCount
      });

      setAds(allAds || []);
      setPendingAds(pending);
      setArticles(allArticles || []);
      setUsers(allUsers || []);
    } catch (error) {
      console.error("Dashboard intel failure:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveAd(id, profile?.id || 'admin');
      toast.success("Ad approved successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to approve ad");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectAd(id, "Rejected by admin from dashboard");
      toast.success("Ad rejected");
      fetchData();
    } catch (error) {
      toast.error("Failed to reject ad");
    }
  };

  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "ads", label: "Listings & Ads", icon: ShoppingBag, count: pendingAds.length },
    { id: "users", label: "Users", icon: Users },
    { id: "news", label: "News & Article", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-white shrink-0 md:min-h-[calc(100vh-64px)] flex flex-col">
         <div className="p-6 md:p-8 flex items-center gap-3 border-b border-white/5">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
               <ShieldCheck className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
               <h1 className="font-bold text-lg tracking-tight leading-none">Admin Panel</h1>
               <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Trazot Control</span>
            </div>
         </div>
         
         <div className="flex-1 py-6 px-4 space-y-2 overflow-x-auto md:overflow-hidden flex gap-2 md:flex-col custom-scrollbar">
            {navItems.map((item) => (
               <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabList)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold whitespace-nowrap md:whitespace-normal w-full text-left ${
                     activeTab === item.id 
                     ? "bg-emerald-500 text-slate-950 shadow-md" 
                     : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
               >
                  <item.icon className="w-5 h-5 shrink-0" /> 
                  <span className="flex-1">{item.label}</span>
                  {item.count ? (
                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === item.id ? "bg-emerald-950 text-emerald-400" : "bg-orange-500 text-white"}`}>
                        {item.count}
                     </span>
                  ) : null}
               </button>
            ))}
         </div>
         
         <div className="p-4 border-t border-white/5 hidden md:block">
            <button onClick={signOut} className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 transition-colors font-semibold rounded-2xl hover:bg-white/5">
               <LogOut className="w-5 h-5" /> Logout
            </button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
         
         {/* Top Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-2">
            <div>
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">
                 {activeTab.replace('-', ' ')}
               </h2>
               <p className="text-slate-500 text-sm">Welcome back, {profile?.name || 'Administrator'}</p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative max-w-sm w-full md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input placeholder="Search everything..." className="pl-9 bg-white border-none shadow-sm rounded-full h-10" />
               </div>
               <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-600 hover:text-emerald-600 shrink-0 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
            </div>
         </div>

         {loading ? (
            <div className="flex items-center justify-center p-20">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
         ) : (
            <div className="animate-in fade-in duration-500">
               {/* OVERVIEW TAB */}
               {activeTab === "overview" && (
                  <div className="space-y-6">
                     {/* Metrics Grid */}
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-center items-start">
                           <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                              <ShoppingBag className="w-6 h-6" />
                           </div>
                           <h4 className="text-3xl font-black text-slate-900">{stats.activeAssets}</h4>
                           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Active Ads</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-center items-start">
                           <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-4">
                              <ShieldCheck className="w-6 h-6" />
                           </div>
                           <h4 className="text-3xl font-black text-slate-900">{stats.verificationQueue}</h4>
                           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">In Queue</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-center items-start">
                           <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                              <Users className="w-6 h-6" />
                           </div>
                           <h4 className="text-3xl font-black text-slate-900">{users.length}</h4>
                           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Users</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-center items-start">
                           <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4">
                              <FileText className="w-6 h-6" />
                           </div>
                           <h4 className="text-3xl font-black text-slate-900">{articles.length}</h4>
                           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Articles</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Pending Approvals Widget */}
                        <div className="lg:col-span-2 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                           <div className="flex items-center justify-between mb-6">
                              <h3 className="font-bold text-lg text-slate-900">Recent Pending Ads</h3>
                              <Button variant="ghost" size="sm" onClick={() => setActiveTab('ads')} className="text-emerald-600">View All</Button>
                           </div>
                           <div className="space-y-4">
                              {pendingAds.slice(0, 4).map((ad) => (
                                 <div key={ad.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                                    <img src={ad.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeabb'} alt={ad.title} className="w-16 h-16 rounded-xl object-cover" />
                                    <div className="flex-1 min-w-0">
                                       <h4 className="font-bold text-slate-900 truncate">{ad.title}</h4>
                                       <p className="text-sm text-slate-500 truncate">{ad.category} • PKR {Number(ad.price).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <Button size="icon" variant="outline" onClick={() => handleApprove(ad.id)} className="w-8 h-8 rounded-full border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300">
                                          <CheckCircle className="w-4 h-4" />
                                       </Button>
                                       <Button size="icon" variant="outline" onClick={() => handleReject(ad.id)} className="w-8 h-8 rounded-full border-red-200 text-red-600 bg-red-50 hover:bg-red-100 hover:border-red-300">
                                          <XCircle className="w-4 h-4" />
                                       </Button>
                                    </div>
                                 </div>
                              ))}
                              {pendingAds.length === 0 && (
                                 <div className="text-center p-8 bg-slate-50 rounded-2xl">
                                    <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-slate-500 font-medium text-sm">No ads pending approval</p>
                                 </div>
                              )}
                           </div>
                        </div>

                        <div className="space-y-6">
                           {/* Recent Users Widget */}
                           <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                              <h3 className="font-bold text-lg text-slate-900 mb-6">New Members</h3>
                              <div className="space-y-4">
                                 {users.slice(0, 5).map(user => (
                                    <div key={user.id} className="flex items-center gap-3">
                                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-600">
                                          {user.name?.[0]?.toUpperCase() || 'U'}
                                       </div>
                                       <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-sm text-slate-900 truncate">{user.name}</p>
                                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* ADS TAB */}
               {activeTab === "ads" && (
                  <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                     <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-900">All Listings ({ads.length})</h3>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                 <th className="p-4 px-6">Ad Info</th>
                                 <th className="p-4">Category</th>
                                 <th className="p-4">Price</th>
                                 <th className="p-4">Status</th>
                                 <th className="p-4">Date</th>
                                 <th className="p-4 px-6 text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {ads.map((ad) => (
                                 <tr key={ad.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 px-6">
                                       <div className="flex items-center gap-3">
                                          <img src={ad.images?.[0] || '/vite.svg'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                          <div>
                                             <p className="font-semibold text-slate-900 text-sm max-w-[200px] truncate">{ad.title}</p>
                                             <p className="text-xs text-slate-500">{ad.userName}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-slate-700 capitalize">{ad.category}</td>
                                    <td className="p-4 text-sm font-semibold text-slate-900">PKR {Number(ad.price).toLocaleString()}</td>
                                    <td className="p-4">
                                       <Badge className={`uppercase text-[10px] tracking-wider rounded-md font-bold px-2 py-0.5 border-none shadow-none ${
                                          ad.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                          ad.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                          'bg-orange-100 text-orange-700'
                                       }`}>
                                          {ad.status || 'pending'}
                                       </Badge>
                                    </td>
                                    <td className="p-4 text-xs text-slate-500 font-medium">
                                       {ad.createdAt?.toDate ? ad.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                                    </td>
                                    <td className="p-4 px-6">
                                       <div className="flex items-center justify-end gap-2">
                                          <Button size="icon" variant="ghost" onClick={() => handleApprove(ad.id)} className="w-8 h-8 rounded-full text-emerald-600 hover:bg-emerald-50">
                                             <CheckCircle className="w-4 h-4" />
                                          </Button>
                                          <Button size="icon" variant="ghost" onClick={() => handleReject(ad.id)} className="w-8 h-8 rounded-full text-red-600 hover:bg-red-50">
                                             <XCircle className="w-4 h-4" />
                                          </Button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {/* USERS TAB */}
               {activeTab === "users" && (
                  <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                     <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-slate-900">Registered Users ({users.length})</h3>
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                 <th className="p-4 px-6">User</th>
                                 <th className="p-4">Email</th>
                                 <th className="p-4">Role</th>
                                 <th className="p-4">Joined Date</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {users.map((user) => (
                                 <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 px-6">
                                       <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                             {user.name?.[0]?.toUpperCase() || 'U'}
                                          </div>
                                          <p className="font-semibold text-slate-900 text-sm max-w-[200px] truncate">{user.name}</p>
                                       </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">{user.email}</td>
                                    <td className="p-4">
                                       <Badge variant={user.role === 'admin' ? "default" : "outline"} className="capitalize font-medium text-xs">
                                          {user.role || 'user'}
                                       </Badge>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500 font-medium">
                                       {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {/* NEWS TAB */}
               {activeTab === "news" && (
                  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 text-center">
                     <div className="max-w-md mx-auto py-12">
                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl mx-auto flex items-center justify-center mb-6">
                           <FileText className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">News & Articles Admin</h3>
                        <p className="text-slate-500 mb-8">Manage published content on your platform.</p>
                        <Button className="font-bold bg-emerald-600 hover:bg-emerald-700 h-12 px-8 rounded-xl shadow-lg shadow-emerald-500/20">
                           Draft New Article
                        </Button>
                     </div>
                  </div>
               )}

               {/* SETTINGS TAB */}
               {activeTab === "settings" && (
                  <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                     <h3 className="text-2xl font-bold text-slate-900 mb-6">Platform Settings</h3>
                     <div className="max-w-xl space-y-6">
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Platform Name</label>
                           <Input defaultValue="TRAZOT" className="h-12 bg-slate-50 border-slate-200" />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Admin Email Notifications</label>
                           <Input defaultValue="admin@trazot.com" className="h-12 bg-slate-50 border-slate-200" />
                        </div>
                        <Button className="font-bold bg-slate-900 hover:bg-slate-800 h-12 px-8 rounded-xl">
                           Save Settings
                        </Button>
                     </div>
                  </div>
               )}

            </div>
         )}
      </div>
    </div>
  );
}
