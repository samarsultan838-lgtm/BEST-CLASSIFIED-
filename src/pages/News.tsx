import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Newspaper, TrendingUp, Clock, User, ArrowRight, Bookmark } from "lucide-react";
import { getArticles } from "@/src/lib/firestoreService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const data = await getArticles();
      setArticles(data || []);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* News Header */}
      <section className="bg-slate-900 border-b border-slate-800 py-20 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-500/10 blur-3xl rounded-full translate-x-1/2"></div>
         <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
               <Badge className="bg-orange-500 text-white border-none font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest text-xs">Market Insights</Badge>
               <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Trazot <span className="text-orange-500">Market News</span></h1>
               <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
                 Expert guides, buying strategies, and the latest marketplace trends to help you trade with confidence.
               </p>
            </motion.div>
         </div>
      </section>

      <div className="container mx-auto px-4 -mt-10 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Featured Content & Main Feed */}
          <div className="lg:col-span-8 space-y-12">
            {loading ? (
              <div className="space-y-10">
                 {[1, 2, 3].map(i => <Skeleton key={i} className="h-[400px] w-full rounded-3xl" />)}
              </div>
            ) : articles.length === 0 ? (
               <div className="bg-white rounded-3xl p-20 text-center shadow-lg border border-slate-100">
                  <Newspaper className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900">No articles published yet</h3>
                  <p className="text-slate-500 mt-2">Check back soon for latest market news!</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 gap-12">
                {articles.map((article, idx) => (
                  <motion.div 
                    key={article.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link to={`/news/${article.slug}`}>
                      <Card className="group overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[2.5rem] bg-white">
                        <div className="md:flex h-full">
                           <div className="md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden relative">
                              <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              <div className="absolute top-6 left-6">
                                 <Badge className="bg-orange-500 text-white border-none py-1.5 px-4 font-black rounded-xl shadow-lg">{article.category}</Badge>
                              </div>
                           </div>
                           <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                              <div>
                                 <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 5 min read</div>
                                    <div className="flex items-center gap-1.5"><User className="w-4 h-4" /> By Trazot Team</div>
                                 </div>
                                 <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight group-hover:text-orange-500 transition-colors">{article.title}</h2>
                                 <p className="text-slate-500 line-clamp-3 mb-8 leading-relaxed text-lg">{article.excerpt}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                 <Button variant="ghost" className="p-0 font-black text-orange-500 hover:bg-transparent group-hover:translate-x-2 transition-transform">
                                    Read Article <ArrowRight className="ml-2 w-5 h-5" />
                                 </Button>
                                 <Button variant="ghost" size="icon" className="text-slate-300 hover:text-orange-500"><Bookmark className="w-5 h-5" /></Button>
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
          <aside className="lg:col-span-4 space-y-10">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-orange-500 p-10 text-white overflow-hidden relative">
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
               <h3 className="text-2xl font-black mb-4 leading-tight">Expert Buying & Selling Tips</h3>
               <p className="text-orange-100 mb-8 opacity-90 leading-relaxed font-medium">Join 50K+ traders who get our curated weekly newsletter on the best deals and safety alerts.</p>
               <input 
                 className="w-full bg-white/20 border border-white/30 rounded-2xl p-4 text-white placeholder:text-white/60 mb-4 focus:outline-none focus:ring-2 focus:ring-white/40" 
                 placeholder="Your email address..."
               />
               <Button className="w-full bg-white text-orange-500 font-black hover:bg-slate-100 py-6 rounded-2xl shadow-lg">Subscribe Now</Button>
            </Card>

            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-50 space-y-10">
               <div>
                  <h4 className="flex items-center gap-2 font-black text-slate-900 mb-8 text-xl uppercase tracking-tight">
                     <TrendingUp className="text-orange-500 w-6 h-6" /> Popular Topics
                  </h4>
                  <div className="flex flex-wrap gap-3">
                     {["Buying Guides", "Scam Alerts", "Price Trends", "Success Stories", "Product Reviews", "Selling Strategy"].map(topic => (
                       <Badge key={topic} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-orange-500 hover:text-white transition-all cursor-pointer border-none py-2 px-4 rounded-xl font-bold">
                          {topic}
                       </Badge>
                     ))}
                  </div>
               </div>

               <div>
                 <h4 className="font-black text-slate-900 mb-8 text-xl uppercase tracking-tight">Follow Trazot</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="border-slate-100 bg-slate-50 font-bold hover:bg-orange-50 transition-colors h-14 rounded-2xl">Facebook</Button>
                    <Button variant="outline" className="border-slate-100 bg-slate-50 font-bold hover:bg-orange-50 transition-colors h-14 rounded-2xl">Twitter / X</Button>
                    <Button variant="outline" className="border-slate-100 bg-slate-50 font-bold hover:bg-orange-50 transition-colors h-14 rounded-2xl">Instagram</Button>
                    <Button variant="outline" className="border-slate-100 bg-slate-50 font-bold hover:bg-orange-50 transition-colors h-14 rounded-2xl">LinkedIn</Button>
                 </div>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
