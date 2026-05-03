import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, Calendar, User, Share2, MessageCircle, ArrowRight, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  // In a real app we'd fetch by slug. For now we use hardcoded or search local if we have it
  // But since it's a demo, I'll provide a placeholder layout

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <Button variant="ghost" className="mb-10 gap-2 text-slate-500 font-bold" onClick={() => navigate(-1)}>
             <ChevronLeft className="w-4 h-4" /> Back to News
          </Button>

          <div className="space-y-6 mb-12">
             <Badge className="bg-orange-100 text-orange-600 border-none font-black px-4 py-1.5 rounded-xl uppercase tracking-widest text-xs">Buying Tips & Guides</Badge>
             <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">How to spot and avoid online marketplace scams in 2025</h1>
             <div className="flex flex-wrap items-center gap-10 pt-4 border-y border-slate-50 py-6">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                   <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Author</p>
                      <p className="font-bold text-slate-900">Trazot Editorial Team</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-orange-500">
                      <Calendar className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Published</p>
                      <p className="font-bold text-slate-900">May 15, 2025</p>
                   </div>
                </div>
                <div className="flex items-center gap-6 ml-auto">
                   <Button variant="ghost" size="icon" className="text-slate-400 hover:text-orange-500"><Share2 className="w-5 h-5" /></Button>
                   <Button variant="ghost" size="icon" className="text-slate-400 hover:text-orange-500"><Bookmark className="w-5 h-5" /></Button>
                </div>
             </div>
          </div>

          <div className="aspect-video bg-slate-100 rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl relative">
             <img src="https://picsum.photos/seed/safety/1200/800" alt="Safety" className="w-full h-full object-cover" />
          </div>

          <div className="prose prose-lg max-w-none prose-slate prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-orange-500 prose-strong:text-slate-900">
             <p className="text-xl text-slate-500 font-medium italic border-l-4 border-orange-500 pl-6 my-10">
               Marketplace safety is our top priority. As more commerce moves online, being equipped with the right knowledge is your best defense against bad actors.
             </p>
             
             <h2>The anatomy of a typical marketplace scam</h2>
             <p>
               Most scams follow a predictable pattern. They often involve a sense of urgency, an offer that seems too good to be true, and a request for payment outside of the platform’s secure systems. Understanding these "red flags" can save you from a stressful situation.
             </p>
             
             <ul>
               <li><strong>Unrealistic Prices:</strong> If a brand new iPhone is listed for 20% of its market value, proceed with extreme caution.</li>
               <li><strong>Urgent Pressure:</strong> Scammers often claim they have multiple buyers or are leaving the country today to force you into a quick decision.</li>
               <li><strong>Off-Platform Communication:</strong> Always try to keep your messages within Trazot’s chat system for your own protection.</li>
             </ul>

             <h3>Always meet in public places</h3>
             <p>
               For physical items, never meet in private or secluded locations. Prefer brightly lit, high-traffic public areas like malls, police station "safe zones," or busy coffee shops.
             </p>

             <div className="bg-orange-500 p-10 rounded-[2rem] my-12 text-white shadow-xl">
                <h3 className="text-white mt-0 mb-4">Did you know?</h3>
                <p className="mb-0 text-orange-50">Trazot Verified Sellers have a 99.9% higher satisfaction rate. We verify government identification and banking details for all our pro-merchants.</p>
             </div>

             <h2>Reporting suspicious behavior</h2>
             <p>
               If you encounter an ad or a user that doesn't feel right, use the "Report" button on the ad page. Our moderation team reviews all reports within 2 hours. Your vigilance helps keep the entire community safe.
             </p>
          </div>

          <div className="mt-20 pt-10 border-t border-slate-100">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Related Articles</h3>
                <Link to="/news" className="text-orange-500 font-bold flex items-center gap-1 group">
                   Visit newsroom <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map(i => (
                  <Link key={i} to="/news/some-article" className="group">
                    <Card className="border-none shadow-lg rounded-3xl overflow-hidden group-hover:shadow-xl transition-all">
                       <div className="aspect-[2/1] bg-slate-100 overflow-hidden">
                          <img src={`https://picsum.photos/seed/${i + 50}/600/300`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       </div>
                       <CardContent className="p-6">
                          <h4 className="font-bold text-slate-900 group-hover:text-orange-500 transition-colors">How to take professional photos for your ads</h4>
                       </CardContent>
                    </Card>
                  </Link>
                ))}
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
