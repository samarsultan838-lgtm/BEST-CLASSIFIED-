import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings, Globe, Map, Search, Server, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings synchronized successfully");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 lg:px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-4 whitespace-nowrap">System Configuration</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Manage platform settings, categories, and SEO</p>
        </div>
      </div>



      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Categories & Regions */}
        <Card className="border-none shadow-2xl rounded-3xl md:rounded-[3rem] bg-white overflow-hidden">
          <CardHeader className="p-6 md:p-10 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-3">
              <Globe className="w-6 h-6 text-emerald-500" /> Markets & Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-10 space-y-8">
            <div className="space-y-4">
               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Supported Countries</Label>
               <div className="flex flex-wrap gap-2">
                 {['Pakistan', 'China', 'Saudi Arabia', 'Qatar', 'UAE (Dubai)', 'USA', 'New Zealand', 'Canada', 'Europe'].map((c) => (
                   <Badge key={c} className="bg-emerald-50 text-emerald-600 font-bold px-3 py-1 text-xs hover:bg-emerald-100 cursor-pointer">{c}</Badge>
                 ))}
                 <Badge variant="outline" className="border-dashed border-slate-300 text-slate-400 font-bold px-3 py-1 cursor-pointer hover:bg-slate-50">+ Add Country</Badge>
               </div>
            </div>

            <div className="space-y-4">
               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Supported Languages</Label>
               <div className="flex flex-wrap gap-2">
                 {['English', 'Arabic', 'French'].map((l) => (
                   <Badge key={l} className="bg-blue-50 text-blue-600 font-bold px-3 py-1 text-xs hover:bg-blue-100 cursor-pointer">{l}</Badge>
                 ))}
               </div>
            </div>

            <div className="space-y-4">
               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Currencies</Label>
               <div className="flex flex-wrap gap-2">
                 {['USD', 'PKR', 'AED', 'SAR', 'QAR', 'GBP', 'EUR', 'JPY'].map((c) => (
                   <Badge key={c} className="bg-purple-50 text-purple-600 font-bold px-3 py-1 text-xs hover:bg-purple-100 cursor-pointer">{c}</Badge>
                 ))}
               </div>
            </div>

            <div className="space-y-4 pt-4">
               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform Categories</Label>
               <div className="flex flex-wrap gap-2">
                 {['Property', 'Vehicles', 'Electronics', 'Fashion', 'Machinery', 'General Products', 'Services'].map((c) => (
                   <Badge key={c} className="bg-slate-100 text-slate-600 font-bold px-3 py-1 text-xs hover:bg-slate-200 cursor-pointer">{c}</Badge>
                 ))}
               </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card className="border-none shadow-2xl rounded-3xl md:rounded-[3rem] bg-white overflow-hidden">
          <CardHeader className="p-6 md:p-10 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-3">
              <Search className="w-6 h-6 text-emerald-500" /> Platform SEO configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-10 space-y-6">
             <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Title Tag</Label>
               <Input defaultValue="TRAZOT — Global Marketplace for Everything" className="bg-slate-50 border-slate-100 font-bold" />
             </div>
             
             <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meta Description</Label>
               <Input defaultValue="Buy, Sell, Rent, and Promote products & services globally." className="bg-slate-50 border-slate-100 font-medium" />
             </div>
             
             <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Keywords</Label>
               <Input defaultValue="marketplace, buy, sell, worldwide, trazot, property, vehicles" className="bg-slate-50 border-slate-100 font-medium" />
             </div>

             <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                   <div>
                     <div className="font-black text-sm text-emerald-950 uppercase tracking-tighter">Sitemap.xml</div>
                     <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Auto-generated</div>
                   </div>
                   <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                   <div>
                     <div className="font-black text-sm text-emerald-950 uppercase tracking-tighter">Robots.txt</div>
                     <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Optimized</div>
                   </div>
                   <ShieldCheck className="w-5 h-5 text-emerald-500" />
                </div>
             </div>

             <Button type="submit" className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-black h-16 text-sm rounded-2xl shadow-xl transition-all uppercase tracking-tighter mt-4">
                <Server className="w-5 h-5 mr-3 text-emerald-500" /> Commit Configuration
             </Button>
          </CardContent>
        </Card>

      </form>
    </div>
  );
}
