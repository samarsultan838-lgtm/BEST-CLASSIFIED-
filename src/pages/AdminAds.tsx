import React, { useState, useEffect } from "react";
import { 
  getAds, 
  updateAdPriority, 
  toggleFeaturedAd, 
  approveAd, 
  rejectAd,
  setAdRanking,
  deleteAd
} from "../lib/firestoreService";
import { useAuth } from "../context/AuthContext";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  Star, 
  MoreVertical, 
  CheckCircle2, 
  XCircle,
  Eye,
  Trash2,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { AdminNav } from "../components/admin/AdminNav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminAds() {
  const { profile } = useAuth();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const data = await getAds();
      setAds(data || []);
    } catch (error) {
      toast.error("Failed to fetch inventory reports");
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = async (adId: string, priority: string) => {
    try {
      await updateAdPriority(adId, priority as any);
      toast.success(`Priority updated to ${priority}`);
      fetchAds();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleToggleFeatured = async (adId: string, current: boolean) => {
    try {
      await toggleFeaturedAd(adId, !current);
      toast.success(current ? "Unfeatured" : "Promoted to Featured");
      fetchAds();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleStatusChange = async (adId: string, status: string) => {
    try {
      if (status === 'approved') {
        await approveAd(adId, profile?.uid || "system");
        toast.success("Ad Authorization Granted");
      } else {
        await rejectAd(adId, "Administrative policy violation");
        toast.error("Ad Authorization Denied");
      }
      fetchAds();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleRankingChange = async (adId: string, weight: number) => {
    try {
      await setAdRanking(adId, weight);
      toast.success(`Ranking Weight updated to ${weight}`);
      fetchAds();
    } catch (error) {
      toast.error("Ranking update failed");
    }
  };

  const handleDelete = async (adId: string) => {
    if (confirm("Confirm Deletion of Asset?")) {
      try {
        await deleteAd(adId);
        toast.success("Asset Terminated");
        fetchAds();
      } catch (error) {
        toast.error("Deletion Failed");
      }
    }
  };

  const filteredAds = ads.filter(ad => {
    if (filter === "all") return true;
    if (filter === "premium") return ad.priority === "premium" || ad.priority === "high";
    if (filter === "pending") return ad.status === "pending";
    if (filter === "featured") return ad.featured === true;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Inventory Audit</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Assets Registered: {ads.length}</p>
        </div>
      </div>
      
      <AdminNav />

      <div className="flex justify-between items-center bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex gap-2">
           {[ 
             { id: 'all', label: 'All Intel' },
             { id: 'pending', label: 'Verification Pending' },
             { id: 'premium', label: 'High Priority' },
             { id: 'featured', label: 'Promoted' }
           ].map((item) => (
             <Button
               key={item.id}
               variant={filter === item.id ? "default" : "outline"}
               className={`rounded-xl h-10 px-4 font-black uppercase tracking-widest text-[9px] shadow-sm transition-all ${filter === item.id ? 'bg-emerald-500 text-emerald-950 border-none' : 'border-slate-100 bg-white text-slate-400 hover:border-emerald-500 hover:text-emerald-500'}`}
               onClick={() => setFilter(item.id)}
             >
               {item.label}
             </Button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-50">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Asset Identity</th>
                     <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Merchant Info</th>
                     <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Protocol Level</th>
                     <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Authorization</th>
                     <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={5} className="p-20 text-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                  ) : filteredAds.map((ad) => (
                    <tr key={ad.id} className="group hover:bg-emerald-50/30 transition-colors">
                       <td className="p-8">
                          <div className="flex items-center gap-4">
                             <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shadow-inner border-2 border-white flex-shrink-0">
                                <img src={ad.images?.[0] || "https://picsum.photos/seed/ad/200"} className="w-full h-full object-cover" alt="" />
                             </div>
                             <div>
                                <h4 className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{ad.title}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{ad.category} • {format(ad.createdAt?.toDate ? ad.createdAt.toDate() : new Date(), "MMM dd, yyyy")}</p>
                             </div>
                          </div>
                       </td>
                       <td className="p-8">
                          <div>
                             <p className="font-black text-slate-700 text-sm">{ad.userName || "Merchant UNK"}</p>
                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{ad.location?.split(',')[0]}</p>
                          </div>
                       </td>
                       <td className="p-8 text-center">
                          <div className="flex flex-col items-center gap-2">
                             <Badge className={`${ad.priority === 'premium' || ad.priority === 'high' ? 'bg-emerald-500 text-emerald-950' : 'bg-slate-100 text-slate-400'} border-none font-black text-[9px] uppercase tracking-widest px-4 py-1 rounded-full`}>
                                {ad.priority === 'premium' || ad.priority === 'high' ? 'Premium Protocol' : 'Standard'}
                             </Badge>
                             {ad.featured && (
                               <Badge className="bg-blue-500 text-white border-none font-black text-[9px] uppercase tracking-widest px-4 py-1 rounded-full">
                                  Promoted
                               </Badge>
                             )}
                          </div>
                       </td>
                       <td className="p-8 text-center">
                          <Badge className={`${ad.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : ad.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'} border-none font-black text-[9px] uppercase tracking-widest px-4 py-1 rounded-full`}>
                             {ad.status}
                          </Badge>
                       </td>
                       <td className="p-8 text-right">
                          <DropdownMenu>
                             <DropdownMenuTrigger>
                                <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all">
                                   <MoreVertical className="w-5 h-5" />
                                </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="w-64 p-4 rounded-[2rem] border-none shadow-2xl bg-white animate-in zoom-in-95">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-2">Deployment Control</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleStatusChange(ad.id, 'approved')} className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-emerald-50 text-emerald-600 font-bold">
                                   <CheckCircle2 className="w-5 h-5" /> Approve Asset
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(ad.id, 'rejected')} className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-red-50 text-red-600 font-bold">
                                   <XCircle className="w-5 h-5" /> Deny Authorization
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator className="my-2 bg-slate-50" />

                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-2">Positioning Protocol</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleRankingChange(ad.id, 1000)} className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-emerald-50 text-emerald-600 font-bold">
                                   <ArrowUpDown className="w-5 h-5" /> Push to TOP (Level 1000)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRankingChange(ad.id, 500)} className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-blue-50 text-blue-600 font-bold">
                                   <ArrowUpDown className="w-5 h-5" /> Middle Orbit (Level 500)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRankingChange(ad.id, 0)} className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-slate-50 text-slate-400 font-bold">
                                   <ArrowUpDown className="w-5 h-5" /> Standard Floor (Level 0)
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                
                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 px-2">Priority Protocols</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handlePriorityChange(ad.id, 'premium')} className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-emerald-50 text-emerald-600 font-bold">
                                   <Zap className="w-5 h-5" /> Upgrade to Premium
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePriorityChange(ad.id, 'normal')} className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-slate-50 text-slate-600 font-bold">
                                   <ArrowUpDown className="w-5 h-5" /> Standard Level
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleFeatured(ad.id, ad.featured)} className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-blue-50 text-blue-600 font-bold">
                                   <Star className={`${ad.featured ? 'fill-blue-600' : ''} w-5 h-5`} /> {ad.featured ? 'Remove Promotion' : 'Promote to Project'}
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-2 bg-slate-50" />

                                <DropdownMenuItem className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-slate-50 text-slate-900 font-bold border border-slate-100">
                                   <Eye className="w-5 h-5" /> View Intel
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(ad.id)} className="flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:bg-red-50 text-red-600 font-bold mt-2">
                                   <Trash2 className="w-5 h-5" /> Terminate Asset
                                </DropdownMenuItem>
                             </DropdownMenuContent>
                          </DropdownMenu>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
