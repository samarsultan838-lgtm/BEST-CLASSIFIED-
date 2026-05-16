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
  Info,
  Youtube,
  CheckCircle,
  Video,
  Award,
  ArrowRight
} from "lucide-react";
import { getAdById } from "@/src/lib/firestoreService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import SEO from "@/src/components/SEO";

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

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  if (loading) return <div className="container mx-auto p-20 text-center text-emerald-500 font-black animate-pulse">SYNCHRONIZING ASSET DATA...</div>;
  if (!ad) return <div className="container mx-auto p-20 text-center font-black">AD UNIT NOT FOUND.</div>;

  const videoEmbedUrl = getYoutubeEmbedUrl(ad.videoUrl);

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-32">
      <SEO 
        title={`${ad.title} | ${ad.category} in ${ad.location}`}
        description={`${ad.description?.substring(0, 160)}... Buy ${ad.title} for $${ad.price}. Verified seller: ${ad.userName}.`}
        keywords={`${ad.category}, ${ad.location}, ${ad.title}, classifieds, buy sell, ${ad.condition}`}
        image={ad.images?.[0]}
        url={window.location.href}
        type="article"
      />
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
           <Button variant="ghost" className="gap-3 text-slate-400 font-black uppercase tracking-tighter hover:text-emerald-600 transition-all" onClick={() => navigate(-1)}>
             <ChevronLeft className="w-5 h-5" /> Results
           </Button>
           <div className="flex gap-4">
             <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-50 text-slate-400 hover:text-emerald-500 transition-all"><Share2 className="w-5 h-5" /></Button>
             <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 transition-all"><Heart className="w-5 h-5" /></Button>
             <Button variant="ghost" size="icon" className="rounded-2xl bg-slate-50 text-slate-400 hover:text-orange-500 transition-all"><Flag className="w-5 h-5" /></Button>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Image Gallery */}
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-white group relative">
               <div className="aspect-[16/10] bg-slate-100 flex items-center justify-center relative overflow-hidden">
                  <img src={ad.images?.[0]} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute top-8 left-8 flex flex-col gap-3">
                    {ad.featured && (
                      <Badge className="bg-orange-500 text-white border-none px-6 py-2 font-black shadow-2xl rounded-2xl uppercase tracking-[0.2em] text-[10px]">
                        Featured Listing
                      </Badge>
                    )}
                    {ad.priority === 'premium' && (
                      <Badge className="bg-emerald-500 text-emerald-950 border-none px-6 py-2 font-black shadow-2xl rounded-2xl uppercase tracking-[0.2em] text-[10px]">
                        Urgent Spot
                      </Badge>
                    )}
                  </div>
                  {ad.status !== 'approved' && (
                    <div className="absolute top-8 right-8 z-10">
                      <Badge className="bg-slate-900 text-white border-none px-6 py-3 font-black shadow-2xl rounded-2xl uppercase tracking-[0.2em] text-[10px]">
                        Pending Validation
                      </Badge>
                    </div>
                  )}
               </div>
               <div className="p-8 flex gap-6 overflow-x-auto bg-slate-50 shadow-inner no-scrollbar">
                  {ad.images?.map((img: string, i: number) => (
                    <div key={i} className="w-24 h-24 bg-white rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent hover:border-emerald-500 transition-all flex-shrink-0 shadow-lg">
                       <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
            </div>

            {/* Ad Content */}
            <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-white space-y-12">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                   <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-black px-4 py-2 uppercase tracking-widest text-[10px] rounded-xl">{ad.category}</Badge>
                   <Badge variant="outline" className="border-slate-100 text-slate-400 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest">{ad.condition}</Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[0.95] tracking-tighter uppercase text-left">{ad.title}</h1>
                <div className="flex flex-wrap items-center gap-6 md:gap-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                   <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-emerald-500" /> {ad.location}</div>
                   <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-emerald-500" /> Posted 12h ago</div>
                   <div className="flex items-center gap-3"><Eye className="w-5 h-5 text-emerald-500" /> 1,245 Views</div>
                </div>
              </div>

              <div className="py-12 border-y border-slate-50 flex items-center justify-between gap-8">
                 <div className="text-5xl md:text-6xl font-black text-emerald-600 tracking-tighter leading-none">${ad.price}</div>
                 <div className="hidden md:flex gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-slate-100 font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all">Negotiable</Button>
                    {ad.whatsapp && (
                      <Badge className="bg-green-500 text-white flex items-center gap-2 h-14 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-green-500/20">
                         <MessageCircle className="w-5 h-5" /> {ad.whatsapp}
                      </Badge>
                    )}
                 </div>
              </div>

              {/* Direct Contact Core */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 rounded-[2.5rem] p-10 border border-emerald-100 flex flex-col justify-between group hover:bg-emerald-100 transition-all cursor-pointer overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                   <div className="space-y-4 relative z-10">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-xl group-hover:scale-110 transition-transform">
                         <Phone className="w-8 h-8" />
                      </div>
                      <h4 className="text-2xl font-black text-emerald-950 uppercase tracking-tighter">Direct Connect</h4>
                      <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Authorized Mobile Channel</p>
                   </div>
                   <div className="mt-8 relative z-10">
                      <p className="text-3xl font-black text-emerald-950 tracking-tighter">
                         {ad.userPhone || ad.whatsapp || "No Number Provided"}
                      </p>
                   </div>
                </div>

                {ad.whatsapp && (
                  <a href={`https://wa.me/${ad.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`} target="_blank" rel="noreferrer" className="block">
                    <div className="bg-green-50 rounded-[2.5rem] p-10 border border-green-100 h-full flex flex-col justify-between group hover:bg-green-100 transition-all overflow-hidden relative">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                       <div className="space-y-4 relative z-10">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-xl group-hover:scale-110 transition-transform">
                             <MessageCircle className="w-8 h-8" />
                          </div>
                          <h4 className="text-2xl font-black text-green-950 uppercase tracking-tighter">WhatsApp Link</h4>
                          <p className="text-[10px] font-black text-green-600/60 uppercase tracking-widest">Instant Interest Protocol</p>
                       </div>
                       <div className="mt-8 relative z-10 flex items-center gap-3">
                          <span className="text-xl font-black text-green-950 uppercase tracking-tighter">Initiate Chat</span>
                          <ArrowRight className="w-6 h-6 text-green-600 group-hover:translate-x-2 transition-transform" />
                       </div>
                    </div>
                  </a>
                )}
              </div>

              {/* Extended Features */}
              {ad.features && ad.features.length > 0 && (
                <div className="space-y-8">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <Award className="text-emerald-500 w-6 h-6" /> Extended Capabilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {ad.features.map((feature: string) => (
                      <div key={feature} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                        <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-8 text-left">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Master Description</h3>
                <div className="text-slate-500 leading-[1.8] whitespace-pre-wrap text-lg font-medium">
                   {ad.description}
                </div>
              </div>

              {videoEmbedUrl && (
                <div className="space-y-8 text-left">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <Video className="text-red-500 w-6 h-6" /> Visual Telemetry (Video)
                  </h3>
                  <div className="aspect-video rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-2xl">
                    <iframe 
                      src={videoEmbedUrl} 
                      className="w-full h-full" 
                      title="YouTube video player" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

               {(ad.location || ad.city || ad.state || ad.country) && (
                <div className="space-y-4 text-left">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                    <MapPin className="text-emerald-500 w-6 h-6" /> Location
                  </h3>
                  {(ad.location || ad.city || ad.state || ad.country) && (
                   <div className="rounded-[2rem] p-6 bg-slate-50 border border-slate-100 flex items-center gap-4">
                     <span className="text-slate-600 font-bold uppercase tracking-widest text-sm">
                       {[ad.location, ad.city, ad.state, ad.country].filter(Boolean).join(", ")}
                     </span>
                   </div>
                  )}
                </div>
              )}

              {/* Safety Tips */}
              <div className="bg-emerald-950 rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2"></div>
                <div className="flex items-center gap-4 text-emerald-500 font-black uppercase tracking-widest text-xs mb-10">
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                     <ShieldCheck className="w-6 h-6" />
                   </div>
                   Security Protocol
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[11px] text-emerald-100/40 uppercase tracking-widest font-black text-left">
                   <li className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      Public location meeting required
                   </li>
                   <li className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      Verify item specifics personally
                   </li>
                   <li className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      No advanced digital payments
                   </li>
                   <li className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      Report suspicious interaction
                   </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            <Card className="rounded-[3rem] border-none shadow-[0_40px_80px_rgba(0,0,0,0.1)] overflow-hidden sticky top-32 bg-white">
              <CardContent className="p-10 md:p-12 space-y-12">
                 <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20 border-4 border-emerald-50 shadow-2xl">
                       <AvatarImage src={ad.userProfileImage} />
                       <AvatarFallback className="bg-emerald-950 text-emerald-500 text-3xl font-black">
                          {ad.userName?.charAt(0)}
                       </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                       <h3 className="font-black text-slate-900 text-2xl uppercase tracking-tighter leading-none mb-3">{ad.userName}</h3>
                       <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                          <ShieldCheck className="w-4 h-4" /> Trusted Partner
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <Button 
                      className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-black h-16 text-sm rounded-2xl shadow-xl transition-all uppercase tracking-tighter"
                      onClick={() => setShowPhone(!showPhone)}
                    >
                      <Phone className="mr-3 w-5 h-5 text-emerald-500" /> {showPhone ? ad.userPhone || "+92 300 0000000" : "Call Seller"}
                    </Button>
                    
                    <a href={`https://wa.me/${(ad.whatsapp || ad.userPhone || '000').replace(/\+/g, '')}`} target="_blank" rel="noreferrer" className="block w-full">
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-emerald-950 font-black h-16 text-sm rounded-2xl shadow-xl transition-all hover:scale-[1.02] uppercase tracking-tighter">
                        <MessageCircle className="mr-3 w-5 h-5" /> WhatsApp Direct
                      </Button>
                    </a>

                    <a href={`mailto:${ad.userEmail || "seller@example.com"}`} className="block w-full">
                      <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black h-16 text-sm rounded-2xl shadow-sm transition-all uppercase tracking-tighter">
                        <Info className="mr-3 w-5 h-5 text-slate-500" /> Email Seller
                      </Button>
                    </a>

                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black h-16 text-sm rounded-2xl shadow-sm transition-all uppercase tracking-tighter">
                      <MessageCircle className="mr-3 w-5 h-5 text-slate-400" /> Chat with Seller
                    </Button>
                 </div>

                 <div className="text-center">
                    <Link to={`/seller/${ad.userId}`} className="text-[10px] font-black text-slate-300 hover:text-emerald-500 transition-all uppercase tracking-[0.2em]">
                       Explore Merchant Hub
                    </Link>
                 </div>

                 <div className="bg-slate-50 rounded-[2rem] p-6 flex items-center gap-4 shadow-inner">
                    <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                       <Calendar className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Established</p>
                       <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">January 2023</p>
                    </div>
                 </div>
              </CardContent>
            </Card>

            <div className="bg-white rounded-[3.5rem] p-12 border border-slate-50 shadow-2xl space-y-10 text-left">
               <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    <Info className="w-5 h-5 text-emerald-500" />
                  </div>
                  Quick Facts
               </h4>
               <div className="space-y-8 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">
                  <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                     <span>Deployment ID</span>
                     <span className="text-slate-900 text-[9px]">#{ad.id.slice(0, 12)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                     <span>Category</span>
                     <span className="text-emerald-600">{ad.category}</span>
                  </div>
                  {ad.condition && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>Condition</span>
                       <span className="text-slate-900">{ad.condition}</span>
                    </div>
                  )}
                  {ad.propertyType && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>Property Type</span>
                       <span className="text-slate-900 capitalize">{ad.propertyType}</span>
                    </div>
                  )}
                  {ad.propertySubType && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>Sub Type</span>
                       <span className="text-slate-900 capitalize">{ad.propertySubType.replace('_', ' ')}</span>
                    </div>
                  )}
                  {ad.area && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>Area</span>
                       <span className="text-slate-900">{ad.area} {ad.areaUnit && <span className="capitalize">{ad.areaUnit.replace('_', ' ')}</span>}</span>
                    </div>
                  )}
                  {ad.purpose && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>Purpose</span>
                       <span className="text-slate-900">{ad.purpose}</span>
                    </div>
                  )}
                  {ad.vehicleMake && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>Make</span>
                       <span className="text-slate-900">{ad.vehicleMake}</span>
                    </div>
                  )}
                  {ad.vehicleModel && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>Model</span>
                       <span className="text-slate-900">{ad.vehicleModel}</span>
                    </div>
                  )}
                  {ad.vehicleYear && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>Year</span>
                       <span className="text-slate-900">{ad.vehicleYear}</span>
                    </div>
                  )}
                  {ad.vehicleVIN && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>VIN Verification</span>
                       <span className="text-emerald-600 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> VERIFIED ({ad.vehicleVIN})</span>
                    </div>
                  )}
                  {ad.registeredIn && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>Registered In</span>
                       <span className="text-slate-900">{ad.registeredIn}</span>
                    </div>
                  )}
                  {ad.mileage && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>Mileage</span>
                       <span className="text-slate-900">{ad.mileage}</span>
                    </div>
                  )}
                  {ad.fuelType && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>Fuel Type</span>
                       <span className="text-slate-900 capitalize">{ad.fuelType}</span>
                    </div>
                  )}
                  {ad.jobType && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>Job Type</span>
                       <span className="text-slate-900">{ad.jobType}</span>
                    </div>
                  )}
                  {ad.fashionCategory && (
                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                       <span>Demographic</span>
                       <span className="text-slate-900 capitalize">{ad.fashionCategory.replace('_', ' ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                     <span>Priority</span>
                     <span className="text-orange-500">{ad.priority === 'premium' ? 'SPOTLIGHT' : ad.priority === 'high' ? 'FEATURED' : 'STANDARD'}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
