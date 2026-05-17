import React, { useEffect, useState, useRef } from "react";
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
  Clock,
  Trash2,
  Lock,
  Unlock,
  PenSquare,
  ArrowUp,
  Image as ImageIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getAds, getPendingAds, getArticles, getUsers, approveAd, rejectAd, deleteAd, updateAdPriority, toggleFeaturedAd, createArticle, deleteArticle, updateUserStatus, updateAd } from "../lib/firestoreService";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
  
  const handleDeleteAd = async (id: string) => {
    if (confirm("Are you sure you want to delete this ad?")) {
       try {
         await deleteAd(id);
         toast.success("Ad deleted");
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
     try {
        await updateUserStatus(id, !isBlocked);
        toast.success(!isBlocked ? "User blocked" : "User unblocked");
        fetchData();
     } catch(error) {
        toast.error("Failed to update user status");
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
     if (confirm("Delete this article?")) {
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
                                 <th className="p-4 px-6 min-w-[250px]">Ad Info</th>
                                 <th className="p-4">Category</th>
                                 <th className="p-4">Prioritization</th>
                                 <th className="p-4">Status</th>
                                 <th className="p-4">Date</th>
                                 <th className="p-4 px-6 text-right min-w-[200px]">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {ads.map((ad) => (
                                 <tr key={ad.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 px-6">
                                       <div className="flex items-center gap-3">
                                          <img src={ad.images?.[0] || '/vite.svg'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                          <div>
                                             <p className="font-semibold text-slate-900 text-sm truncate">{ad.title}</p>
                                             <p className="text-xs text-slate-500">PKR {Number(ad.price).toLocaleString()}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-slate-700 capitalize">{ad.category}</td>
                                    <td className="p-4">
                                       <div className="flex flex-col gap-1 items-start">
                                          <button 
                                             onClick={() => handleSetPriority(ad.id, ad.priority === 'premium' ? 'normal' : 'premium')}
                                             className={`text-[10px] font-bold px-2 py-1 rounded w-full text-left flex items-center justify-between ${ad.priority === 'premium' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                          >
                                             {ad.priority === 'premium' ? 'TOP 1' : 'Standard Priority'}
                                             {ad.priority === 'premium' && <ArrowUp className="w-3 h-3" />}
                                          </button>
                                          <button 
                                             onClick={() => handleToggleFeatured(ad.id, ad.featured)}
                                             className={`text-[10px] font-bold px-2 py-1 rounded w-full text-left flex items-center justify-between ${ad.featured ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                          >
                                             {ad.featured ? 'FEATURED' : 'Standard Listing'}
                                             {ad.featured && <Star className="w-3 h-3" />}
                                          </button>
                                       </div>
                                    </td>
                                    <td className="p-4">
                                       <Badge className={`uppercase text-[10px] tracking-wider rounded-md font-bold px-2 py-0.5 border-none shadow-none ${
                                          ad.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                          ad.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                          'bg-amber-100 text-amber-700'
                                       }`}>
                                          {ad.status || 'pending'}
                                       </Badge>
                                    </td>
                                    <td className="p-4 text-xs text-slate-500 font-medium">
                                       {ad.createdAt?.toDate ? ad.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                                    </td>
                                    <td className="p-4 px-6">
                                       <div className="flex items-center justify-end gap-1">
                                          {ad.status !== 'approved' && (
                                            <Button size="icon" variant="ghost" onClick={() => handleApprove(ad.id)} title="Approve" className="w-8 h-8 rounded-full text-emerald-600 hover:bg-emerald-50">
                                               <CheckCircle className="w-4 h-4" />
                                            </Button>
                                          )}
                                          {ad.status !== 'rejected' && (
                                            <Button size="icon" variant="ghost" onClick={() => handleReject(ad.id)} title="Reject" className="w-8 h-8 rounded-full text-amber-600 hover:bg-amber-50">
                                               <XCircle className="w-4 h-4" />
                                            </Button>
                                          )}
                                          <Button size="icon" variant="ghost" onClick={() => openEditAd(ad)} title="Edit Ad" className="w-8 h-8 rounded-full text-blue-600 hover:bg-blue-50">
                                             <PenSquare className="w-4 h-4" />
                                          </Button>
                                          <Button size="icon" variant="ghost" onClick={() => handleDeleteAd(ad.id)} title="Delete Ad" className="w-8 h-8 rounded-full text-red-600 hover:bg-red-50">
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
                                 <th className="p-4">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {users.map((user) => (
                                 <tr key={user.id} className={`hover:bg-slate-50 transition-colors ${user.isBlocked ? 'opacity-50' : ''}`}>
                                    <td className="p-4 px-6">
                                       <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                             {user.name?.[0]?.toUpperCase() || 'U'}
                                          </div>
                                          <div>
                                             <p className="font-semibold text-slate-900 text-sm max-w-[200px] truncate">{user.name}</p>
                                             {user.isBlocked && <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Blocked</span>}
                                          </div>
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
                                    <td className="p-4">
                                       {user.role !== 'admin' && (
                                         <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleBlockUser(user.id, !!user.isBlocked)}
                                            className={user.isBlocked ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" : "text-red-600 hover:text-red-700 hover:bg-red-50"}
                                         >
                                            {user.isBlocked ? <><Unlock className="w-4 h-4 mr-2" /> Unblock</> : <><Lock className="w-4 h-4 mr-2" /> Block</>}
                                         </Button>
                                       )}
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
                  <div className="space-y-6">
                     <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                              <FileText className="w-6 h-6 text-emerald-500" />
                           </div>
                           <div>
                              <h3 className="text-xl font-bold text-slate-900">News & Articles Admin</h3>
                              <p className="text-slate-500 text-sm">Manage published content on your platform.</p>
                           </div>
                        </div>
                        <Button onClick={() => setIsNewArticleOpen(true)} className="font-bold bg-emerald-600 hover:bg-emerald-700 h-10 px-6 rounded-xl shadow-lg shadow-emerald-500/20">
                           + Draft New
                        </Button>
                     </div>

                     <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                           <thead>
                              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                 <th className="p-4 px-6 w-1/2">Article</th>
                                 <th className="p-4">Status</th>
                                 <th className="p-4">Published</th>
                                 <th className="p-4 text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {articles.map((article) => (
                                 <tr key={article.id} className="hover:bg-slate-50">
                                    <td className="p-4 px-6">
                                       <div className="flex items-center gap-4">
                                          <img src={article.imageUrl || '/vite.svg'} alt="" className="w-16 h-12 object-cover rounded shadow-sm" />
                                          <div>
                                             <p className="font-bold text-slate-900 text-sm line-clamp-1">{article.title}</p>
                                             <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{article.excerpt}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="p-4">
                                       <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 py-0.5 uppercase tracking-widest text-[10px] font-bold">Published</Badge>
                                    </td>
                                    <td className="p-4 text-xs font-medium text-slate-500">
                                       {article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString() : 'Unknown'}
                                    </td>
                                    <td className="p-4 text-right">
                                       <Button size="icon" variant="ghost" onClick={() => handleDeleteArticle(article.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                          <Trash2 className="w-4 h-4" />
                                       </Button>
                                    </td>
                                 </tr>
                              ))}
                              {articles.length === 0 && (
                                 <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500 font-medium text-sm">
                                       No articles published yet.
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
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

      {/* New Article Modal */}
      <Dialog open={isNewArticleOpen} onOpenChange={setIsNewArticleOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">Publish New Article</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                  <Input placeholder="Breaking Real Estate News" value={articleTitle} onChange={e => setArticleTitle(e.target.value)} className="h-12 border-slate-200 font-medium" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Excerpt / Short Description</label>
                  <Input placeholder="Short summary..." value={articleExcerpt} onChange={e => setArticleExcerpt(e.target.value)} className="h-12 border-slate-200 font-medium" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Content</label>
                  <textarea 
                     value={articleContent} 
                     onChange={e => setArticleContent(e.target.value)}
                     rows={6}
                     className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-medium text-slate-700" 
                     placeholder="Write the full article content here..."
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Cover Image Selection</label>
                  <input 
                     type="file" 
                     accept="image/*" 
                     ref={fileInputRef} 
                     onChange={handleImageFileChange} 
                     className="hidden" 
                  />
                  <div className="flex gap-4 items-center">
                     <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()} 
                        className="font-bold border-slate-200 gap-2 h-10"
                     >
                        <ImageIcon className="w-4 h-4" /> Choose Picture
                     </Button>
                     {articleImage && (
                        <div className="w-20 h-10 rounded border border-slate-200 overflow-hidden">
                           <img src={articleImage} alt="Selected Cover" className="w-full h-full object-cover" />
                        </div>
                     )}
                     {!articleImage && <span className="text-sm font-medium text-slate-400">No image selected.</span>}
                  </div>
               </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewArticleOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateArticle} className="bg-emerald-600 hover:bg-emerald-700 font-bold">Publish Article</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Ad Modal */}
      <Dialog open={isEditAdOpen} onOpenChange={setIsEditAdOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">Quick Edit Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                  <Input 
                     value={editingAd?.title || ""} 
                     onChange={e => setEditingAd({...editingAd, title: e.target.value})} 
                     className="h-12 border-slate-200 font-medium" 
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Price (PKR)</label>
                  <Input 
                     type="number"
                     value={editingAd?.price || ""} 
                     onChange={e => setEditingAd({...editingAd, price: e.target.value})} 
                     className="h-12 border-slate-200 font-medium" 
                  />
               </div>
               <p className="text-xs text-slate-400 font-medium">To edit full properties, please use the main Edit flow.</p>
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsEditAdOpen(false)}>Cancel</Button>
             <Button onClick={handleSaveEditAd} className="bg-blue-600 hover:bg-blue-700 font-bold">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
