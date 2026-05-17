import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { 
  Bell, ShieldCheck, ShoppingBag, Users, LayoutDashboard, FileText, Settings, Search, CheckCircle, XCircle, LogOut, Trash2, Lock, Unlock, PenSquare, ArrowUp, Image as ImageIcon, CreditCard, Flag, Activity, Key, Globe, DollarSign, BarChart3, AlertTriangle, MessageSquare, ChevronRight
} from "lucide-react";
import { getAds, getPendingAds, getArticles, getUsers, approveAd, rejectAd, deleteAd, updateAdPriority, toggleFeaturedAd, createArticle, deleteArticle, updateUserStatus, updateAd } from "../../lib/firestoreService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type TabList = "overview" | "users" | "ads" | "news" | "categories" | "payments" | "reports" | "notifications" | "analytics" | "roles" | "security" | "settings";

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabList>("overview");
  
  const [stats, setStats] = useState({
    activeAssets: 0,
    verificationQueue: 0,
    premiumProtocols: 0,
    promotedProjects: 0,
    revenue: 124500, // mock
    dailyVisitors: 342, // mock
  });
  
  const [ads, setAds] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [pendingAds, setPendingAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Article State
  const [isNewArticleOpen, setIsNewArticleOpen] = useState(false);
  const [articleTitle, setArticleTitle] = useState("");
  const [articleExcerpt, setArticleExcerpt] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleImage, setArticleImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Ad State
  const [isEditAdOpen, setIsEditAdOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const allAds = await getAds() || [];
      const approvedAds = allAds.filter(a => a.status === 'approved') || [];
      const pending = allAds.filter(a => a.status !== 'approved') || [];
      const allArticles = await getArticles() || [];
      const allUsers = await getUsers() || [];
      
      const premiumCount = approvedAds.filter(a => a.priority === 'premium' || a.priority === 'high').length;
      const featuredCount = approvedAds.filter(a => a.featured).length;

      setStats(prev => ({
        ...prev,
        activeAssets: approvedAds.length,
        verificationQueue: pending.length,
        premiumProtocols: premiumCount,
        promotedProjects: featuredCount
      }));

      setAds(allAds);
      setPendingAds(pending);
      setArticles(allArticles);
      setUsers(allUsers);
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
      await rejectAd(id, "Rejected by admin against policy");
      toast.success("Ad rejected");
      fetchData();
    } catch (error) {
      toast.error("Failed to reject ad");
    }
  };
  
  const handleDeleteAd = async (id: string) => {
    if (confirm("Are you sure you want to delete this ad completely?")) {
       try {
         await deleteAd(id);
         toast.success("Ad deleted permanently");
         fetchData();
       } catch (error) {
         toast.error("Failed to delete ad");
       }
    }
  };

  const handleSetPriority = async (id: string, priority: 'premium' | 'normal') => {
     try {
        await updateAdPriority(id, priority);
        toast.success(`Priority updated to ${priority}`);
        fetchData();
     } catch (error) {
        toast.error("Failed to update priority");
     }
  };

  const handleToggleFeatured = async (id: string, currentlyFeatured: boolean) => {
     try {
        await toggleFeaturedAd(id, !currentlyFeatured);
        toast.success(currentlyFeatured ? "Removed from featured" : "Marked as featured");
        fetchData();
     } catch(error) {
        toast.error("Failed to update featured status");
     }
  };

  const openEditAd = (ad: any) => {
     setEditingAd(ad);
     setIsEditAdOpen(true);
  };

  const handleSaveEditAd = async () => {
     if (!editingAd) return;
     try {
       await updateAd(editingAd.id, {
          title: editingAd.title,
          price: editingAd.price,
       });
       toast.success("Ad updated successfully");
       setIsEditAdOpen(false);
       setEditingAd(null);
       fetchData();
     } catch (error) {
        toast.error("Failed to update ad");
     }
  };

  const handleBlockUser = async (id: string, isBlocked: boolean) => {
     if (confirm(isBlocked ? "Unblock this user?" : "Suspend this user account?")) {
         try {
            await updateUserStatus(id, !isBlocked);
            toast.success(!isBlocked ? "User account suspended" : "User access restored");
            fetchData();
         } catch(error) {
            toast.error("Failed to update user status");
         }
     }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
           setArticleImage(reader.result as string);
        };
        reader.readAsDataURL(file);
     }
  };

  const handleCreateArticle = async () => {
     if (!articleTitle || !articleContent) {
        toast.error("Title and content are required");
        return;
     }

     try {
        const slug = articleTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        await createArticle({
           title: articleTitle,
           excerpt: articleExcerpt,
           content: articleContent,
           imageUrl: articleImage || "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1",
           slug,
           status: "published"
        });
        toast.success("Article created successfully");
        setIsNewArticleOpen(false);
        setArticleTitle("");
        setArticleExcerpt("");
        setArticleContent("");
        setArticleImage("");
        fetchData();
     } catch (error) {
        toast.error("Failed to create article");
     }
  };

  const handleDeleteArticle = async (id: string) => {
     if (confirm("Delete this article permanently?")) {
        try {
           await deleteArticle(id);
           toast.success("Article deleted");
           fetchData();
        } catch(error) {
           toast.error("Failed to delete article");
        }
     }
  }

  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users },
    { id: "ads", label: "Ads Management", icon: ShoppingBag, count: pendingAds.length },
    { id: "news", label: "News & Articles", icon: FileText },
    { id: "categories", label: "Categories", icon: LayoutDashboard },
    { id: "payments", label: "Payments & Revenue", icon: CreditCard },
    { id: "reports", label: "Reports & Moderation", icon: Flag },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "roles", label: "Roles & Permissions", icon: ShieldCheck },
    { id: "security", label: "Security", icon: Key },
    { id: "settings", label: "Platform Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-white shrink-0 md:min-h-[calc(100vh)] flex flex-col">
         <div className="p-6 md:p-8 flex items-center gap-3 border-b border-white/5">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
               <ShieldCheck className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
               <h1 className="font-bold text-lg tracking-tight leading-none">TRAZOT Admin</h1>
               <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  System Online
               </span>
            </div>
         </div>
         
         <div className="flex-1 py-6 px-4 space-y-1 overflow-x-auto md:overflow-y-auto flex gap-2 md:flex-col custom-scrollbar">
            {navItems.map((item) => (
               <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabList)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-semibold whitespace-nowrap md:whitespace-normal w-full text-left text-sm ${
                     activeTab === item.id 
                     ? "bg-emerald-500 text-emerald-950 shadow-md" 
                     : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
               >
                  <item.icon className={`w-4 h-4 shrink-0 col-span-1 ${activeTab === item.id ? 'text-emerald-950' : 'text-slate-500'}`} /> 
                  <span className="flex-1">{item.label}</span>
                  {item.count ? (
                     <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${activeTab === item.id ? "bg-emerald-950 text-emerald-400" : "bg-orange-500 text-white"}`}>
                        {item.count}
                     </span>
                  ) : null}
               </button>
            ))}
         </div>
         
         <div className="p-4 border-t border-white/5 hidden md:block">
            <button onClick={() => { signOut(); navigate('/'); }} className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 transition-colors font-semibold rounded-xl hover:bg-white/5 text-sm">
               <LogOut className="w-4 h-4" /> End Session
            </button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full h-[100vh]">
         {loading ? (
            <div className="flex items-center justify-center h-full">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
         ) : (
            <div className="animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
               
               {/* OVERVIEW TAB */}
               {activeTab === "overview" && (
                  <div className="space-y-6">
                     <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
                     
                     {/* Metrics Grid */}
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100">
                           <div className="flex items-center justify-between mb-4">
                              <Users className="w-5 h-5 text-blue-500" />
                              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">+12%</span>
                           </div>
                           <h4 className="text-3xl font-black text-slate-900">{users.length}</h4>
                           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Total Users</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100">
                           <div className="flex items-center justify-between mb-4">
                              <ShoppingBag className="w-5 h-5 text-purple-500" />
                              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">+8%</span>
                           </div>
                           <h4 className="text-3xl font-black text-slate-900">{stats.activeAssets}</h4>
                           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Active Ads</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100">
                           <div className="flex items-center justify-between mb-4">
                              <ShieldCheck className="w-5 h-5 text-orange-500" />
                              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">Action Req.</span>
                           </div>
                           <h4 className="text-3xl font-black text-slate-900">{stats.verificationQueue}</h4>
                           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Pending Ads</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100">
                           <div className="flex items-center justify-between mb-4">
                              <DollarSign className="w-5 h-5 text-emerald-500" />
                              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">+24%</span>
                           </div>
                           <h4 className="text-3xl font-black text-slate-900">${stats.revenue.toLocaleString()}</h4>
                           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Revenue</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100">
                           <h3 className="font-bold text-lg text-slate-900 mb-6">Recent Activities</h3>
                           <div className="space-y-4">
                              {/* Pseudo activity feed */}
                              <div className="flex items-start gap-4">
                                 <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                    <Users className="w-4 h-4 text-blue-500" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-semibold text-slate-800">New user registration <span className="text-blue-600">@mike_w</span></p>
                                    <p className="text-xs text-slate-400">10 minutes ago</p>
                                 </div>
                              </div>
                              <div className="flex items-start gap-4">
                                 <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                    <ShoppingBag className="w-4 h-4 text-emerald-500" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-semibold text-slate-800">New Ad posted: "iPhone 15 Pro Max"</p>
                                    <p className="text-xs text-slate-400">45 minutes ago</p>
                                 </div>
                              </div>
                              <div className="flex items-start gap-4">
                                 <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                                    <Flag className="w-4 h-4 text-orange-500" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-semibold text-slate-800">User <span className="text-red-500">@scammer99</span> flagged for abuse</p>
                                    <p className="text-xs text-slate-400">2 hours ago</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between">
                           <div>
                              <h3 className="font-bold text-lg text-slate-900 mb-2">Daily Visitors</h3>
                              <p className="text-sm text-slate-500">Live active tracking across all regions</p>
                           </div>
                           <div className="py-10 text-center">
                              <h4 className="text-6xl font-black text-slate-900">{stats.dailyVisitors}</h4>
                              <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs mt-2 flex items-center justify-center gap-1">
                                 <Activity className="w-3 h-3" /> Live Now
                              </p>
                           </div>
                           <Button variant="outline" onClick={() => setActiveTab('analytics')} className="w-full">View Full Report</Button>
                        </div>
                     </div>
                  </div>
               )}

               {/* USERS TAB */}
               {activeTab === "users" && (
                  <div className="space-y-6">
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h2>
                        <div className="relative w-64">
                           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                           <Input placeholder="Search users by name or email..." className="pl-9 h-10 border-slate-200" />
                        </div>
                     </div>
                     
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                 <th className="p-4 px-6">User Identity</th>
                                 <th className="p-4">Contact</th>
                                 <th className="p-4">Authorization</th>
                                 <th className="p-4">Verification</th>
                                 <th className="p-4 w-[150px]">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {users.map((user) => (
                                 <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${user.isBlocked ? 'opacity-60 bg-slate-50' : ''}`}>
                                    <td className="p-4 px-6">
                                       <div className="flex items-center gap-3">
                                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.isBlocked ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                             {user.name?.[0]?.toUpperCase() || 'U'}
                                          </div>
                                          <div>
                                             <p className="font-semibold text-slate-900 text-sm max-w-[200px] truncate">{user.name}</p>
                                             {user.isBlocked && <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest leading-none">Suspended</span>}
                                          </div>
                                       </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">{user.email}</td>
                                    <td className="p-4">
                                       <Badge variant={user.role === 'admin' ? "default" : "outline"} className="capitalize font-medium text-xs">
                                          {user.role || 'user'}
                                       </Badge>
                                    </td>
                                    <td className="p-4">
                                       {user.role === 'verified_seller' ? (
                                         <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Verified</Badge>
                                       ) : (
                                         <span className="text-xs text-slate-400 font-medium">Standard</span>
                                       )}
                                    </td>
                                    <td className="p-4">
                                       <div className="flex items-center gap-2">
                                          {user.role !== 'admin' && (
                                            <Button 
                                               variant="outline" 
                                               size="sm" 
                                               onClick={() => handleBlockUser(user.id, !!user.isBlocked)}
                                               className={`border-slate-200 h-8 px-2 text-xs font-bold ${user.isBlocked ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" : "text-red-600 hover:text-red-700 hover:bg-red-50"}`}
                                            >
                                               {user.isBlocked ? <Unlock className="w-3.5 h-3.5 mr-1.5" /> : <Lock className="w-3.5 h-3.5 mr-1.5" />}
                                               {user.isBlocked ? "Unban" : "Ban"}
                                            </Button>
                                          )}
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {/* ADS TAB */}
               {activeTab === "ads" && (
                  <div className="space-y-6">
                     <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Ads Management & Moderation</h2>
                        <div className="flex gap-2">
                           <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer pointer-events-none">Pending: {pendingAds.length}</Badge>
                           <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer pointer-events-none">Active: {stats.activeAssets}</Badge>
                        </div>
                     </div>
                     
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                           <table className="w-full text-left border-collapse">
                              <thead>
                                 <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                    <th className="p-4 px-6 min-w-[250px]">Ad Payload</th>
                                    <th className="p-4">Placement / Priority</th>
                                    <th className="p-4">Status Gate</th>
                                    <th className="p-4 px-6 text-right min-w-[200px]">Control Actions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                 {ads.map((ad) => (
                                    <tr key={ad.id} className="hover:bg-slate-50 transition-colors">
                                       <td className="p-4 px-6">
                                          <div className="flex items-start gap-4">
                                             <img src={ad.images?.[0] || '/vite.svg'} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-sm border border-slate-100" />
                                             <div className="min-w-0">
                                                <Link to={`/ad/${ad.id}/${ad.title.toLowerCase().replace(/\s+/g,'-')}`} className="font-bold text-slate-900 text-sm hover:text-emerald-600 transition-colors truncate block">{ad.title}</Link>
                                                <p className="text-xs font-semibold text-slate-800 mt-0.5">Rs {Number(ad.price).toLocaleString()}</p>
                                                <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">{ad.category} • By {ad.userName}</p>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="p-4">
                                          <div className="flex flex-col gap-1 items-start">
                                             <button 
                                                onClick={() => handleSetPriority(ad.id, ad.priority === 'premium' ? 'normal' : 'premium')}
                                                className={`text-[10px] font-bold px-2 py-1 rounded w-full text-left flex items-center justify-between border ${ad.priority === 'premium' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                             >
                                                {ad.priority === 'premium' ? 'Top Placement' : 'Standard Placement'}
                                                {ad.priority === 'premium' && <ArrowUp className="w-3 h-3" />}
                                             </button>
                                             <button 
                                                onClick={() => handleToggleFeatured(ad.id, ad.featured)}
                                                className={`text-[10px] font-bold px-2 py-1 rounded w-full text-left flex items-center justify-between border ${ad.featured ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                             >
                                                {ad.featured ? 'Homepage Pinned' : 'Standard Listing'}
                                                {ad.featured && <CheckCircle className="w-3 h-3" />}
                                             </button>
                                          </div>
                                       </td>
                                       <td className="p-4">
                                          <Badge className={`uppercase text-[10px] tracking-widest rounded-md font-bold px-2.5 py-1 border-none shadow-none ${
                                             ad.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                             ad.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                             'bg-amber-100 text-amber-700 animate-pulse'
                                          }`}>
                                             {ad.status || 'pending'}
                                          </Badge>
                                       </td>
                                       <td className="p-4 px-6">
                                          <div className="flex items-center justify-end gap-1.5">
                                             {ad.status !== 'approved' && (
                                               <Button size="sm" variant="outline" onClick={() => handleApprove(ad.id)} title="Approve" className="h-8 rounded-lg border-emerald-200 text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5">
                                                  Approve
                                               </Button>
                                             )}
                                             {ad.status !== 'rejected' && ad.status !== 'approved' && (
                                               <Button size="icon" variant="outline" onClick={() => handleReject(ad.id)} title="Reject" className="h-8 w-8 rounded-lg border-amber-200 text-amber-600 bg-amber-50 hover:bg-amber-100 shrink-0">
                                                  <XCircle className="w-4 h-4" />
                                               </Button>
                                             )}
                                             <Button size="icon" variant="outline" onClick={() => openEditAd(ad)} title="Edit Listing Metadata" className="h-8 w-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100 shrink-0">
                                                <PenSquare className="w-4 h-4" />
                                             </Button>
                                             <Button size="icon" variant="outline" onClick={() => handleDeleteAd(ad.id)} title="Permanently Delete Listing" className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:bg-red-50 bg-white shrink-0">
                                                <Trash2 className="w-4 h-4" />
                                             </Button>
                                          </div>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               )}

               {/* NEWS TAB */}
               {activeTab === "news" && (
                  <div className="space-y-6">
                     <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-xl text-white">
                        <div className="relative z-10 max-w-xl">
                           <h3 className="text-2xl font-black mb-3">News & Editorial Engine</h3>
                           <p className="text-slate-400 text-sm mb-6 max-w-sm">Publish real estate insights, platform updates, and marketplace news directly to the community.</p>
                           <Button onClick={() => setIsNewArticleOpen(true)} className="font-black tracking-widest uppercase text-xs bg-emerald-500 hover:bg-emerald-400 text-emerald-950 h-12 px-8 rounded-xl">
                              + Author New Article
                           </Button>
                        </div>
                        <FileText className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5" />
                     </div>

                     <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                 <th className="p-4 px-6 w-2/3">Published Article</th>
                                 <th className="p-4">Distribution status</th>
                                 <th className="p-4 text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {articles.map((article) => (
                                 <tr key={article.id} className="hover:bg-slate-50">
                                    <td className="p-4 px-6">
                                       <div className="flex items-start gap-4">
                                          <img src={article.imageUrl || '/vite.svg'} alt="" className="w-24 h-16 object-cover rounded-xl shadow-sm border border-slate-100" />
                                          <div className="max-w-md">
                                             <p className="font-bold text-slate-900 text-base leading-tight mb-1">{article.title}</p>
                                             <p className="text-xs text-slate-500 line-clamp-2">{article.excerpt}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="p-4">
                                       <div className="flex flex-col items-start gap-1">
                                          <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 py-0.5 uppercase tracking-widest text-[10px] font-bold">Live Grid</Badge>
                                          <span className="text-[10px] text-slate-400 font-bold uppercase">{article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString() : 'Unknown'}</span>
                                       </div>
                                    </td>
                                    <td className="p-4 text-right">
                                       <Button size="sm" variant="outline" onClick={() => handleDeleteArticle(article.id)} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-8 text-xs font-bold px-3">
                                          <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Retract
                                       </Button>
                                    </td>
                                 </tr>
                              ))}
                              {articles.length === 0 && (
                                 <tr>
                                    <td colSpan={3} className="p-12 text-center text-slate-500">
                                       <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                                       <p className="font-bold text-sm">Editorial calendar is empty</p>
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>
               )}

               {/* PLACEHOLDER TABS FOR OTHER FEATURES */}
               {["categories", "payments", "reports", "notifications", "analytics", "roles", "security", "settings"].includes(activeTab) && (
                  <div className="space-y-6 animate-in fade-in">
                     <h2 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">
                        {activeTab.replace('-', ' ')} <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Beta Module</Badge>
                     </h2>
                     
                     <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 text-center max-w-2xl mx-auto mt-12">
                        <div className="w-20 h-20 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center mb-6">
                           <Settings className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Module Under Construction</h3>
                        <p className="text-slate-500 text-sm mb-6">
                           The <strong>{activeTab}</strong> management interface is currently being deployed in the staging environment. Full rollout expected in the next major patch.
                        </p>
                        <Button variant="outline" onClick={() => setActiveTab('overview')} className="font-bold">
                           Return to Dashboard Overview
                        </Button>
                     </div>
                  </div>
               )}

            </div>
         )}
      </div>

      {/* New Article Modal */}
      <Dialog open={isNewArticleOpen} onOpenChange={setIsNewArticleOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight text-white">Author Editorial Content</h2>
          </div>
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto bg-slate-50">
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Headline</label>
                  <Input placeholder="Market hits 10-year high..." value={articleTitle} onChange={e => setArticleTitle(e.target.value)} className="h-14 bg-white border-slate-200 font-bold text-lg rounded-xl" />
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Excerpt (SEO Meta)</label>
                  <Input placeholder="Short summary for distribution cards..." value={articleExcerpt} onChange={e => setArticleExcerpt(e.target.value)} className="h-12 bg-white border-slate-200 font-medium rounded-xl" />
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Full Body Markdown</label>
                  <textarea 
                     value={articleContent} 
                     onChange={e => setArticleContent(e.target.value)}
                     rows={8}
                     className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-medium text-slate-700" 
                     placeholder="Write the full editorial here..."
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Cover Asset</label>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageFileChange} className="hidden" />
                  
                  <div 
                     onClick={() => fileInputRef.current?.click()}
                     className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${articleImage ? 'border-emerald-500 bg-emerald-50 p-1' : 'border-slate-300 bg-white hover:bg-slate-50'}`}
                  >
                     {articleImage ? (
                        <img src={articleImage} alt="Cover Preview" className="w-full h-full object-cover rounded-lg" />
                     ) : (
                        <>
                           <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                           <span className="text-sm font-bold text-slate-500">Click to upload featured image</span>
                        </>
                     )}
                  </div>
               </div>
          </div>
          <div className="bg-white p-4 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsNewArticleOpen(false)} className="rounded-xl font-bold border-slate-200 text-slate-600">Cancel</Button>
            <Button onClick={handleCreateArticle} className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black tracking-widest uppercase text-xs px-8">Publish to Grid</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Ad Modal */}
      <Dialog open={isEditAdOpen} onOpenChange={setIsEditAdOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl p-6 border-none shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Quick Edit Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Asset Title</label>
                  <Input 
                     value={editingAd?.title || ""} 
                     onChange={e => setEditingAd({...editingAd, title: e.target.value})} 
                     className="h-12 border-slate-200 font-bold bg-slate-50" 
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Valuation (PKR)</label>
                  <Input 
                     type="number"
                     value={editingAd?.price || ""} 
                     onChange={e => setEditingAd({...editingAd, price: e.target.value})} 
                     className="h-12 border-slate-200 font-bold bg-slate-50" 
                  />
               </div>
               <div className="bg-orange-50 rounded-xl p-3 flex items-start gap-2 border border-orange-100">
                  <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-orange-800 leading-snug">Moderator Warning: Modifying user listings directly should only be done for policy compliance.</p>
               </div>
          </div>
          <DialogFooter className="mt-8 gap-2">
             <Button variant="outline" onClick={() => setIsEditAdOpen(false)} className="rounded-xl font-bold">Abort</Button>
             <Button onClick={handleSaveEditAd} className="bg-blue-600 hover:bg-blue-700 font-bold rounded-xl text-white">Commit Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
