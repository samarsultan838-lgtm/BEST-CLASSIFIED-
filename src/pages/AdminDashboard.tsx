import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  ArrowUpRight,
  ShieldCheck,
  ShoppingBag,
  Zap,
  Star,
  ChevronRight,
  Users
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getAds, getPendingAds, getArticles, getUsers } from "../lib/firestoreService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeAssets: 0,
    verificationQueue: 0,
    premiumProtocols: 0,
    promotedProjects: 0
  });
  const [articles, setArticles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [pendingAds, setPendingAds] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const allAds = await getAds({ status: 'approved' });
      const pending = await getPendingAds();
      const allArticles = await getArticles();
      const allUsers = await getUsers();
      
      const premiumCount = allAds?.filter(a => a.priority === 'premium' || a.priority === 'high').length || 0;
      const featuredCount = allAds?.filter(a => a.featured).length || 0;

      setStats({
        activeAssets: allAds?.length || 0,
        verificationQueue: pending?.length || 0,
        premiumProtocols: premiumCount,
        promotedProjects: featuredCount
      });

      if (pending) {
        setPendingAds(pending.slice(0, 3));
      }
      if (allArticles) {
        setArticles(allArticles.slice(0, 3));
      }
      if (allUsers) {
        setUsers(allUsers.slice(0, 5));
      }
    } catch (error) {
      console.error("Dashboard intel failure:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header */}
      <div className="text-center pt-2 pb-6">
        <h1 className="text-[2.5rem] leading-[1] font-black uppercase tracking-tighter text-slate-900 mb-2">Com<span className="tracking-[-0.1em]">m</span>and Center</h1>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">
          Secure Administrative Environment | Logged as Admin
        </p>

        <div className="flex items-center justify-center gap-3">
          <div className="bg-[#023B27] px-4 py-2 rounded-full inline-flex items-center">
            <span className="text-[#00D084] text-[11px] font-bold uppercase tracking-widest">System Online</span>
          </div>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg shadow-slate-200/50 text-slate-400 hover:text-slate-600 border border-slate-100 transition-all">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="space-y-4 px-4 mb-12">
        {/* ACTIVE ASSETS */}
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden">
          <div className="flex justify-between items-start mb-12">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex items-center text-[#00D084] font-bold text-sm tracking-wide">
              <ArrowUpRight className="w-4 h-4 mr-1" /> 12%
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Assets</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{stats.activeAssets}</h2>
          </div>
        </div>

        {/* VERIFICATION QUEUE */}
        <Link to="/admin/ads" className="block bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95">
          <div className="flex justify-between items-start mb-12">
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex items-center text-[#00D084] font-bold text-sm tracking-wide">
              <ArrowUpRight className="w-4 h-4 mr-1" /> 12%
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Verification Queue</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{stats.verificationQueue}</h2>
          </div>
        </Link>

        {/* PREMIUM PROTOCOLS */}
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden">
          <div className="flex justify-between items-start mb-12">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-center text-[#00D084] font-bold text-sm tracking-wide">
              <ArrowUpRight className="w-4 h-4 mr-1" /> 12%
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Premium Protocols</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{stats.premiumProtocols}</h2>
          </div>
        </div>

        {/* PROMOTED PROJECTS */}
        <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden">
          <div className="flex justify-between items-start mb-12">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex items-center text-[#00D084] font-bold text-sm tracking-wide">
              <ArrowUpRight className="w-4 h-4 mr-1" /> 12%
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Promoted Projects</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{stats.promotedProjects}</h2>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-slate-100 rounded-t-[3rem] px-6 pt-10 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-t border-slate-50 relative z-30 w-full overflow-hidden mt-[-2rem]">
          <div className="flex flex-row justify-between items-end mb-8">
            <h3 className="text-[1.65rem] font-black uppercase tracking-tighter text-slate-900 leading-tight w-2/3">Verification Queue</h3>
            <Link to="/admin/ads" className="text-[10px] font-black uppercase tracking-[0.1em] text-[#00D084] hover:text-emerald-500 pb-1 text-right whitespace-nowrap">
              Review All<br/>Assets →
            </Link>
          </div>
          
          <div className="space-y-4">
            {pendingAds.length > 0 ? pendingAds.map((ad: any, i) => (
              <Link to="/admin/ads" key={i} className="bg-white rounded-3xl p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-all border border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 shadow-inner">
                  {ad.images && ad.images.length > 0 ? (
                    <img src={ad.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200"></div>
                  )}
                </div>
                <div className="flex-1 pr-2">
                  <h4 className="font-black text-slate-900 text-base leading-tight mb-1 truncate">{ad.title}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] truncate">
                    {ad.userName || 'Unknown'} • {ad.category}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </Link>
            )) : (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-100">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-bold text-slate-400">Queue completely clear</p>
              </div>
            )}
          </div>
      </div>

      {/* Intelligence Management */}
      <div className="bg-white rounded-t-[3rem] px-6 pt-10 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-t border-slate-50 relative z-20 w-full overflow-hidden mt-[-2rem]">
          <div className="flex flex-row justify-between items-end mb-8">
            <h3 className="text-[1.65rem] font-black uppercase tracking-tighter text-slate-900 leading-tight w-2/3">Intelligence Management</h3>
            <Link to="/admin/news" className="text-[10px] font-black uppercase tracking-[0.1em] text-[#00D084] hover:text-emerald-500 pb-1 text-right whitespace-nowrap">
              Manage All<br/>Articles →
            </Link>
          </div>
          
          <div className="space-y-4">
            {articles.length > 0 ? articles.map((article: any, i) => (
              <div key={i} className="bg-slate-50 rounded-3xl p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-100 transition-all border border-slate-100">
                <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden shrink-0 shadow-inner">
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#023B27] opacity-20"></div>
                  )}
                </div>
                <div className="flex-1 pr-2">
                  <h4 className="font-black text-slate-900 text-base leading-tight mb-1">{article.title}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                    Published {article.createdAt?.toDate ? formatDistanceToNow(article.createdAt.toDate()) : 'recently'} ago by Admin
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
            )) : (
              // Empty State / Skeleton
              <div className="bg-slate-50 rounded-3xl p-4 flex items-center gap-4 border border-slate-100">
                <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-2 bg-slate-200 rounded-md w-1/2 animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
      </div>

      {/* Network Members */}
      <div className="bg-slate-100 min-h-[300px] w-full mt-[-2rem] pt-14 pb-12 px-6 rounded-t-[3rem] text-slate-900 relative z-10 border-t border-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          <div className="flex flex-row justify-between items-end mb-8">
            <h3 className="text-[1.65rem] font-black uppercase tracking-tighter text-slate-900 leading-tight w-2/3">Network Members</h3>
            <Link to="/admin/users" className="text-[10px] font-black uppercase tracking-[0.1em] text-[#00D084] hover:text-emerald-500 pb-1 text-right whitespace-nowrap">
              Manage All<br/>Members →
            </Link>
          </div>

          <div className="space-y-4">
            {users.length > 0 ? users.map((user: any, i) => (
              <div key={i} className="bg-white rounded-3xl p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-all border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <span className="text-emerald-600 font-black uppercase">{user.name ? user.name.substring(0, 2) : 'U'}</span>
                </div>
                <div className="flex-1 pr-2">
                  <h4 className="font-black text-slate-900 text-sm leading-tight mb-0.5">{user.name || 'Anonymous User'}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] truncate">
                    {user.email || 'No email provided'}
                  </p>
                </div>
                <div className="bg-[#023B27] px-3 py-1 rounded-full shrink-0">
                  <span className="text-[#00D084] text-[9px] font-bold uppercase tracking-widest">{user.role || 'User'}</span>
                </div>
              </div>
            )) : (
              // Empty State
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-100">
                <p className="text-sm font-bold text-slate-400">No users found</p>
              </div>
            )}
          </div>
      </div>

      {/* System Health Module */}
      <div className="bg-[#042f1f] min-h-[300px] w-full mt-[-2rem] pt-14 pb-12 px-6 rounded-t-[3rem] text-white relative z-0">
         <div className="flex items-center gap-3 mb-10">
            <ShieldCheck className="w-6 h-6 text-[#00D084]" />
            <h3 className="text-xl font-black uppercase tracking-tighter text-white">System Health</h3>
         </div>

         <div className="space-y-8">
            <div className="space-y-3">
               <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.1em] text-[#00D084]">
                  <span>Server Load</span>
                  <span>24%</span>
               </div>
               <div className="h-3 bg-[#032014] rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-[#00D084] w-[24%] rounded-full shadow-[0_0_10px_rgba(0,208,132,0.5)]"></div>
               </div>
            </div>

            <div className="space-y-3">
               <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.1em] text-[#00D084]">
                  <span>Database Sync</span>
                  <span>Stable</span>
               </div>
               <div className="h-3 bg-[#032014] rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-[#00D084] w-full rounded-full shadow-[0_0_10px_rgba(0,208,132,0.5)]"></div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}

