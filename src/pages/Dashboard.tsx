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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-grow space-y-8">
          <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-slate-900 text-white">
            <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8">
               <Avatar className="w-24 h-24 border-4 border-slate-800">
                  <AvatarImage src={profile?.profileImage} />
                  <AvatarFallback className="text-3xl font-black bg-orange-500">{profile?.name.charAt(0)}</AvatarFallback>
               </Avatar>
               <div className="text-center md:text-left flex-grow">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                     <h2 className="text-3xl font-black">{profile?.name}</h2>
                     <Badge className="bg-orange-500 text-[10px] font-black">{profile?.role.toUpperCase()}</Badge>
                  </div>
                  <p className="text-slate-400 font-medium mb-6">{profile?.email}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                     <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold">
                        <MapPin className="w-4 h-4 text-orange-500" /> {profile?.location?.name || "Location not set"}
                     </div>
                     <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold">
                        <Clock className="w-4 h-4 text-orange-500" /> Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recently'}
                     </div>
                  </div>
               </div>
               <Link to="/post-ad" className="w-full md:w-auto">
                 <Button className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 font-black h-14 px-8 rounded-2xl shadow-lg shadow-orange-950">
                    <PlusCircle className="mr-2 h-5 w-5" /> Sell Something
                 </Button>
               </Link>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Card className="rounded-[2rem] border-none shadow-lg">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-orange-500" /> My Active Ads
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="p-8 text-center text-slate-400">
                      <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                         <Tag className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-sm font-medium">You don't have any live ads yet.</p>
                      <Button variant="link" className="text-orange-500 font-bold mt-2">Start selling now</Button>
                   </div>
                </CardContent>
             </Card>

             <Card className="rounded-[2rem] border-none shadow-lg">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-orange-500" /> Recent Messages
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="p-8 text-center text-slate-400">
                      <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                         <MessageSquare className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-sm font-medium">No messages yet.</p>
                      <Button variant="link" className="text-orange-500 font-bold mt-2">Check notifications</Button>
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
              <nav className="p-4 space-y-1">
                 <Link to="/dashboard" className="flex items-center gap-3 w-full p-4 rounded-2xl bg-orange-50 text-orange-600 font-black">
                    <LayoutDashboard className="w-5 h-5" /> Overview
                 </Link>
                 <Link to="/dashboard/my-ads" className="flex items-center gap-3 w-full p-4 rounded-2xl text-slate-600 hover:bg-slate-50 font-bold transition-colors">
                    <Tag className="w-5 h-5" /> My Ads
                 </Link>
                 <Link to="/dashboard/favorites" className="flex items-center gap-3 w-full p-4 rounded-2xl text-slate-600 hover:bg-slate-50 font-bold transition-colors">
                    <Heart className="w-5 h-5" /> Favorites
                 </Link>
                 <Link to="/dashboard/messages" className="flex items-center gap-3 w-full p-4 rounded-2xl text-slate-600 hover:bg-slate-50 font-bold transition-colors">
                    <MessageSquare className="w-5 h-5" /> Messages
                 </Link>
                 <Link to="/dashboard/settings" className="flex items-center gap-3 w-full p-4 rounded-2xl text-slate-600 hover:bg-slate-50 font-bold transition-colors">
                    <Settings className="w-5 h-5" /> Settings
                 </Link>
                 <div className="pt-8 px-4"><div className="border-t border-slate-50"></div></div>
                 <button onClick={() => signOut()} className="flex items-center gap-3 w-full p-4 rounded-2xl text-red-500 hover:bg-red-50 font-bold transition-colors">
                    <LogOut className="w-5 h-5" /> Log out
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
