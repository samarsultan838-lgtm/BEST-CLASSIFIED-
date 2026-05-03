import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  BarChart3, 
  Newspaper, 
  Settings as SettingsIcon, 
  ShieldCheck,
  Eye,
  MoreVertical,
  MapPin,
  Calendar
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { getPendingAds, approveAd, rejectAd } from "@/src/lib/firestoreService";
import { seedDatabase } from "@/src/lib/seedData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboardPage() {
  const { profile } = useAuth();
  const [pendingAds, setPendingAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [seeding, setSeeding] = useState(false);

  const fetchPendingAds = async () => {
    setLoading(true);
    const ads = await getPendingAds();
    setPendingAds(ads || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingAds();
  }, []);

  const handleApprove = async (id: string) => {
    if (!profile) return;
    try {
      await approveAd(id, profile.uid);
      toast.success("Ad approved successfully!");
      fetchPendingAds();
    } catch (error) {
      toast.error("Failed to approve ad.");
    }
  };

  const handleReject = async () => {
    if (!rejectId || !rejectReason) return;
    try {
      await rejectAd(rejectId, rejectReason);
      toast.success("Ad rejected.");
      setRejectId(null);
      setRejectReason("");
      fetchPendingAds();
    } catch (error) {
      toast.error("Failed to reject ad.");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
       await seedDatabase();
       toast.success("Database seeded with sample ads and news!");
       fetchPendingAds();
    } catch (error) {
       toast.error("Seeding failed.");
    } finally {
       setSeeding(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-8 h-8 text-orange-500" />
            <span className="text-xl font-bold">TRAZOT ADMIN</span>
          </Link>
        </div>
        <nav className="p-4 flex-grow space-y-1">
          <Button variant="ghost" className="w-full justify-start text-white bg-slate-800">
            <BarChart3 className="mr-2 h-4 w-4" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-slate-800">
            <Clock className="mr-2 h-4 w-4" /> Pending Ads
            {pendingAds.length > 0 && <Badge className="ml-auto bg-orange-500">{pendingAds.length}</Badge>}
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-slate-800">
            <Users className="mr-2 h-4 w-4" /> Users
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-slate-800">
            <Newspaper className="mr-2 h-4 w-4" /> News CMS
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-slate-800">
            <ShieldCheck className="mr-2 h-4 w-4" /> Verifications
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-slate-800">
            <AlertCircle className="mr-2 h-4 w-4" /> Reports
          </Button>
          <Button variant="ghost" className="w-full justify-start hover:bg-slate-800">
            <SettingsIcon className="mr-2 h-4 w-4" /> Site Settings
          </Button>
        </nav>
      </aside>

      <main className="flex-grow p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500">Welcome back, {profile?.name}</p>
          </div>
          <div className="flex items-center gap-4">
             <Button 
               disabled={seeding} 
               onClick={handleSeed}
               variant="outline" 
               className="border-orange-200 text-orange-600 hover:bg-orange-50 font-bold"
             >
                {seeding ? "Seeding..." : "Seed Sample Data"}
             </Button>
             <div className="bg-white p-2 px-4 rounded-xl shadow-sm flex items-center gap-3">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-sm font-bold">System Online</span>
             </div>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Users</p>
                  <h3 className="text-2xl font-black">2,543</h3>
                </div>
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-green-600 font-bold mt-4">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Live Ads</p>
                  <h3 className="text-2xl font-black">12,890</h3>
                </div>
                <div className="bg-green-50 text-green-600 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-green-600 font-bold mt-4">+5% from last week</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Pending Approval</p>
                  <h3 className="text-2xl font-black">{pendingAds.length}</h3>
                </div>
                <div className="bg-orange-50 text-orange-600 p-2 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-orange-600 font-bold mt-4">Needs attention</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Ad Views Today</p>
                  <h3 className="text-2xl font-black">45.2K</h3>
                </div>
                <div className="bg-purple-50 text-purple-600 p-2 rounded-lg">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-green-600 font-bold mt-4">+22% today</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Queue */}
        <Card className="border-none shadow-xl rounded-2xl overflow-hidden mb-10">
          <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between p-6">
            <div>
              <CardTitle className="text-xl font-black">Approval Queue</CardTitle>
              <CardDescription>Review and moderate pending advertisements</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchPendingAds}>Refresh</Button>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading ads...</div>
            ) : pendingAds.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No pending ads at the moment.</div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold">Ad Detail</TableHead>
                    <TableHead className="font-bold">Seller</TableHead>
                    <TableHead className="font-bold">Location</TableHead>
                    <TableHead className="font-bold">Submitted</TableHead>
                    <TableHead className="text-right font-bold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingAds.map((ad) => (
                    <TableRow key={ad.id} className="hover:bg-slate-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                             <img src={ad.images?.[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{ad.title}</p>
                            <p className="text-xs text-orange-600 font-bold">${ad.price}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{ad.userName}</div>
                        <div className="text-xs text-slate-400">{ad.userEmail}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {ad.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {ad.createdAt?.toDate ? ad.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                           <Button 
                             onClick={() => handleApprove(ad.id)} 
                             size="sm" 
                             className="bg-green-600 hover:bg-green-700 h-8 font-bold px-3"
                           >
                             <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Approve
                           </Button>
                           <Dialog>
                             <DialogTrigger
                               render={
                                 <Button onClick={() => setRejectId(ad.id)} size="sm" variant="outline" className="h-8 font-bold text-red-600 hover:text-red-700 border-red-100 hover:bg-red-50 px-3">
                                   <XCircle className="w-3.5 h-3.5 mr-1.5" /> Reject
                                 </Button>
                               }
                             />
                             <DialogContent>
                               <DialogHeader>
                                 <DialogTitle>Reject Advertisement</DialogTitle>
                                 <DialogDescription>
                                   Please provide a reason for rejecting this ad. The user will be notified.
                                 </DialogDescription>
                               </DialogHeader>
                               <div className="py-4">
                                 <Textarea 
                                   placeholder="e.g. Prohibited items, low quality images, incorrect price..." 
                                   value={rejectReason}
                                   onChange={(e) => setRejectReason(e.target.value)}
                                   className="min-h-[100px]"
                                 />
                               </div>
                               <DialogFooter>
                                 <Button variant="ghost" onClick={() => setRejectId(null)}>Cancel</Button>
                                 <Button className="bg-red-600 hover:bg-red-700" onClick={handleReject}>Reject Ad</Button>
                               </DialogFooter>
                             </DialogContent>
                           </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
