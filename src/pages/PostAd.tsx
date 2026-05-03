import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tag, MapPin, DollarSign, Image as ImageIcon, CheckCircle, Info, ArrowRight, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Sell on Trazot</h1>
        <p className="text-slate-500">Fill in the details below to reach thousands of buyers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-900 text-white">
              <CardTitle className="text-xl">Ad Details</CardTitle>
              <CardDescription className="text-slate-400">Be as descriptive as possible for better reach</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-slate-500">Ad Title</Label>
                    <Input {...register("title")} id="title" placeholder="e.g. iPhone 15 Pro Max - 256GB - Blue Titanium" className="h-12 rounded-xl text-lg border-slate-200" />
                    {errors.title && <p className="text-red-500 text-xs font-medium">{errors.title.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-sm font-bold uppercase tracking-wider text-slate-500">Category</Label>
                      <Select value={watch("category")} onValueChange={(v) => setValue("category", v)}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vehicles">Vehicles</SelectItem>
                          <SelectItem value="property">Property</SelectItem>
                          <SelectItem value="mobiles">Mobiles</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="jobs">Jobs</SelectItem>
                          <SelectItem value="fashion">Fashion</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-red-500 text-xs font-medium">{errors.category.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-bold uppercase tracking-wider text-slate-500">Price (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                        <Input {...register("price")} id="price" type="number" placeholder="0.00" className="pl-10 h-12 rounded-xl text-lg border-slate-200" />
                      </div>
                      {errors.price && <p className="text-red-500 text-xs font-medium">{errors.price.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-slate-500">Description</Label>
                    <Textarea {...register("description")} id="description" placeholder="Include features, condition, usage details..." className="min-h-[150px] rounded-xl border-slate-200 p-4" />
                    {errors.description && <p className="text-red-500 text-xs font-medium">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="condition" className="text-sm font-bold uppercase tracking-wider text-slate-500">Condition</Label>
                      <Select value={watch("condition")} onValueChange={(v) => setValue("condition", v)}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200">
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New / Like New</SelectItem>
                          <SelectItem value="used">Used / Good</SelectItem>
                          <SelectItem value="refurbished">Refurbished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-sm font-bold uppercase tracking-wider text-slate-500">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                        <Input {...register("location")} id="location" placeholder="City, Area" className="pl-10 h-12 rounded-xl text-lg border-slate-200" />
                      </div>
                      {errors.location && <p className="text-red-500 text-xs font-medium">{errors.location.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Photos</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors group">
                      <ImageIcon className="w-8 h-8 text-slate-300 group-hover:text-orange-500 transition-colors" />
                      <span className="text-[10px] font-bold text-slate-400 mt-2">ADD PHOTO</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">First image will be the cover image. JPG, PNG accepted.</p>
                </div>

                <Button disabled={isSubmitting} type="submit" className="w-full bg-orange-500 hover:bg-orange-600 font-bold py-7 rounded-xl text-xl shadow-lg shadow-orange-100">
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-6 w-6" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Ad for Approval"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-orange-50 border-orange-100 rounded-2xl overflow-hidden">
             <CardContent className="p-6">
               <div className="flex items-center gap-2 text-orange-600 font-bold mb-4">
                 <Info className="w-5 h-5" />
                 <h3>Approval Process</h3>
               </div>
               <ul className="space-y-3 text-sm text-orange-800">
                 <li className="flex gap-2">
                   <div className="bg-orange-200 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">1</div>
                   <span>All ads go through automated and manual moderation.</span>
                 </li>
                 <li className="flex gap-2">
                   <div className="bg-orange-200 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">2</div>
                   <span>Approval usually takes less than 24 hours.</span>
                 </li>
                 <li className="flex gap-2">
                   <div className="bg-orange-200 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">3</div>
                   <span>Ads violating our terms will be rejected with an explanation.</span>
                 </li>
               </ul>
             </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-500">Check our posting guidelines or contact our support team.</p>
              <Button variant="outline" className="w-full border-slate-200 font-bold">Guidelines</Button>
              <Button variant="outline" className="w-full border-slate-200 font-bold">Live Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
