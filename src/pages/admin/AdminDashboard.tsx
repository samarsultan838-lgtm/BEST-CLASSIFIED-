import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Newspaper,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  ShieldCheck,
  CheckCircle,
  XCircle,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  Trash2,
  Edit,
  Eye,
  Activity,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, limit, where } from "firebase/firestore";
import { approveAd, rejectAd, deleteAd, updateUserStatus, deleteArticle, setAdRanking } from "@/lib/firestoreService";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, LineChart, Line } from 'recharts';
import SEO from "@/components/SEO";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const mockChartData = [
  { name: 'Jan', revenue: 4000, users: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398 },
  { name: 'Mar', revenue: 2000, users: 9800 },
  { name: 'Apr', revenue: 2780, users: 3908 },
  { name: 'May', revenue: 1890, users: 4800 },
  { name: 'Jun', revenue: 2390, users: 3800 },
  { name: 'Jul', revenue: 3490, users: 4300 },
];

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [stats, setStats] = useState({ users: 0, ads: 0, revenue: 0, pendingAds: 0 });
  const [recentAds, setRecentAds] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, [profile]);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      // Fetch Ads
      const adsSnapshot = await getDocs(query(collection(db, "ads"), orderBy("createdAt", "desc")));
      const adsData = adsSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setRecentAds(adsData);
      
      const pendingCount = adsData.filter(ad => ad.status === 'pending').length;

      // Fetch Users
      const usersSnapshot = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setRecentUsers(usersData);

      // Fetch News
      const newsSnapshot = await getDocs(query(collection(db, "news"), orderBy("createdAt", "desc")));
      setNewsList(newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      setStats({
        users: usersData.length,
        ads: adsData.length,
        revenue: 24500, // Mock revenue
        pendingAds: pendingCount,
      });

    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setIsLoading(false);
    }
  };

  if (profile?.role !== "admin") {
    return <Navigate to="/" />;
  }

  const handleApproveAd = async (adId: string) => {
    try {
      await approveAd(adId, profile.uid);
      setRecentAds(recentAds.map(ad => ad.id === adId ? { ...ad, status: 'active' } : ad));
      setStats(prev => ({ ...prev, pendingAds: Math.max(0, prev.pendingAds - 1) }));
      toast.success("Ad approved successfully");
    } catch(err) { toast.error("Failed to approve ad"); }
  };

  const handleRejectAd = async (adId: string) => {
    try {
      await rejectAd(adId, "Violation of terms");
      setRecentAds(recentAds.map(ad => ad.id === adId ? { ...ad, status: 'rejected' } : ad));
      setStats(prev => ({ ...prev, pendingAds: Math.max(0, prev.pendingAds - 1) }));
      toast.success("Ad rejected");
    } catch(err) { toast.error("Failed to reject ad"); }
  };

  const handleDeleteAd = async (adId: string) => {
    if (!confirm("Are you sure you want to delete this ad?")) return;
    try {
      await deleteAd(adId);
      setRecentAds(recentAds.filter(ad => ad.id !== adId));
      toast.success("Ad deleted");
    } catch(err) { toast.error("Failed to delete ad"); }
  };
  
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const isBlocked = currentStatus !== 'blocked';
      const newStatus = isBlocked ? 'blocked' : 'active';
      await updateUserStatus(userId, isBlocked);
      setRecentUsers(recentUsers.map(user => user.id === userId ? { ...user, status: newStatus } : user));
      toast.success(`User access ${isBlocked ? 'suspended' : 'restored'}`);
    } catch(err) { toast.error("Failed to update user status"); }
  };

  const renderSidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex md:flex-col border-r border-slate-800 shadow-2xl`}>
      <div className="flex items-center justify-between p-6 border-b border-slate-800/50">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-xl text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black uppercase tracking-tighter">TRAZOT</span>
        </Link>
        <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        <p className="px-4 text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Command Center</p>
        
        <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === "overview"} onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }} />
        <SidebarItem icon={ShoppingBag} label="Listings & Ads" active={activeTab === "ads"} badge={stats.pendingAds} onClick={() => { setActiveTab("ads"); setSidebarOpen(false); }} />
        <SidebarItem icon={Users} label="Users & Identity" active={activeTab === "users"} onClick={() => { setActiveTab("users"); setSidebarOpen(false); }} />
        <SidebarItem icon={Newspaper} label="Intelligence (News)" active={activeTab === "news"} onClick={() => { setActiveTab("news"); setSidebarOpen(false); }} />
        
        <p className="px-4 text-xs font-black uppercase tracking-widest text-slate-500 mt-8 mb-4">System Settings</p>
        <SidebarItem icon={Settings} label="Global Configuration" active={activeTab === "settings"} onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }} />
      </div>

      <div className="p-4 border-t border-slate-800/50 mt-auto">
        <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl mb-4 border border-slate-800">
          <Avatar className="h-10 w-10 border-2 border-emerald-500/20">
            <AvatarImage src={profile.profileImage} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{profile.name}</p>
            <p className="text-xs font-medium text-emerald-400 capitalize">{profile.role}</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => signOut()}>
          <LogOut className="w-4 h-4 mr-3" /> Terminate Session
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <SEO title="TRAZOT Admin Terminal" description="System Dashboard" />
      <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-emerald-500/30">
        
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        
        {renderSidebar()}

        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-slate-200 shadow-sm flex items-center justify-between px-4 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button className="md:hidden text-slate-500 hover:text-slate-900 transition-colors" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-black uppercase tracking-tight text-slate-800">
                {activeTab === "overview" && "System Overview"}
                {activeTab === "ads" && "Listing Logistics"}
                {activeTab === "users" && "Identity Matrix"}
                {activeTab === "news" && "Intelligence Broadcast"}
                {activeTab === "settings" && "Global Settings"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-600 border border-slate-200">
                <Activity className="w-4 h-4 text-emerald-500 mr-2" />
                System Nominal
              </div>
              <Button variant="outline" size="icon" className="relative border-slate-200 text-slate-600 rounded-full">
                <Bell className="w-4 h-4" />
                {stats.pendingAds > 0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </Button>
            </div>
          </header>

          {/* Main Workspace */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-8">
              
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  {/* Stats Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Protocol Users" value={stats.users.toString()} icon={Users} trend="+12%" trendUp={true} />
                    <StatCard title="Active Listings" value={stats.ads.toString()} icon={ShoppingBag} trend="+5.2%" trendUp={true} />
                    <StatCard title="Pending Logistics" value={stats.pendingAds.toString()} icon={ShieldAlert} trend="-2%" trendUp={false} alert={stats.pendingAds > 0} />
                    <StatCard title="Total Capital (MoM)" value={`$${stats.revenue.toLocaleString()}`} icon={TrendingUp} trend="+18%" trendUp={true} textClass="text-emerald-600" />
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="shadow-lg border-0 bg-white">
                      <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg font-black uppercase text-slate-800">Capital Trajectory</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockChartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                              <RechartsTooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                              <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="shadow-lg border-0 bg-white">
                      <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-lg font-black uppercase text-slate-800">Identity Growth</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mockChartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                              <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                              <Line type="monotone" dataKey="users" stroke="#0F172A" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeTab === "ads" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                    <div className="relative w-full max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input placeholder="Search listings..." className="pl-10 bg-slate-50 border-slate-200 rounded-xl" />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[140px] rounded-xl bg-slate-50 border-slate-200">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card className="border-0 shadow-lg overflow-hidden bg-white rounded-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                          <tr>
                            <th className="px-6 py-4 rounded-tl-xl">Listing Title</th>
                            <th className="px-6 py-4">Seller/Author</th>
                            <th className="px-6 py-4">Financials</th>
                            <th className="px-6 py-4">Status Vector</th>
                            <th className="px-6 py-4 text-right rounded-tr-xl">Directives</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {recentAds.map((ad) => (
                            <tr key={ad.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                    {ad.images?.[0] ? Object.keys(ad.images[0]).length > 0 ? (
                                      <img src={Object.values(ad.images[0])[0] as string} alt="" className="h-full w-full object-cover" />
                                    ) : null : null}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 line-clamp-1">{ad.title}</div>
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">{ad.category}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-slate-900 font-bold text-xs">{ad.authorId}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-bold text-emerald-600">${ad.price?.toLocaleString()}</div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant={ad.status === 'active' ? 'default' : ad.status === 'pending' ? 'secondary' : 'destructive'} 
                                       className={`uppercase tracking-widest text-[10px] font-black ${ad.status === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ad.status === 'pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : ''}`}>
                                  {ad.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                <Link to={`/ad/${ad.id}/${ad.slug}`}>
                                  <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg text-blue-600 border-blue-200 hover:bg-blue-50">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </Link>
                                {ad.status === 'pending' && (
                                  <>
                                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => handleApproveAd(ad.id)}>
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg text-amber-600 border-amber-200 hover:bg-amber-50" onClick={() => handleRejectAd(ad.id)}>
                                      <XCircle className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                                <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDeleteAd(ad.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {recentAds.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">No logistics found in database.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                    <div className="relative w-full max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input placeholder="Search identity matrix..." className="pl-10 bg-slate-50 border-slate-200 rounded-xl" />
                    </div>
                  </div>

                  <Card className="border-0 shadow-lg overflow-hidden bg-white rounded-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                          <tr>
                            <th className="px-6 py-4 rounded-tl-xl">Identity Protocol</th>
                            <th className="px-6 py-4">Role Clearance</th>
                            <th className="px-6 py-4">Status Vector</th>
                            <th className="px-6 py-4">Creation Code</th>
                            <th className="px-6 py-4 text-right rounded-tr-xl">Directives</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {recentUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9 border border-slate-200">
                                    <AvatarImage src={user.profileImage} />
                                    <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-bold text-slate-900">{user.name || 'Unknown Entity'}</div>
                                    <div className="text-xs font-medium text-slate-500">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant="outline" className="uppercase tracking-widest font-black text-[10px] bg-slate-100 border-slate-200 text-slate-700">{user.role || 'user'}</Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant={!user.isBlocked ? 'default' : 'destructive'} 
                                       className={`uppercase tracking-widest text-[10px] font-black ${!user.isBlocked ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}`}>
                                  {user.isBlocked ? 'suspended' : 'active'}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                                {user.createdAt ? (typeof user.createdAt === 'string' ? format(new Date(user.createdAt), "MMM dd, yyyy") : user.createdAt.toDate ? format(user.createdAt.toDate(), "MMM dd, yyyy") : "Legacy") : "Unknown"}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Button 
                                  variant={user.isBlocked ? 'default' : 'outline'} 
                                  size="sm"
                                  className={`rounded-lg text-xs font-bold uppercase tracking-wider ${user.isBlocked ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'text-red-600 border-red-200 hover:bg-red-50'}`}
                                  onClick={() => handleToggleUserStatus(user.id, user.isBlocked ? 'blocked' : 'active')}
                                >
                                  {user.isBlocked ? 'Restore Access' : 'Suspend Access'}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </motion.div>
              )}

            </div>
          </main>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, icon: Icon, trend, trendUp, alert = false, textClass = "text-slate-900" }: any) {
  return (
    <Card className="border-0 shadow-lg bg-white relative overflow-hidden rounded-2xl group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity group-hover:scale-110 duration-500">
        <Icon className={`w-24 h-24 ${alert ? 'text-red-500' : 'text-emerald-500'}`} />
      </div>
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">{title}</p>
          <div className={`p-2 rounded-xl ${alert ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h3 className={`text-4xl font-black tracking-tighter ${textClass}`}>{value}</h3>
          <p className={`text-xs font-bold mt-2 flex items-center ${trendUp ? 'text-emerald-600' : 'text-amber-600'}`}>
            {trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 rotate-180" />}
            {trend} from preceding cycle
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm ${
        active 
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
          : "text-slate-400 hover:bg-slate-900 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${active ? "text-emerald-100" : "text-slate-500"}`} />
        {label}
      </div>
      {badge > 0 && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
          active ? "bg-white text-emerald-600" : "bg-red-500 text-white"
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}
