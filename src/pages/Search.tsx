import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search as SearchIcon, MapPin, Grid, List as ListIcon, Filter, SlidersHorizontal, ChevronDown, Tag, ArrowRight } from "lucide-react";
import { getAds } from "@/src/lib/firestoreService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const category = searchParams.get("category");
  const queryParam = searchParams.get("q");

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      // We filter by approved ads for public search
      const results = await getAds({ status: "approved", category: category || undefined });
      setAds(results || []);
      setLoading(false);
    };
    fetchAds();
  }, [category, queryParam]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Search Header */}
      <div className="bg-emerald-950 pt-20 pb-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 blur-[80px] rounded-full -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-10 tracking-tighter uppercase text-center">
              Find your next <span className="text-emerald-500 underline decoration-4 underline-offset-8">Great Find</span>
            </h1>
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-3 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-3">
              <div className="flex-grow relative flex items-center px-6 gap-4">
                <SearchIcon className="text-emerald-500 w-6 h-6 shrink-0" />
                <Input 
                  className="h-14 border-none shadow-none focus-visible:ring-0 text-xl placeholder:text-slate-500 text-white bg-transparent" 
                  placeholder="What are you looking for?"
                  defaultValue={queryParam || ""}
                />
              </div>
              <div className="hidden md:block w-px h-10 bg-white/10 self-center"></div>
              <div className="flex items-center gap-3 pr-2">
                <Select onValueChange={(v) => setSearchParams({ category: v as string })}>
                  <SelectTrigger className="h-14 w-full md:w-56 rounded-3xl border-none bg-white/5 text-white text-lg font-black uppercase tracking-widest px-6 focus:ring-0 shadow-inner">
                      <SelectValue placeholder="Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-emerald-900 bg-emerald-950 text-emerald-100">
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="vehicles">Vehicles</SelectItem>
                      <SelectItem value="property">Property</SelectItem>
                      <SelectItem value="mobiles">Mobiles</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="h-14 px-10 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-3xl font-black uppercase tracking-tighter text-lg shadow-xl shadow-emerald-500/20 transition-transform active:scale-95">Search</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 space-y-12 flex-shrink-0">
             <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-white sticky top-24">
               <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-widest">
                 <SlidersHorizontal className="w-6 h-6 text-emerald-500" /> Filters
               </h3>
               
               <div className="space-y-10">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 block">Price Landscape</label>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-black">$</span>
                        <Input placeholder="Min Price" className="h-12 pl-10 rounded-2xl border-slate-100 bg-slate-50 font-bold focus:ring-emerald-500" />
                      </div>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-black">$</span>
                        <Input placeholder="Max Price" className="h-12 pl-10 rounded-2xl border-slate-100 bg-slate-50 font-bold focus:ring-emerald-500" />
                      </div>
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 block">Quality Status</label>
                    <div className="space-y-3">
                       {["New Arrival", "Like New", "Certified Used", "Value Selection"].map(cond => (
                         <label key={cond} className="flex items-center gap-4 cursor-pointer group">
                            <div className="w-6 h-6 rounded-lg border-2 border-slate-100 group-hover:border-emerald-500 transition-all flex items-center justify-center p-1">
                               <div className="w-full h-full bg-emerald-500 rounded-sm scale-0 group-hover:scale-100 transition-transform"></div>
                            </div>
                            <span className="text-sm font-black text-slate-500 group-hover:text-emerald-600 transition-colors uppercase tracking-widest">{cond}</span>
                         </label>
                       ))}
                    </div>
                 </div>

                 <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-100 text-slate-400 font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all">Reset All</Button>
               </div>
             </div>
          </aside>

          {/* Results Area */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
               <div>
                 <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                   {loading ? "Analyzing..." : `${ads.length} listings`}
                   {category && category !== 'all' && <span className="text-emerald-500 ml-2">[{category}]</span>}
                 </h2>
               </div>
               <div className="flex items-center gap-6 w-full md:w-auto">
                 <div className="flex bg-white rounded-2xl p-1.5 shadow-xl border border-white">
                    <Button 
                      variant="ghost"
                      size="icon" 
                      onClick={() => setViewMode("grid")}
                      className={`w-12 h-12 rounded-xl transition-all ${viewMode === "grid" ? "bg-emerald-500 text-emerald-950 shadow-lg" : "text-slate-300 hover:text-emerald-500"}`}
                    >
                      <Grid className="w-6 h-6" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setViewMode("list")}
                      className={`w-12 h-12 rounded-xl transition-all ${viewMode === "list" ? "bg-emerald-500 text-emerald-950 shadow-lg" : "text-slate-300 hover:text-emerald-500"}`}
                    >
                      <ListIcon className="w-6 h-6" />
                    </Button>
                 </div>
                 <Select defaultValue="newest">
                   <SelectTrigger className="w-full md:w-56 h-14 rounded-2xl border-none bg-white shadow-xl text-slate-600 font-black uppercase tracking-widest text-xs px-6">
                      <SelectValue placeholder="Sort" />
                   </SelectTrigger>
                   <SelectContent className="rounded-2xl">
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
            </div>

            {loading ? (
              <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-8`}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-96 w-full rounded-[2.5rem] bg-white border border-white shadow-sm" />
                ))}
              </div>
            ) : ads.length === 0 ? (
              <div className="bg-white rounded-[4rem] p-32 text-center shadow-2xl border border-white">
                 <div className="bg-slate-50 w-32 h-32 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                    <SearchIcon className="w-12 h-12 text-slate-200" />
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">No results matched</h3>
                 <p className="text-slate-400 mb-12 max-w-sm mx-auto font-medium text-lg">Try adjusting your filters or search terms to find what you're looking for.</p>
                 <Button onClick={() => setSearchParams({})} size="lg" variant="outline" className="h-16 px-12 rounded-3xl border-slate-100 text-slate-400 font-black uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all">Clear Search</Button>
              </div>
            ) : (
              <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-10`}>
                <AnimatePresence mode="popLayout">
                  {ads.map((ad, idx) => (
                    <motion.div
                      key={ad.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                    >
                      <Link to={`/ad/${ad.id}/${ad.slug || 'view'}`}>
                        <Card className={`group overflow-hidden border-none shadow-2xl hover:shadow-[0_40px_80px_rgba(16,185,129,0.2)] transition-all duration-700 rounded-[3rem] h-full bg-white ${viewMode === "list" ? "flex flex-col md:flex-row" : "flex flex-col"}`}>
                          <div className={`${viewMode === "list" ? "md:w-80 h-auto aspect-square shrink-0" : "aspect-[4/3]"} overflow-hidden relative bg-slate-100`}>
                            <img src={ad.images?.[0]} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute top-6 left-6">
                               <Badge className="bg-emerald-500/90 backdrop-blur text-emerald-950 border-none px-4 py-2 font-black rounded-xl shadow-xl text-[10px] uppercase tracking-widest">{ad.category}</Badge>
                            </div>
                          </div>
                          <CardContent className="p-10 flex flex-col justify-between flex-grow">
                            <div>
                               <div className="flex justify-between items-start gap-4 mb-6">
                                  <h3 className="text-xl font-black text-slate-900 line-clamp-2 leading-[0.95] tracking-tight uppercase group-hover:text-emerald-600 transition-colors">{ad.title}</h3>
                                  <span className="text-2xl font-black text-emerald-600 tracking-tighter shrink-0">${ad.price}</span>
                               </div>
                               <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 font-black uppercase tracking-widest mb-8">
                                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-500/50" /> {ad.location}</div>
                                  <Badge variant="outline" className="rounded-xl border-slate-100 text-slate-500 px-3 py-1">{ad.condition}</Badge>
                               </div>
                            </div>
                            <div className="pt-8 border-t border-slate-50 flex items-center justify-between mt-auto">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-xs">{ad.userName?.charAt(0)}</div>
                                  <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{ad.userName}</span>
                               </div>
                               <span className="text-[10px] uppercase font-black tracking-widest text-slate-200">2h ago</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
