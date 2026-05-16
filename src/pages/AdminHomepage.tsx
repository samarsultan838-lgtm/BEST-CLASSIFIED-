import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  LayoutTemplate,
  GripHorizontal,
  Star,
  Pin,
  Flame,
  Image as ImageIcon,
  Save,
  Plus
} from "lucide-react";

export default function AdminHomepage() {
  const { profile } = useAuth();
  
  // Dummy state for homepage settings
  const [sections, setSections] = useState([
    { id: '1', title: 'Top Featured Listings', type: 'featured', enabled: true },
    { id: '2', title: 'Pinned Premium Ads', type: 'premium', enabled: true },
    { id: '3', title: 'Trending Products', type: 'trending', enabled: true },
    { id: '4', title: 'Hero Banner', type: 'banner', enabled: true }
  ]);

  const [banners, setBanners] = useState([
    { id: 'b1', title: 'Summer Sale', url: 'https://picsum.photos/seed/b1/1200/400' },
    { id: 'b2', title: 'Premium Motors', url: 'https://picsum.photos/seed/b2/1200/400' }
  ]);

  const handleSaveLayout = () => {
    toast.success("Homepage layout saved successfully.");
  };

  const handleToggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Homepage Control</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manage Marketplace Sections & Banners</p>
        </div>
        <Button onClick={handleSaveLayout} className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black h-12 px-8 rounded-2xl">
           <Save className="w-5 h-5 mr-2" /> Save Layout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                  <div className="flex items-center gap-3">
                     <LayoutTemplate className="w-5 h-5 text-emerald-500" />
                     <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Section Ordering</CardTitle>
                  </div>
                  <CardDescription className="text-xs uppercase tracking-widest font-bold">Drag to reorder sections on the homepage (UI simulation)</CardDescription>
               </CardHeader>
               <CardContent className="p-8 space-y-4">
                  {sections.map((section, index) => (
                    <div key={section.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-emerald-500 transition-colors">
                       <div className="flex items-center gap-4">
                          <GripHorizontal className="w-5 h-5 text-slate-300 cursor-move hover:text-emerald-500" />
                          <div className="flex items-center gap-3">
                             {section.type === 'featured' && <Star className="w-5 h-5 text-blue-500" />}
                             {section.type === 'premium' && <Pin className="w-5 h-5 text-emerald-500" />}
                             {section.type === 'trending' && <Flame className="w-5 h-5 text-orange-500" />}
                             {section.type === 'banner' && <ImageIcon className="w-5 h-5 text-purple-500" />}
                             <div>
                                <h4 className="font-black text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">{section.title}</h4>
                                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">{section.type} • Position {index + 1}</p>
                             </div>
                          </div>
                       </div>
                       <Button 
                         variant={section.enabled ? "default" : "outline"}
                         onClick={() => handleToggleSection(section.id)}
                         className={`rounded-xl h-8 px-4 text-[9px] font-black uppercase tracking-widest ${section.enabled ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none' : 'text-slate-400 hover:text-slate-600'}`}
                       >
                          {section.enabled ? 'Visible' : 'Hidden'}
                       </Button>
                    </div>
                  ))}
               </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
               <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-purple-500" />
                        <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tighter">Banner Management</CardTitle>
                     </div>
                     <Button variant="outline" className="h-10 rounded-xl text-xs font-black uppercase tracking-widest border-slate-200 text-slate-600 hover:border-emerald-500">
                        <Plus className="w-4 h-4 mr-2" /> Add Banner
                     </Button>
                  </div>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {banners.map((banner) => (
                        <div key={banner.id} className="relative group rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm">
                           <div className="aspect-[3/1] relative">
                              <img src={banner.url} alt={banner.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                 <Button variant="secondary" size="sm" className="h-8 rounded-lg font-black text-[10px] uppercase tracking-widest">Edit</Button>
                                 <Button variant="destructive" size="sm" className="h-8 rounded-lg font-black text-[10px] uppercase tracking-widest">Remove</Button>
                              </div>
                           </div>
                           <div className="p-3 bg-white">
                              <p className="text-xs font-black text-slate-900 truncate">{banner.title}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-2xl rounded-[2rem] bg-emerald-950 text-white overflow-hidden">
               <CardHeader className="border-b border-white/10 p-8">
                  <CardTitle className="text-lg font-black uppercase tracking-widest text-emerald-500 flex items-center gap-3">
                     <Star className="w-5 h-5" /> Sponsored Listings
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-4">
                  <p className="text-xs text-slate-300 font-bold leading-relaxed mb-4">
                     Manually select properties to appear in the "Sponsored" section at the top of search results.
                  </p>
                  <Input placeholder="Search AD ID or Merchant..." className="bg-white/10 border-none rounded-xl h-12 text-white placeholder-slate-400" />
                  <div className="space-y-2 mt-4">
                     <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                        <span className="text-xs font-bold text-slate-200">Luxury Villa Dubai</span>
                        <Badge className="bg-red-500 text-white border-none text-[9px] uppercase hover:bg-red-600 cursor-pointer">Remove</Badge>
                     </div>
                     <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                        <span className="text-xs font-bold text-slate-200">Porsche 911 GT3</span>
                        <Badge className="bg-red-500 text-white border-none text-[9px] uppercase hover:bg-red-600 cursor-pointer">Remove</Badge>
                     </div>
                  </div>
                  <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black h-12 rounded-xl">Add New Sponsored Ad</Button>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
