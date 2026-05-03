import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Search, MapPin, TrendingUp, ShieldCheck, Zap, Newspaper, ArrowRight, Car, Home as HomeIcon, Smartphone, Briefcase, ShoppingBag, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { name: "Vehicles", icon: Car, color: "bg-blue-500", slug: "vehicles" },
  { name: "Property", icon: HomeIcon, color: "bg-green-500", slug: "property" },
  { name: "Mobiles", icon: Smartphone, color: "bg-purple-500", slug: "mobiles" },
  { name: "Electronics", icon: Laptop, color: "bg-orange-500", slug: "electronics" },
  { name: "Jobs", icon: Briefcase, color: "bg-red-500", slug: "jobs" },
  { name: "Fashion", icon: ShoppingBag, color: "bg-pink-500", slug: "fashion" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-950 overflow-hidden pt-24 pb-40">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-1/4 w-[600px] h-[600px] bg-emerald-500/30 blur-[160px] rounded-full"></div>
          <div className="absolute bottom-0 -right-1/4 w-[600px] h-[600px] bg-emerald-600/20 blur-[160px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-8">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-400 text-xs font-black uppercase tracking-widest leading-none">Pakistan's Fastest Marketplace</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
              Buy & Sell Anything, <span className="text-emerald-500">Anywhere.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
              The trusted marketplace for verified sellers and high-quality finds. Join thousands of users in Trazot community today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-2"
          >
            <div className="flex-grow flex items-center px-6 gap-3">
              <Search className="text-emerald-500 w-6 h-6" />
              <Input 
                className="border-none shadow-none focus-visible:ring-0 text-xl placeholder:text-slate-500 text-white bg-transparent" 
                placeholder="What are you looking for?" 
              />
            </div>
            <div className="hidden md:block w-px h-10 bg-white/10 self-center mx-2"></div>
            <div className="flex-shrink-0 flex items-center px-6 gap-3">
              <MapPin className="text-emerald-500 w-6 h-6" />
              <Input 
                className="border-none shadow-none focus-visible:ring-0 text-xl placeholder:text-slate-500 w-full md:w-48 text-white bg-transparent" 
                placeholder="Location" 
              />
            </div>
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-10 rounded-3xl font-black py-8 text-lg transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              Search Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Explore Categories</h2>
              <p className="text-slate-500 text-xl font-medium">Find exactly what you need across our diverse marketplace</p>
            </div>
            <Link to="/search" className="text-emerald-600 font-black flex items-center gap-2 hover:translate-x-2 transition-transform bg-emerald-50 px-6 py-3 rounded-2xl group">
              View all <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={`/search?category=${cat.slug}`} className="group flex flex-col items-center p-8 rounded-[2.5rem] bg-slate-50 hover:bg-emerald-500 hover:text-white transition-all duration-500 border border-slate-100 hover:border-emerald-400 hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)]">
                  <div className={`${cat.name === "Electronics" ? "bg-emerald-500" : cat.color} p-5 rounded-3xl mb-6 group-hover:bg-white group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                    <cat.icon className={`w-10 h-10 text-white ${cat.name === "Electronics" || true ? "group-hover:text-emerald-500" : ""}`} />
                  </div>
                  <span className="text-lg font-black tracking-tight">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ads */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 blur-[120px] rounded-full translate-x-1/2"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-end mb-16">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Featured Ads</h2>
            </div>
            <Link to="/search?featured=true" className="text-slate-500 hover:text-emerald-600 font-bold transition-colors">Browse all featured</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-none rounded-[2rem] bg-white">
                <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-emerald-500 text-emerald-950 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Featured</span>
                  </div>
                  <img src={`https://picsum.photos/seed/${i + 22}/600/450`} alt="Product" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <Button className="w-full bg-white text-emerald-600 font-black rounded-xl hover:bg-emerald-50">Quick View</Button>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-black text-slate-900 text-xl line-clamp-1 group-hover:text-emerald-500 transition-colors">Premium Gadget {i}</h3>
                    <p className="text-emerald-600 font-black text-xl">$299</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-6">
                    <MapPin className="w-4 h-4 text-emerald-500/50" />
                    <span>Gulberg, Lahore</span>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider">New</span>
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">2 hours ago</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Trazot */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-24">
            <Badge className="bg-emerald-100 text-emerald-600 border-none font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest text-xs">Trust Engineering</Badge>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter">Built for Trust & Safety</h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed">We provide the most secure environment for your commerce needs with advanced moderation and verified identity features.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="group text-center">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-emerald-200">
                <ShieldCheck className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Verified Sellers</h3>
              <p className="text-slate-500 text-lg leading-relaxed px-4 font-medium">Every pro-seller goes through a rigorous identity verification process for your peace of mind.</p>
            </div>
            <div className="group text-center">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-blue-200">
                <Zap className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Fast Approval</h3>
              <p className="text-slate-500 text-lg leading-relaxed px-4 font-medium">Our 24/7 moderation team ensures ads are reviewed and published within minutes, not days.</p>
            </div>
            <div className="group text-center">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl group-hover:shadow-emerald-200">
                <Newspaper className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">Market Intel</h3>
              <p className="text-slate-500 text-lg leading-relaxed px-4 font-medium">Stay ahead with our expert news section covering buying tips and latest market trends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-emerald-500 relative overflow-hidden mx-4 lg:mx-10 rounded-[3rem] mb-10">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-950/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-[0.85] uppercase">
            Got something to sell?<br />Join Trazot today and find your buyer!
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/post-ad">
              <Button size="lg" className="bg-emerald-950 text-white hover:bg-emerald-900 font-black px-16 py-10 text-2xl rounded-[2rem] shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter">
                POST AN AD FREE
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
