import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Search, MapPin, TrendingUp, ShieldCheck, Zap, Newspaper, ArrowRight, Car, Home as HomeIcon, Smartphone, Briefcase, ShoppingBag, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
      <section className="relative bg-slate-900 overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-orange-500 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-blue-500 blur-[120px] rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Buy & Sell Anything, <span className="text-orange-500">Anywhere.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              The trusted marketplace for verified sellers and high-quality finds. Join thousands of users in Trazot community today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2"
          >
            <div className="flex-grow flex items-center px-4 gap-2">
              <Search className="text-slate-400 w-5 h-5" />
              <Input 
                className="border-none shadow-none focus-visible:ring-0 text-lg placeholder:text-slate-400" 
                placeholder="What are you looking for?" 
              />
            </div>
            <div className="w-full md:w-px h-px md:h-8 bg-slate-200 self-center"></div>
            <div className="flex-shrink-0 flex items-center px-4 gap-2">
              <MapPin className="text-slate-400 w-5 h-5" />
              <Input 
                className="border-none shadow-none focus-visible:ring-0 text-lg placeholder:text-slate-400 w-40" 
                placeholder="Location" 
              />
            </div>
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 px-8 rounded-xl font-bold py-7">
              Search Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Explore Categories</h2>
              <p className="text-slate-500">Find exactly what you need across our diverse marketplace</p>
            </div>
            <Link to="/search" className="text-orange-500 font-semibold flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={`/search?category=${cat.slug}`} className="group flex flex-col items-center p-6 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-100">
                  <div className={`${cat.color} p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="font-bold text-slate-900">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ads */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-orange-500 w-8 h-8" />
              <h2 className="text-3xl font-bold text-slate-900">Featured Ads</h2>
            </div>
            <Link to="/search?featured=true" className="text-slate-600 hover:text-orange-500 font-medium">Browse featured</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-none">
                <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">Featured</span>
                  </div>
                  <img src={`https://picsum.photos/seed/${i + 10}/400/300`} alt="Product" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-orange-500 transition-colors">Premium Gadget Package {i}</h3>
                    <p className="text-orange-600 font-black">$299</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-4">
                    <MapPin className="w-3 h-3" />
                    <span>Gulberg, Lahore</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">New</span>
                    <span className="text-slate-400 text-[10px]">2 hours ago</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Trazot */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Built for Trust & Safety</h2>
            <p className="text-slate-500 text-lg">We provide the most secure environment for your commerce needs with advanced moderation and verified identity features.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Verified Sellers</h3>
              <p className="text-slate-500">Every pro-seller goes through a rigorous identity verification process for your peace of mind.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Fast Approval</h3>
              <p className="text-slate-500">Our 24/7 moderation team ensures ads are reviewed and published within minutes, not days.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Newspaper className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Market Intelligence</h3>
              <p className="text-slate-500">Stay ahead with our expert news section covering buying tips and latest market trends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-500 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-black text-white mb-6 leading-tight">
            Got something to sell?<br />Join Trazot today and find your buyer!
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/post-ad">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-slate-100 font-black px-12 py-8 text-xl rounded-2xl shadow-xl">
                POST AN AD FREE
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
