import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import { 
  User, 
  Settings, 
  MessageSquare, 
  Heart, 
  Tag, 
  LayoutDashboard, 
  PlusCircle, 
  LogOut,
  ChevronRight,
  MapPin,
  Clock,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function DashboardHome() {
  const { profile } = useAuth();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-grow space-y-10">
          <Card className="border-none shadow-[0_40px_80px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-emerald-950 text-white relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full translate-x-1/4"></div>
            <CardContent className="p-12 flex flex-col md:flex-row items-center gap-12 relative z-10">
               <div className="relative">
                 <Avatar className="w-32 h-32 border-4 border-emerald-900 shadow-2xl">
                    <AvatarImage src={profile?.profileImage} />
                    <AvatarFallback className="text-4xl font-black bg-emerald-500 text-emerald-950">{profile?.name.charAt(0)}</AvatarFallback>
                 </Avatar>
                 <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2.5 rounded-2xl shadow-xl">
                   <ShieldCheck className="w-6 h-6 text-emerald-950" />
                 </div>
               </div>
               <div className="text-center md:text-left flex-grow">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
                     <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">{profile?.name}</h2>
                     <Badge className="bg-emerald-500 text-emerald-950 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full">{profile?.role}</Badge>
                  </div>
                  <p className="text-emerald-400 font-bold mb-8 uppercase tracking-widest text-xs opacity-70">{profile?.email}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-6">
                     <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-emerald-200/60">
                        <MapPin className="w-4 h-4 text-emerald-500" /> {profile?.location?.name || "Global Resident"}
                     </div>
                     <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-emerald-200/60">
                        <Clock className="w-4 h-4 text-emerald-500" /> Since {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : '2025'}
                     </div>
                  </div>
               </div>
               <Link to="/post-ad" className="w-full md:w-auto">
                 <Button className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black h-20 px-12 rounded-3xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] text-xl transition-all hover:scale-105 uppercase tracking-tighter">
                    <PlusCircle className="mr-3 h-6 w-6" /> Sell Item
                 </Button>
               </Link>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden group">
                <CardHeader className="p-10 pb-0">
                   <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xl font-black uppercase tracking-tighter">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                          <Tag className="w-6 h-6 text-emerald-500" />
                        </div>
                        Inventory
                      </div>
                      <Badge className="bg-slate-100 text-slate-400 border-none font-black px-4 py-1 rounded-lg">LIVE: 0</Badge>
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                   <div className="text-center py-10">
                      <p className="text-slate-400 font-bold text-lg mb-8 uppercase tracking-widest opacity-60">No active listings</p>
                      <Button className="bg-slate-50 text-emerald-600 hover:bg-emerald-50 font-black w-full h-16 rounded-2xl transition-all shadow-inner">
                        Create Your First Ad <span>→</span>
                      </Button>
                   </div>
                </CardContent>
             </Card>

             <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden group">
                <CardHeader className="p-10 pb-0">
                   <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xl font-black uppercase tracking-tighter">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-blue-500" />
                        </div>
                        Network
                      </div>
                      <Badge className="bg-blue-50 text-blue-400 border-none font-black px-4 py-1 rounded-lg">NEW: 0</Badge>
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                   <div className="text-center py-10">
                      <p className="text-slate-400 font-bold text-lg mb-8 uppercase tracking-widest opacity-60">Inbox is empty</p>
                      <Button className="bg-slate-50 text-blue-600 hover:bg-blue-50 font-black w-full h-16 rounded-2xl transition-all shadow-inner">
                        Inbox Console <span>→</span>
                      </Button>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { signOut } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3">
           <div className="bg-white rounded-[2rem] shadow-xl border border-slate-50 overflow-hidden sticky top-24">
              <div className="p-8 border-b border-slate-50">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Account Menu</h3>
              </div>
              <nav className="p-4 space-y-2">
                 <Link to="/dashboard" className="flex items-center gap-4 w-full p-5 rounded-2xl bg-emerald-50 text-emerald-600 font-black uppercase tracking-tighter transition-all hover:scale-[1.02]">
                    <LayoutDashboard className="w-5 h-5" /> Overview
                 </Link>
                 <Link to="/dashboard/my-ads" className="flex items-center gap-4 w-full p-5 rounded-2xl text-slate-500 hover:bg-slate-50 font-black uppercase tracking-tighter transition-all hover:translate-x-1">
                    <Tag className="w-5 h-5 text-emerald-500/50" /> My Listings
                 </Link>
                 <Link to="/dashboard/favorites" className="flex items-center gap-4 w-full p-5 rounded-2xl text-slate-500 hover:bg-slate-50 font-black uppercase tracking-tighter transition-all hover:translate-x-1">
                    <Heart className="w-5 h-5 text-emerald-500/50" /> Watchlist
                 </Link>
                 <Link to="/dashboard/messages" className="flex items-center gap-4 w-full p-5 rounded-2xl text-slate-500 hover:bg-slate-50 font-black uppercase tracking-tighter transition-all hover:translate-x-1">
                    <MessageSquare className="w-5 h-5 text-emerald-500/50" /> Messenger
                 </Link>
                 <Link to="/dashboard/settings" className="flex items-center gap-4 w-full p-5 rounded-2xl text-slate-500 hover:bg-slate-50 font-black uppercase tracking-tighter transition-all hover:translate-x-1">
                    <Settings className="w-5 h-5 text-emerald-500/50" /> Preferences
                 </Link>
                 <div className="pt-8 px-4"><div className="border-t border-slate-50"></div></div>
                 <button onClick={() => signOut()} className="flex items-center gap-4 w-full p-5 rounded-2xl text-red-500 hover:bg-red-50 font-black uppercase tracking-tighter transition-all">
                    <LogOut className="w-5 h-5" /> Terminate Session
                 </button>
              </nav>
           </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9">
           <Routes>
             <Route index element={<DashboardHome />} />
             <Route path="my-ads" element={<div>My Ads Management</div>} />
             <Route path="favorites" element={<div>Favorite Ads</div>} />
             <Route path="messages" element={<div>Messages / Chat</div>} />
             <Route path="settings" element={<div>Profile Settings</div>} />
           </Routes>
        </div>
      </div>
    </div>
  );
}
