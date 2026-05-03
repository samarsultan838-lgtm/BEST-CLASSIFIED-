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
    <div className="bg-slate-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                className="pl-12 h-14 rounded-2xl border-slate-200 text-lg shadow-sm focus:ring-orange-500" 
                placeholder="Search for ads..."
                defaultValue={queryParam || ""}
              />
            </div>
            <div className="flex gap-2">
               <Select onValueChange={(v) => setSearchParams({ category: v as string })}>
                 <SelectTrigger className="h-14 w-full md:w-48 rounded-2xl border-slate-200">
                    <SelectValue placeholder="All Categories" />
                 </SelectTrigger>
                 <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="vehicles">Vehicles</SelectItem>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="mobiles">Mobiles</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                 </SelectContent>
               </Select>
               <Button className="h-14 px-8 bg-orange-500 hover:bg-orange-600 rounded-2xl font-bold">Search</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
             <div>
               <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                 <SlidersHorizontal className="w-5 h-5 text-orange-500" /> Filters
               </h3>
               
               <div className="space-y-6">
                 <div>
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Price Range</label>
                   <div className="grid grid-cols-2 gap-2">
                     <Input placeholder="Min" className="h-10 rounded-lg border-slate-200" />
                     <Input placeholder="Max" className="h-10 rounded-lg border-slate-200" />
                   </div>
                 </div>

                 <div>
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Condition</label>
                   <div className="space-y-2">
                      {["New", "Like New", "User - Good", "Fair"].map(cond => (
                        <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                           <div className="w-5 h-5 rounded border-2 border-slate-200 group-hover:border-orange-500 transition-colors"></div>
                           <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900">{cond}</span>
                        </label>
                      ))}
                   </div>
                 </div>

                 <div>
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Posted By</label>
                   <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                         <div className="w-5 h-5 rounded border-2 border-slate-200"></div>
                         <span className="text-sm text-slate-600 font-medium">Verified Sellers</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                         <div className="w-5 h-5 rounded border-2 border-slate-200"></div>
                         <span className="text-sm text-slate-600 font-medium">Individual</span>
                      </label>
                   </div>
                 </div>
               </div>
             </div>
          </aside>

          {/* Results Area */}
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-8">
               <div>
                 <h2 className="text-2xl font-black text-slate-900">
                   {loading ? "Searching..." : `${ads.length} Ads Found`}
                   {category && <span className="text-orange-500"> in {category}</span>}
                 </h2>
               </div>
               <div className="flex items-center gap-4">
                 <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                    <Button 
                      variant={viewMode === "grid" ? "default" : "ghost"} 
                      size="icon" 
                      onClick={() => setViewMode("grid")}
                      className={`w-10 h-10 rounded-lg ${viewMode === "grid" ? "bg-orange-500 text-white" : "text-slate-400"}`}
                    >
                      <Grid className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant={viewMode === "list" ? "default" : "ghost"} 
                      size="icon" 
                      onClick={() => setViewMode("list")}
                      className={`w-10 h-10 rounded-lg ${viewMode === "list" ? "bg-orange-500 text-white" : "text-slate-400"}`}
                    >
                      <ListIcon className="w-5 h-5" />
                    </Button>
                 </div>
                 <Select defaultValue="newest">
                   <SelectTrigger className="w-40 rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Sort by" />
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
            </div>

            {loading ? (
              <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Skeleton key={i} className="h-80 w-full rounded-2xl" />
                ))}
              </div>
            ) : ads.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 text-center shadow-sm">
                 <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <SearchIcon className="w-10 h-10 text-slate-300" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mb-2">No results found</h3>
                 <p className="text-slate-500 mb-8 max-w-sm mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                 <Button onClick={() => setSearchParams({})} variant="outline" className="rounded-xl border-slate-200">Clear all filters</Button>
              </div>
            ) : (
              <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}>
                <AnimatePresence mode="popLayout">
                  {ads.map((ad, idx) => (
                    <motion.div
                      key={ad.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <Link to={`/ad/${ad.id}/${ad.slug || 'view'}`}>
                        <Card className={`group overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-300 rounded-3xl h-full bg-white ${viewMode === "list" ? "flex flex-row" : "flex flex-col"}`}>
                          <div className={`${viewMode === "list" ? "w-64 h-auto aspect-square shrink-0" : "aspect-[4/3]"} overflow-hidden relative bg-slate-100`}>
                            <img src={ad.images?.[0]} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 left-4">
                               <Badge className="bg-white/90 backdrop-blur text-slate-900 border-none px-3 py-1 font-bold shadow-sm">{ad.category}</Badge>
                            </div>
                          </div>
                          <CardContent className="p-6 flex flex-col justify-between flex-grow">
                            <div>
                               <div className="flex justify-between items-start gap-4 mb-3">
                                  <h3 className="text-lg font-black text-slate-900 line-clamp-2 leading-tight group-hover:text-orange-500 transition-colors">{ad.title}</h3>
                                  <span className="text-xl font-black text-orange-600">${ad.price}</span>
                               </div>
                               <div className="flex items-center gap-4 text-xs text-slate-400 font-bold mb-4">
                                  <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ad.location}</div>
                                  <Badge variant="outline" className="rounded-full border-slate-100 text-[10px] text-slate-500">{ad.condition}</Badge>
                               </div>
                            </div>
                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                               <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                                  <span className="text-[11px] font-black text-slate-800">{ad.userName}</span>
                               </div>
                               <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">2 hours ago</span>
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
