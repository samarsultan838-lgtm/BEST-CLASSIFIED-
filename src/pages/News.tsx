import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Newspaper, TrendingUp, Clock, ArrowRight, Bookmark, Eye } from "lucide-react";
import { getArticles, Article } from "../lib/newsService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "../components/SEO";
import { format } from "date-fns";

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles(true, 12);
      setArticles(data || []);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <SEO 
        title="Intelligence Reports | Market News" 
        description="Stay updated with the latest market trends, intelligence reports, and expert analysis on Trazot News."
        type="website"
      />
      {/* News Header */}
      <section className="bg-slate-950 border-b border-emerald-900/50 py-32 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[500px] h-full bg-emerald-500/10 blur-[120px] rounded-full translate-x-1/2"></div>
         <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center"
            >
               <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black px-4 py-2 rounded-full mb-8 uppercase tracking-[0.2em] text-[10px]">Market Intelligence</Badge>
               <h1 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.85] uppercase">
                 Trazot <span className="text-emerald-500">Insights</span>
               </h1>
               <p className="text-slate-400 text-xl md:text-2xl leading-relaxed font-medium">
                 The definitive guide to the Pakistani marketplace. Expert strategies and trend analysis.
               </p>
            </motion.div>
         </div>
      </section>

      <div className="container mx-auto px-4 -mt-20 pb-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Featured Content & Main Feed */}
          <div className="lg:col-span-8 space-y-16">
            {loading ? (
              <div className="grid grid-cols-1 gap-12">
                 {[1, 2, 3].map(i => <Skeleton key={i} className="h-[500px] w-full rounded-[3rem] bg-white/50 border border-white" />)}
              </div>
            ) : articles.length === 0 ? (
               <div className="bg-white rounded-[3rem] p-32 text-center shadow-2xl border border-white">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10">
                    <Newspaper className="w-12 h-12 text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">No articles found</h3>
                  <p className="text-slate-500 mt-4 text-lg font-medium">Check back soon for latest market news!</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 gap-16">
                {articles.map((article, idx) => (
                  <motion.div 
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.8 }}
                  >
                    <Link to={`/news/${article.slug}`}>
                      <Card className="group overflow-hidden border-none shadow-2xl hover:shadow-[0_30px_60px_rgba(16,185,129,0.15)] transition-all duration-500 rounded-[3rem] bg-white">
                        <div className="md:flex h-full">
                           <div className="md:w-1/2 aspect-[4/5] md:aspect-auto overflow-hidden relative">
                              <img src={article.image || "https://picsum.photos/seed/news/800/600"} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                              <div className="absolute top-8 left-8">
                                 <Badge className="bg-emerald-500 text-emerald-950 border-none py-2 px-6 font-black rounded-full shadow-2xl uppercase tracking-widest text-[10px]">{article.category}</Badge>
                              </div>
                           </div>
                           <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-between bg-white relative">
                              <div>
                                 <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">
                                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-500" /> 5 min read</div>
                                    <div className="flex items-center gap-2 font-black text-emerald-600/60">#{article.tags?.[0] || 'MarketPulse'}</div>
                                 </div>
                                 <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-[0.95] tracking-tighter uppercase group-hover:text-emerald-500 transition-colors">{article.title}</h2>
                                 <p className="text-slate-500 line-clamp-3 mb-10 leading-relaxed text-lg font-medium opacity-80">{article.excerpt || article.content.substring(0, 150) + "..."}</p>
                              </div>
                              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 font-black text-[9px]">{article.authorName?.charAt(0) || 'A'}</div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{article.publishedAt?.toDate ? format(article.publishedAt.toDate(), "MMM dd, yyyy") : "RECENT"}</span>
                                 </div>
                                 <Button variant="ghost" className="p-0 font-black text-emerald-600 hover:bg-transparent group-hover:translate-x-2 transition-transform text-xs uppercase tracking-widest">
                                    Access Intel <ArrowRight className="ml-2 w-4 h-4" />
                                 </Button>
                              </div>
                           </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <Card className="rounded-[3rem] border-none shadow-2xl bg-emerald-500 p-12 text-white overflow-hidden relative">
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-950/20 rounded-full blur-[80px]"></div>
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-[60px]"></div>
               
               <div className="relative z-10">
                 <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-10">
                   <TrendingUp className="w-8 h-8 text-white" />
                 </div>
                 <h3 className="text-3xl font-black mb-6 leading-[0.9] tracking-tighter uppercase">Weekly Market Briefing</h3>
                 <p className="text-emerald-100 mb-10 opacity-90 leading-relaxed font-bold text-lg">Join 50K+ expert traders who get curated market data every Sunday.</p>
                 <div className="space-y-4">
                   <div className="bg-emerald-400 group p-2 rounded-[2rem] flex items-center border border-emerald-300 shadow-inner">
                     <input 
                       className="flex-grow bg-transparent border-none rounded-2xl p-4 text-white placeholder:text-emerald-950/40 text-lg font-black focus:outline-none" 
                       placeholder="Email Address"
                     />
                     <Button className="shrink-0 bg-emerald-950 text-white font-black hover:bg-emerald-900 py-8 px-8 rounded-2xl shadow-xl uppercase tracking-tighter">
                       Join Now
                     </Button>
                   </div>
                   <p className="text-center text-[10px] font-black uppercase tracking-widest text-emerald-950/40">🔒 Strictly No Spam. Ever.</p>
                 </div>
               </div>
            </Card>

            <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-white space-y-16">
               <div>
                  <h4 className="flex items-center gap-3 font-black text-slate-900 mb-10 text-xl uppercase tracking-widest">
                     <div className="w-2 h-8 bg-emerald-500 rounded-full"></div> Hot Topics
                  </h4>
                  <div className="flex flex-wrap gap-4">
                     {["Buying Guides", "Scam Alerts", "Price Trends", "Success Stories", "Product Reviews", "Selling Strategy"].map(topic => (
                       <Badge key={topic} variant="secondary" className="bg-slate-50 text-slate-500 hover:bg-emerald-500 hover:text-white transition-all duration-300 cursor-pointer border-none py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm">
                          {topic}
                       </Badge>
                     ))}
                  </div>
               </div>

               <div>
                 <h4 className="font-black text-slate-900 mb-10 text-xl uppercase tracking-widest flex items-center gap-3">
                   <div className="w-2 h-8 bg-blue-500 rounded-full"></div> Expert Channels
                 </h4>
                 <div className="grid grid-cols-1 gap-4">
                    <Button variant="outline" className="border-slate-100 bg-slate-50 font-black hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all h-20 rounded-[1.5rem] text-lg uppercase tracking-tighter flex justify-between px-8">
                      Facebook <span>→</span>
                    </Button>
                    <Button variant="outline" className="border-slate-100 bg-slate-50 font-black hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all h-20 rounded-[1.5rem] text-lg uppercase tracking-tighter flex justify-between px-8">
                      Twitter / X <span>→</span>
                    </Button>
                    <Button variant="outline" className="border-slate-100 bg-slate-50 font-black hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all h-20 rounded-[1.5rem] text-lg uppercase tracking-tighter flex justify-between px-8">
                      Instagram <span>→</span>
                    </Button>
                 </div>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
