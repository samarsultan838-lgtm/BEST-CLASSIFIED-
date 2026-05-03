import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tag, MapPin, DollarSign, Image as ImageIcon, CheckCircle, Info, ArrowRight, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/src/context/AuthContext";
import { createAd } from "@/src/lib/firestoreService";
import { toast } from "sonner";

const adSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be greater than 0"),
  condition: z.string().min(1, "Please select condition"),
  location: z.string().min(3, "Please provide a specific location"),
});

type AdFormValues = z.infer<typeof adSchema>;

export default function PostAdPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      category: "",
      condition: "new",
    }
  });

  const onSubmit = async (data: AdFormValues) => {
    if (!profile) return;
    setIsSubmitting(true);
    try {
      await createAd({
        ...data,
        userId: profile.uid,
        userName: profile.name,
        userEmail: profile.email,
        images: ["https://picsum.photos/seed/ad/800/600"], // Placeholder for now
      });
      setSubmitted(true);
      toast.success("Ad submitted for approval!");
    } catch (error) {
      toast.error("Failed to post ad. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Ad Under Review!</h2>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            Thank you for posting on Trazot. Your ad is now in the **Pending Queue**. 
            Our moderation team will review it within **24 hours**. 
            You'll receive an email once it's live.
          </p>
          <div className="flex flex-col gap-4">
            <Button onClick={() => navigate("/dashboard")} className="bg-orange-500 hover:bg-orange-600 font-bold py-6 rounded-xl text-lg">
              Go to Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate("/")} className="text-slate-500">
              Return to Homepage
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="bg-emerald-950 py-24 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black px-4 py-2 rounded-full mb-8 uppercase tracking-[0.2em] text-[10px]">Merchant Center</Badge>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
            Sell on <span className="text-emerald-500">Trazot</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Join the most trusted marketplace in Pakistan. Reach thousands of verified buyers in minutes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-32 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <Card className="border-none shadow-[0_40px_80px_rgba(0,0,0,0.05)] rounded-[3rem] overflow-hidden bg-white">
              <div className="bg-emerald-500 p-10 text-emerald-950 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">Ad Information</h2>
                  <p className="text-emerald-900/60 font-bold text-sm">Fill in the details for maximum visibility</p>
                </div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Tag className="w-8 h-8 text-emerald-950" />
                </div>
              </div>
              <CardContent className="p-12">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ad Title</Label>
                      <Input {...register("title")} id="title" placeholder="e.g. iPhone 15 Pro Max - 256GB - Blue Titanium" className="h-16 rounded-2xl text-xl border-slate-100 bg-slate-50 font-black placeholder:text-slate-300 focus:ring-emerald-500 focus:border-emerald-500 transition-all" />
                      {errors.title && <p className="text-red-500 text-xs font-black uppercase">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category Selection</Label>
                        <Select value={watch("category")} onValueChange={(v) => setValue("category", v)}>
                          <SelectTrigger className="h-16 rounded-2xl border-slate-100 bg-slate-50 font-black text-slate-600 focus:ring-emerald-500 uppercase tracking-widest text-xs">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-emerald-900 bg-emerald-950 text-emerald-100">
                            <SelectItem value="vehicles" className="font-black">Vehicles</SelectItem>
                            <SelectItem value="property" className="font-black">Property</SelectItem>
                            <SelectItem value="mobiles" className="font-black">Mobiles</SelectItem>
                            <SelectItem value="electronics" className="font-black">Electronics</SelectItem>
                            <SelectItem value="jobs" className="font-black">Jobs</SelectItem>
                            <SelectItem value="fashion" className="font-black">Fashion</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.category && <p className="text-red-500 text-xs font-black uppercase">{errors.category.message}</p>}
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target Price (USD)</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500 font-black" />
                          <Input {...register("price")} id="price" type="number" placeholder="0.00" className="pl-14 h-16 rounded-2xl text-xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner" />
                        </div>
                        {errors.price && <p className="text-red-500 text-xs font-black uppercase">{errors.price.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Full Description</Label>
                      <Textarea {...register("description")} id="description" placeholder="Describe your item in detail. Buyers love specifics about condition, usage, and special features." className="min-h-[200px] rounded-[2rem] border-slate-100 bg-slate-50 p-8 text-lg font-medium leading-relaxed focus:ring-emerald-500" />
                      {errors.description && <p className="text-red-500 text-xs font-black uppercase">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <Label htmlFor="condition" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Item Condition</Label>
                        <Select value={watch("condition")} onValueChange={(v) => setValue("condition", v)}>
                          <SelectTrigger className="h-16 rounded-2xl border-slate-100 bg-slate-50 font-black text-slate-600 uppercase tracking-widest text-xs">
                            <SelectValue placeholder="Condition" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl">
                            <SelectItem value="new">New / Mint</SelectItem>
                            <SelectItem value="used">Gently Used</SelectItem>
                            <SelectItem value="refurbished">Certified Refurbished</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Geo Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500 font-black" />
                          <Input {...register("location")} id="location" placeholder="e.g. DHA Phase 5, Lahore" className="pl-14 h-16 rounded-2xl text-lg border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner" />
                        </div>
                        {errors.location && <p className="text-red-500 text-xs font-black uppercase">{errors.location.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-12 border-t border-slate-50">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visual Assets (Required)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      <div className="aspect-square bg-slate-50 border-4 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group shadow-inner">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                          <ImageIcon className="w-8 h-8 text-emerald-500" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 group-hover:text-emerald-600 transition-colors tracking-[0.2em]">ADD PHOTO</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Maximum 10 images. Square ratio preferred.</p>
                  </div>

                  <Button disabled={isSubmitting} type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black py-10 rounded-3xl text-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-tighter">
                    {isSubmitting ? (
                      <Loader2 className="mr-4 h-8 w-8 animate-spin" />
                    ) : (
                      <Zap className="mr-4 h-8 w-8" />
                    )}
                    {isSubmitting ? "Processing..." : "Publish My Listing"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-12">
            <Card className="bg-emerald-950 border-none rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2"></div>
               <div className="relative z-10">
                 <div className="flex items-center gap-4 text-emerald-500 font-black uppercase tracking-widest text-xs mb-10">
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                     <Info className="w-6 h-6" />
                   </div>
                   Security Shield Active
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 leading-none">Safe Listing Process</h3>
                 <ul className="space-y-8">
                   <li className="flex gap-6 group">
                     <div className="bg-emerald-500/20 text-emerald-400 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg font-black group-hover:bg-emerald-500 group-hover:text-emerald-950 transition-colors">1</div>
                     <div>
                       <h4 className="font-black text-sm uppercase tracking-widest mb-1">Moderation</h4>
                       <p className="text-slate-400 text-xs font-medium leading-relaxed">All ads are screened for scams and prohibited items.</p>
                     </div>
                   </li>
                   <li className="flex gap-6 group">
                     <div className="bg-emerald-500/20 text-emerald-400 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg font-black group-hover:bg-emerald-500 group-hover:text-emerald-950 transition-colors">2</div>
                     <div>
                       <h4 className="font-black text-sm uppercase tracking-widest mb-1">Queue Time</h4>
                       <p className="text-slate-400 text-xs font-medium leading-relaxed">Most ads are approved within minutes by Trazot Pulse.</p>
                     </div>
                   </li>
                   <li className="flex gap-6 group">
                     <div className="bg-emerald-500/20 text-emerald-400 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-lg font-black group-hover:bg-emerald-500 group-hover:text-emerald-950 transition-colors">3</div>
                     <div>
                       <h4 className="font-black text-sm uppercase tracking-widest mb-1">Global Reach</h4>
                       <p className="text-slate-400 text-xs font-medium leading-relaxed">Once live, your ad is visible to buyers nationwide.</p>
                     </div>
                   </li>
                 </ul>
               </div>
            </Card>

            <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-white space-y-12">
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Support Hub</h3>
               <div className="space-y-4">
                 <Button variant="outline" className="w-full h-16 rounded-2xl border-slate-100 font-black uppercase tracking-widest text-[10px] hover:bg-emerald-50 hover:text-emerald-600 transition-all flex justify-between px-8">
                   Posting Rules <span>→</span>
                 </Button>
                 <Button variant="outline" className="w-full h-16 rounded-2xl border-slate-100 font-black uppercase tracking-widest text-[10px] hover:bg-emerald-50 hover:text-emerald-600 transition-all flex justify-between px-8">
                   Safety Tips <span>→</span>
                 </Button>
                 <Button variant="outline" className="w-full h-16 rounded-2xl border-slate-100 font-black uppercase tracking-widest text-[10px] hover:bg-emerald-50 hover:text-emerald-600 transition-all flex justify-between px-8">
                   Chat Support <span>→</span>
                 </Button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
