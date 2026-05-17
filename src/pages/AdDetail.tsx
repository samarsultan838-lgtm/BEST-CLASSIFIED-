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
import { getAdById } from "@/lib/firestoreService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import SEO from "@/components/SEO";

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
    <div className="bg-white min-h-screen font-sans pb-32">
      <SEO 
        title={`${ad.title} | ${ad.category} in ${ad.location}`}
        description={`${ad.description?.substring(0, 160)}... Buy ${ad.title} for $${ad.price}. Verified seller: ${ad.userName}.`}
        keywords={`${ad.category}, ${ad.location}, ${ad.title}, classifieds, buy sell, ${ad.condition}`}
        image={ad.images?.[0]}
        url={window.location.href}
        type="article"
      />
      
      {/* Mobile Top Nav */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40 lg:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
           <Button variant="ghost" className="gap-2 text-emerald-900 font-bold" onClick={() => navigate(-1)}>
             <ChevronLeft className="w-5 h-5" /> Back
           </Button>
           <img src="/vite.svg" alt="Logo" className="w-8 h-8 opacity-60" />
        </div>
      </div>

      <div className="container mx-auto max-w-5xl lg:px-4 lg:mt-8">
        
        {/* Full width Image Gallery on mobile, rounded on desktop */}
        <div className="w-full relative lg:rounded-3xl overflow-hidden bg-black group h-[30vh] lg:h-[60vh]">
          <img src={ad.images?.[0]} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute bottom-4 right-4 bg-black/60 text-white font-bold px-3 py-1 rounded-md flex items-center gap-2 text-sm z-10">
            <Video className="w-4 h-4" /> {ad.images?.length || 1}
          </div>
          {ad.featured && (
            <Badge className="absolute top-4 left-4 bg-orange-500 text-white border-none px-4 py-1.5 font-bold shadow-lg rounded-md uppercase text-xs z-10">
              FEATURED
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="px-4 lg:px-0 py-6">
          
          <div className="flex items-start justify-between">
             <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">PKR {Number(ad.price).toLocaleString()}</h1>
                <p className="text-slate-600 text-sm lg:text-base mt-2 max-w-3xl leading-relaxed">{ad.title} - {[ad.location, ad.city, ad.state].filter(Boolean).join(", ")}</p>
             </div>
             <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="text-emerald-700 hover:bg-emerald-50 rounded-full h-12 w-12"><Heart className="w-6 h-6" /></Button>
                <Button variant="ghost" size="icon" className="text-emerald-700 hover:bg-emerald-50 rounded-full h-12 w-12"><Share2 className="w-6 h-6" /></Button>
             </div>
          </div>

          <div className="flex items-center gap-4 mt-4 font-bold text-slate-700">
            {(ad.area || ad.propertyType) && (
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" /> {ad.area} {ad.areaUnit && <span className="capitalize">{ad.areaUnit.replace('_', ' ')}</span>} {ad.propertyType && <span className="capitalize text-slate-400 font-normal">({ad.propertyType.replace('_', ' ')})</span>}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">Added: 12 hours ago</p>

          {/* Action Row */}
          <div className="grid grid-cols-4 gap-2 mt-8 sticky lg:relative top-[56px] lg:top-0 bg-white z-30 py-3 lg:py-0">
             <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold h-12 px-0 hover:text-emerald-800">EMAIL</Button>
             <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold h-12 px-0 hover:text-emerald-800">SMS</Button>
             <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-0 text-xs sm:text-sm"><Phone className="mr-1 sm:mr-2 w-4 sm:w-5 h-4 sm:h-5" /> CALL</Button>
             <Button className="bg-[#25D366] hover:bg-[#1DA851] text-white font-bold h-12 px-0 text-xs sm:text-sm"><MessageCircle className="mr-1 sm:mr-2 w-4 sm:w-5 h-4 sm:h-5" /> WhatsApp</Button>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-200 overflow-x-auto mt-6 no-scrollbar">
            <button className="px-6 py-4 border-b-2 border-emerald-600 font-bold text-emerald-600 flex flex-col items-center gap-1.5 focus:outline-none">
               <Info className="w-5 h-5"/>
               <span className="text-xs uppercase tracking-wider">Overview</span>
            </button>
            <button className="px-6 py-4 font-medium text-slate-500 flex flex-col items-center gap-1.5 hover:text-emerald-600 transition-colors focus:outline-none">
               <MapPin className="w-5 h-5"/>
               <span className="text-xs uppercase tracking-wider">Nearby</span>
            </button>
            <button className="px-6 py-4 font-medium text-slate-500 flex flex-col items-center gap-1.5 hover:text-emerald-600 transition-colors focus:outline-none whitespace-nowrap">
               <ShieldCheck className="w-5 h-5"/>
               <span className="text-xs uppercase tracking-wider">Price Index</span>
            </button>
          </div>

          {/* Title Header */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Details</h2>
            
            <p className="text-slate-600 font-medium leading-relaxed uppercase tracking-wider text-sm mb-6">{ad.title?.toUpperCase()}</p>
            
            <p className="text-emerald-600 font-semibold cursor-pointer hover:underline mb-6 text-sm">Read Description</p>
            <div className="text-slate-600 leading-relaxed font-medium mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100 italic" style={{display: 'block'}}>
               {ad.description}
            </div>

            {/* Details Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
               <div className="flex border-b border-slate-100 py-3.5 items-center">
                 <div className="w-40 flex items-center gap-3 text-slate-500 font-medium">
                   <Heart className="w-4 h-4 text-emerald-600" /> Type
                 </div>
                 <div className="font-bold text-slate-900 capitalize">{ad.category} {ad.propertyType ? `- ${ad.propertyType}` : ''}</div>
               </div>
               
               <div className="flex border-b border-slate-100 py-3.5 items-center">
                 <div className="w-40 flex items-center gap-3 text-slate-500 font-medium">
                   <Heart className="w-4 h-4 text-emerald-600" /> Price
                 </div>
                 <div className="font-bold text-slate-900">PKR {Number(ad.price).toLocaleString()}</div>
               </div>

               {ad.area && (
                 <div className="flex border-b border-slate-100 py-3.5 items-center">
                   <div className="w-40 flex items-center gap-3 text-slate-500 font-medium">
                     <Heart className="w-4 h-4 text-emerald-600" /> Area
                   </div>
                   <div className="font-bold text-slate-900">{ad.area} {ad.areaUnit && <span className="capitalize">{ad.areaUnit.replace('_', ' ')}</span>}</div>
                 </div>
               )}

               {ad.purpose && (
                 <div className="flex border-b border-slate-100 py-3.5 items-center">
                   <div className="w-40 flex items-center gap-3 text-slate-500 font-medium">
                     <Heart className="w-4 h-4 text-emerald-600" /> Purpose
                   </div>
                   <div className="font-bold text-slate-900 capitalize">{ad.purpose}</div>
                 </div>
               )}

               <div className="flex border-b border-slate-100 py-3.5 items-center">
                 <div className="w-40 flex items-center gap-3 text-slate-500 font-medium">
                   <Clock className="w-4 h-4 text-emerald-600" /> Added
                 </div>
                 <div className="font-bold text-slate-900">12 hours ago</div>
               </div>

               {(ad.location || ad.city) && (
                 <div className="flex border-b border-slate-100 py-3.5 items-center">
                   <div className="w-40 flex items-center gap-3 text-slate-500 font-medium">
                     <MapPin className="w-4 h-4 text-emerald-600" /> Location
                   </div>
                   <div className="font-bold text-slate-900 line-clamp-1">{[ad.location, ad.city].filter(Boolean).join(", ")}</div>
                 </div>
               )}
            </div>

            {/* Extended Features (if any) */}
            {ad.features && ad.features.length > 0 && (
               <div className="mt-8">
                 <h2 className="text-xl font-bold text-slate-900 mb-6">Features & Amenities</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-4">
                   {ad.features.map((feature: string) => (
                      <div key={feature} className="flex items-center gap-3">
                        <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-semibold text-slate-700 capitalize">{feature.replace(/_/g, ' ')}</span>
                      </div>
                   ))}
                 </div>
               </div>
            )}
            
            {/* Agent Section */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Agent Network - {ad.userName}</h2>
              <div className="border border-slate-200/60 shadow-sm p-6 flex flex-col md:flex-row md:items-center gap-6 rounded-2xl relative bg-white">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0c2f58] to-[#1a123f] flex items-center justify-center text-white font-black text-4xl rounded-lg shadow-lg shrink-0">
                   {ad.userName?.charAt(0).toUpperCase()}E
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-medium tracking-wide mb-1">Posted By</p>
                  <p className="font-bold text-xl text-slate-900">{ad.userName} <span className="inline-flex ml-2 items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600">VERIFIED INC</span></p>
                  <Link to={`/seller/${ad.userId}`} className="text-emerald-600 underline font-medium text-sm mt-3 inline-block">View all listings by this merchant</Link>
                </div>
              </div>
              
              {/* Agent Actions */}
              <div className="grid grid-cols-4 gap-2 mt-4 lg:hidden">
                 <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold h-12 px-0 text-xs">EMAIL</Button>
                 <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold h-12 px-0 text-xs">SMS</Button>
                 <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-0 text-xs"><Phone className="mr-1 w-4 h-4" /> CALL</Button>
                 <Button className="bg-[#25D366] hover:bg-[#1DA851] text-white font-bold h-12 px-0 text-xs"><MessageCircle className="mr-1 w-4 h-4" /> WA</Button>
              </div>
            </div>

            {videoEmbedUrl && (
              <div className="mt-12 space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Property Tour</h3>
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-slate-100">
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
          </div>
        </div>
      </div>
    </div>
  );
}
