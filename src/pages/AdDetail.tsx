import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  MapPin, 
  Flag, 
  Share2, 
  Heart, 
  Phone, 
  MessageCircle, 
  User, 
  Clock, 
  ChevronLeft, 
  ShieldCheck, 
  Calendar,
  Eye,
  Info
} from "lucide-react";
import { getAdById } from "@/src/lib/firestoreService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Separator = ({ className }: { className?: string }) => <div className={`h-px bg-slate-100 ${className || ""}`} />;

export default function AdDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      if (!id) return;
      const data = await getAdById(id);
      if (data) {
        setAd(data);
      }
      setLoading(false);
    };
    fetchAd();
  }, [id]);

  if (loading) return <div className="container mx-auto p-20 text-center">Loading ad...</div>;
  if (!ad) return <div className="container mx-auto p-20 text-center">Ad not found.</div>;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="bg-white border-b border-slate-200 mb-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
           <Button variant="ghost" className="gap-2 text-slate-600" onClick={() => navigate(-1)}>
             <ChevronLeft className="w-4 h-4" /> Back to results
           </Button>
           <div className="flex gap-2">
             <Button variant="ghost" size="icon" className="rounded-full"><Share2 className="w-5 h-5" /></Button>
             <Button variant="ghost" size="icon" className="rounded-full text-red-500 hover:bg-red-50"><Heart className="w-5 h-5" /></Button>
             <Button variant="ghost" size="icon" className="rounded-full"><Flag className="w-5 h-5" /></Button>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
               <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
                  <img src={ad.images?.[0]} alt={ad.title} className="w-full h-full object-contain" />
                  {ad.status !== 'approved' && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-orange-500 text-white border-none px-4 py-2 font-bold shadow-lg shadow-orange-200">
                        PENDING APPROVAL
                      </Badge>
                    </div>
                  )}
               </div>
               <div className="p-4 flex gap-4 overflow-x-auto bg-slate-50 border-t border-slate-100">
                  {ad.images?.map((img: string, i: number) => (
                    <div key={i} className="w-24 h-24 bg-white rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-orange-500 transition-all flex-shrink-0">
                       <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
            </div>

            {/* Ad Content */}
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200 space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                   <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-bold px-3 py-1 uppercase tracking-wider text-[10px]">{ad.category}</Badge>
                   <Badge variant="outline" className="border-slate-200 text-slate-500">{ad.condition}</Badge>
                </div>
                <h1 className="text-4xl font-black text-slate-900 leading-tight">{ad.title}</h1>
                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-400">
                   <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {ad.location}</div>
                   <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Posted 12 hours ago</div>
                   <div className="flex items-center gap-2"><Eye className="w-4 h-4" /> 1,245 views</div>
                </div>
              </div>

              <div className="py-6 border-y border-slate-100">
                 <div className="text-3xl font-black text-orange-600">${ad.price}</div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Description</h3>
                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">
                   {ad.description}
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                   <ShieldCheck className="w-5 h-5 text-orange-500" />
                   <h3>Safety Tips for Buyers</h3>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
                   <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></div>
                      Meet the seller in a safe, public location.
                   </li>
                   <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></div>
                      Check the item before you pay for it.
                   </li>
                   <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></div>
                      Never pay in advance for shipping or holds.
                   </li>
                   <li className="flex items-start gap-2">
                      <div className="mt-1 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></div>
                      Report suspicious behavior to our moderation team.
                   </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="rounded-3xl border-none shadow-xl overflow-hidden sticky top-24">
              <CardContent className="p-8 space-y-8">
                 <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-orange-100">
                       <AvatarImage src="" />
                       <AvatarFallback className="bg-orange-500 text-white text-2xl font-black">
                          {ad.userName?.charAt(0)}
                       </AvatarFallback>
                    </Avatar>
                    <div>
                       <h3 className="font-black text-slate-900 text-xl">{ad.userName}</h3>
                       <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full w-max">
                          <ShieldCheck className="w-3 h-3" /> VERIFIED SELLER
                       </div>
                    </div>
                 </div>

                 <Separator className="bg-slate-100" />

                 <div className="space-y-4">
                    <Button 
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-7 text-lg rounded-2xl shadow-lg"
                      onClick={() => setShowPhone(!showPhone)}
                    >
                      <Phone className="mr-3 w-5 h-5 text-orange-500" /> {showPhone ? ad.userPhone || "+923001887808" : "Show Phone Number"}
                    </Button>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-7 text-lg rounded-2xl shadow-lg shadow-orange-100">
                      <MessageCircle className="mr-3 w-6 h-6" /> Chat with Seller
                    </Button>
                 </div>

                 <div className="text-center">
                    <Link to={`/seller/${ad.userId}`} className="text-sm font-bold text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-widest">
                       View Seller Profile
                    </Link>
                 </div>

                 <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                   <div className="bg-white p-2 rounded-xl text-orange-500">
                      <Calendar className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Member Since</p>
                      <p className="text-sm font-bold text-slate-700">January 2023</p>
                   </div>
                 </div>
              </CardContent>
            </Card>

            <div className="bg-white rounded-3xl p-8 border border-slate-200">
               <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 text-orange-500" /> Ad Information
               </h4>
               <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                     <span className="text-slate-400 font-medium">Ad ID</span>
                     <span className="font-bold text-slate-900">#{ad.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-400 font-medium">Category</span>
                     <span className="font-bold text-slate-900 capitalize">{ad.category}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-400 font-medium">Condition</span>
                     <span className="font-bold text-slate-900">{ad.condition}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
