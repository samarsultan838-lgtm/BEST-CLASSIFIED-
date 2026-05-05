import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Tag, 
  MapPin, 
  DollarSign, 
  Image as ImageIcon, 
  CheckCircle, 
  Info, 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  Zap, 
  Youtube, 
  MessageCircle, 
  Video, 
  Award, 
  Shield, 
  Globe, 
  Camera,
  Layers,
  Sparkles,
  Search,
  Check,
  Plus
} from "lucide-react";
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

import MapSelector from "@/src/components/MapSelector";

const adSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be greater than 0"),
  condition: z.string().min(1, "Please select condition"),
  location: z.string().min(3, "Please provide a specific location"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  videoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  whatsapp: z.string().min(10, "WhatsApp number must be valid").optional().or(z.literal("")),
  promotionTier: z.enum(["standard", "premium", "spotlight"]),
  features: z.array(z.string()),
});

type AdFormValues = z.infer<typeof adSchema>;

type Step = "classification" | "details" | "media" | "visibility";

const STEPS: { id: Step; label: string; icon: any }[] = [
  { id: "classification", label: "Category", icon: Layers },
  { id: "details", label: "Details", icon: Search },
  { id: "media", label: "Media", icon: Camera },
  { id: "visibility", label: "Visibility", icon: Award },
];

const FEATURES_LIST = [
  "Warranty Included",
  "Home Delivery",
  "Verified History",
  "Negotiable Price",
  "Urgent Sale",
  "Exchange Possible",
  "Installment Plan",
  "Showroom Unit"
];

export default function PostAdPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("classification");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    mode: "onChange",
    defaultValues: {
      category: "",
      condition: "new",
      promotionTier: "standard",
      features: [],
      videoUrl: "",
      whatsapp: profile?.phone || "",
    }
  });

  const watchCategory = watch("category");
  const watchPromotionTier = watch("promotionTier");
  const watchFeatures = watch("features");

  React.useEffect(() => {
    if (profile?.phone && !watch("whatsapp")) {
      setValue("whatsapp", profile.phone);
    }
  }, [profile, setValue, watch]);

  const nextStep = async () => {
    let fieldsToValidate: (keyof AdFormValues)[] = [];
    
    if (currentStep === "classification") {
      fieldsToValidate = ["category", "title"];
    } else if (currentStep === "details") {
      fieldsToValidate = ["description", "price", "condition"];
    } else if (currentStep === "media") {
      fieldsToValidate = ["location"];
    }

    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      if (currentStep === "classification") setCurrentStep("details");
      else if (currentStep === "details") setCurrentStep("media");
      else if (currentStep === "media") setCurrentStep("visibility");
    } else {
      toast.error("Please complete the required fields correctly");
    }
  };

  const prevStep = () => {
    if (currentStep === "details") setCurrentStep("classification");
    else if (currentStep === "media") setCurrentStep("details");
    else if (currentStep === "visibility") setCurrentStep("media");
  };

  const onSubmit = async (data: AdFormValues) => {
    if (!profile) {
      toast.error("You must be logged in to post an ad");
      return;
    }
    setIsSubmitting(true);
    try {
      await createAd({
        ...data,
        userId: profile.uid,
        userName: profile.name,
        userEmail: profile.email,
        userPhone: profile.phone || data.whatsapp,
        userProfileImage: profile.profileImage || "",
        images: ["https://picsum.photos/seed/ad/800/600"], // Placeholder
        priority: data.promotionTier === 'standard' ? 'normal' : data.promotionTier === 'premium' ? 'high' : 'premium',
        featured: data.promotionTier !== 'standard',
        status: 'pending',
      });
      setSubmitted(true);
      toast.success("Ad submitted for approval!");
    } catch (error) {
      toast.error("Failed to post ad. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFeature = (feature: string) => {
    const currentFeatures = watchFeatures || [];
    if (currentFeatures.includes(feature)) {
      setValue("features", currentFeatures.filter(f => f !== feature));
    } else {
      setValue("features", [...currentFeatures, feature]);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl text-center bg-white p-16 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] border border-slate-50"
        >
          <div className="w-32 h-32 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-lg shadow-emerald-500/20">
            <CheckCircle className="w-16 h-16" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Ad Manifested!</h2>
          <p className="text-slate-500 text-xl mb-12 font-medium leading-relaxed">
            Your inventory item has been queued for authorization. 
            The **Trazot Verification Unit** will finalize your listing shortly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={() => navigate("/dashboard")} className="bg-emerald-950 hover:bg-emerald-900 text-white font-black py-8 rounded-3xl text-lg uppercase tracking-tighter shadow-2xl">
              Merchant Fleet
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="border-slate-100 font-black py-8 rounded-3xl text-lg uppercase tracking-tighter hover:bg-slate-50">
              Global Stream
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-32">
      {/* Listivo Style Header */}
      <div className="bg-emerald-950 pt-24 pb-48 mb-[-120px] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black px-6 py-2 rounded-full mb-8 uppercase tracking-[0.3em] text-[10px]">
              Inventory Node Deployment
            </Badge>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.85]">
              Deploy <span className="text-emerald-500">Asset</span>
            </h1>
            <p className="text-emerald-100/40 text-lg md:text-2xl font-medium max-w-2xl mx-auto uppercase tracking-widest">
              Interface version 4.0 // High-Fidelity Listing Protocol
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-20 max-w-5xl">
        {/* Step Indicator */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-4 mb-12 shadow-2xl border border-white/50 flex items-center justify-between overflow-x-auto no-scrollbar">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isPast = idx < STEPS.findIndex(s => s.id === currentStep);
            
            return (
              <div 
                key={step.id}
                className={`flex items-center gap-4 px-8 py-4 rounded-3xl transition-all flex-shrink-0 ${
                  isActive ? "bg-emerald-500 text-emerald-950 scale-105 shadow-xl shadow-emerald-500/20" : 
                  isPast ? "text-emerald-600" : "text-slate-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isActive ? "bg-white/30" : isPast ? "bg-emerald-50" : "bg-slate-50"
                }`}>
                  {isPast ? <Check className="w-5 h-5 font-black" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{step.label}</span>
                {idx < STEPS.length - 1 && (
                  <div className={`w-8 h-[2px] mx-4 ${isPast ? "bg-emerald-500" : "bg-slate-100"}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-12">
          <Card className="border-none shadow-[0_60px_100px_rgba(0,0,0,0.08)] rounded-[3.5rem] overflow-hidden bg-white">
            <CardContent className="p-0">
              <form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  {currentStep === "classification" && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="p-6 md:p-14 space-y-10 md:space-y-16"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div className="space-y-4 max-w-xl text-left">
                          <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Global Identification</h2>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Define the asset class and identifier</p>
                        </div>
                        <Layers className="w-24 h-24 text-slate-50 hidden md:block" />
                      </div>

                      <div className="space-y-12">
                        <div className="space-y-6">
                          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Primary Classification</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                              { id: "vehicles", label: "Vehicles", icon: Zap },
                              { id: "property", label: "Property", icon: Globe },
                              { id: "mobiles" , label: "Mobiles", icon: Shield },
                              { id: "electronics", label: "Tech", icon: Video },
                              { id: "jobs", label: "Operations", icon: Info },
                              { id: "fashion", label: "Apparel", icon: Tag }
                            ].map((cat) => (
                              <div 
                                key={cat.id}
                                onClick={() => setValue("category", cat.id)}
                                className={`group cursor-pointer rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 border-2 transition-all flex flex-col items-center text-center gap-3 md:gap-4 ${
                                  watchCategory === cat.id ? "bg-emerald-500 border-emerald-500 text-emerald-950 scale-105 shadow-2xl shadow-emerald-500/20" : "bg-slate-50 border-slate-50 hover:border-emerald-200 text-slate-400"
                                }`}
                              >
                                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all ${
                                  watchCategory === cat.id ? "bg-white/30" : "bg-white shadow-sm group-hover:scale-110"
                                }`}>
                                  <cat.icon className={`w-6 h-6 md:w-8 md:h-8 ${watchCategory === cat.id ? "text-emerald-950" : "text-emerald-500"}`} />
                                </div>
                                <span className="font-black uppercase tracking-widest text-[9px] md:text-[10px]">{cat.label}</span>
                              </div>
                            ))}
                          </div>
                          {errors.category && <p className="text-red-500 text-[10px] font-black uppercase block text-left ml-2">{errors.category?.message}</p>}
                        </div>

                        <div className="space-y-4">
                          <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Public Designation (Title)</Label>
                          <Input 
                            {...register("title")} 
                            id="title" 
                            placeholder="e.g. TOYOTA LAND CRUISER 300 SERIES LX" 
                            className="h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-2xl border-slate-100 bg-slate-50 font-black placeholder:text-slate-300 focus:ring-emerald-500 shadow-inner px-8 md:px-10" 
                          />
                          {errors.title && <p className="text-red-500 text-[10px] font-black uppercase block text-left ml-2">{errors.title.message}</p>}
                        </div>
                      </div>

                      <div className="pt-10 flex justify-end">
                        <Button type="button" onClick={nextStep} className="w-full md:w-auto bg-emerald-950 hover:bg-emerald-900 text-white font-black h-16 md:h-20 px-8 md:px-16 rounded-2xl md:rounded-3xl text-sm md:text-xl uppercase tracking-tighter transition-all hover:scale-105 group">
                          Next Matrix <ArrowRight className="ml-2 md:ml-4 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === "details" && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="p-6 md:p-14 space-y-10 md:space-y-16"
                    >
                      <div className="flex justify-between items-end gap-8">
                        <div className="space-y-4 text-left">
                          <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Asset Parameters</h2>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Configure the internal metrics and features</p>
                        </div>
                        <Search className="w-24 h-24 text-slate-50 hidden md:block" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="space-y-4">
                          <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Valuation (USD)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500 font-black" />
                            <Input {...register("price")} id="price" type="number" placeholder="0.00" className="pl-16 h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-2xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner" />
                          </div>
                          {errors.price && <p className="text-red-500 text-[10px] font-black uppercase block text-left ml-2">{errors.price.message}</p>}
                        </div>

                        <div className="space-y-4">
                          <Label htmlFor="condition" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Mechanical Integrity</Label>
                          <Select value={watch("condition")} onValueChange={(v) => setValue("condition", v)}>
                            <SelectTrigger className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black text-slate-600 uppercase tracking-[0.2em] text-xs px-8 md:px-10">
                              <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                            <SelectContent className="rounded-3xl border-emerald-900 bg-emerald-950 text-white">
                              <SelectItem value="new">NEW // MINT MODULE</SelectItem>
                              <SelectItem value="used">USED // CALIBRATED</SelectItem>
                              <SelectItem value="refurbished">CERTIFIED // RECON</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Full Specifications</Label>
                        <Textarea 
                          {...register("description")} 
                          id="description" 
                          placeholder="Decrypt the full details of your asset here..." 
                          className="min-h-[200px] md:min-h-[250px] rounded-[2rem] md:rounded-[3rem] border-slate-100 bg-slate-50 p-8 md:p-10 text-lg md:text-xl font-medium leading-relaxed focus:ring-emerald-500 shadow-inner no-scrollbar" 
                        />
                        {errors.description && <p className="text-red-500 text-[10px] font-black uppercase block text-left ml-2">{errors.description.message}</p>}
                      </div>

                      <div className="space-y-8">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Extended Capabilities</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {FEATURES_LIST.map((feature) => (
                            <div 
                              key={feature}
                              onClick={() => toggleFeature(feature)}
                              className={`flex items-center gap-3 p-4 md:p-6 rounded-2xl cursor-pointer transition-all border-2 text-left ${
                                (watchFeatures || []).includes(feature) ? "bg-emerald-100 border-emerald-500 text-emerald-900" : "bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200"
                              }`}
                            >
                              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                (watchFeatures || []).includes(feature) ? "bg-emerald-500 text-white" : "bg-white"
                              }`}>
                                {(watchFeatures || []).includes(feature) && <Check className="w-4 h-4 font-black" />}
                              </div>
                              <span className="font-black uppercase tracking-tighter text-[8px] md:text-[9px]">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-10 flex flex-col md:flex-row justify-between gap-4">
                        <Button type="button" onClick={prevStep} variant="ghost" className="font-black h-16 md:h-20 px-8 md:px-12 rounded-2xl md:rounded-3xl text-lg md:text-xl uppercase tracking-tighter text-slate-400">
                          <ArrowLeft className="mr-4 w-6 h-6" /> Back
                        </Button>
                        <Button type="button" onClick={nextStep} className="bg-emerald-950 hover:bg-emerald-900 text-white font-black h-16 md:h-20 px-12 md:px-16 rounded-2xl md:rounded-3xl text-lg md:text-xl uppercase tracking-tighter transition-all hover:scale-105">
                          Configure Media <ArrowRight className="ml-4 w-6 h-6" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === "media" && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="p-6 md:p-14 space-y-10 md:space-y-16"
                    >
                      <div className="flex justify-between items-end gap-8">
                        <div className="space-y-4 text-left">
                          <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Sensory Assets</h2>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Visual and geospatial data integration</p>
                        </div>
                        <Camera className="w-24 h-24 text-slate-50 hidden md:block" />
                      </div>

                      <div className="space-y-6 md:space-y-8">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Imagery Stream (Static)</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                          <div className="aspect-square bg-slate-50 border-4 border-dashed border-slate-100 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 transition-all group shadow-inner">
                            <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-3xl shadow-sm flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                              <ImageIcon className="w-6 h-6 md:w-10 md:h-10 text-emerald-500" />
                            </div>
                            <span className="text-[8px] md:text-[10px] font-black text-slate-400 group-hover:text-emerald-600 transition-colors tracking-[0.3em]">UPLOAD CORE</span>
                          </div>
                          {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-square bg-slate-100/50 rounded-[2rem] md:rounded-[3rem] border border-slate-50 flex items-center justify-center">
                              <span className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">Slot 0{i+1}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="space-y-4">
                          <Label htmlFor="videoUrl" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Video Feed (YouTube/Vimeo)</Label>
                          <div className="relative">
                            <Youtube className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-red-500 font-black" />
                            <Input {...register("videoUrl")} id="videoUrl" placeholder="https://youtube.com/watch?v=..." className="pl-12 md:pl-16 h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner pr-4 text-xs md:text-base md:px-10" />
                          </div>
                          {errors.videoUrl && <p className="text-red-500 text-[10px] font-black uppercase block text-left ml-2">{errors.videoUrl.message}</p>}
                        </div>

                        <div className="space-y-4">
                          <Label htmlFor="whatsapp" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Direct Comms (WhatsApp)</Label>
                          <div className="relative">
                            <MessageCircle className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500 font-black" />
                            <Input {...register("whatsapp")} id="whatsapp" placeholder="+92 300 0000000" className="pl-12 md:pl-16 h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner pr-4 text-xs md:text-base md:px-10" />
                          </div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 text-left">
                            This number enables prompt interest from potential buyers via instant messaging.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4 md:space-y-6">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Deployed Geolocation</Label>
                        <div className="rounded-[2rem] md:rounded-[3.5rem] overflow-hidden border-2 md:border-8 border-slate-50 shadow-xl h-[350px] md:h-[450px]">
                           <MapSelector 
                            onLocationSelect={(lat, lng, address) => {
                              setValue("location", address);
                              setValue("latitude", lat);
                              setValue("longitude", lng);
                            }} 
                           />
                        </div>
                        {errors.location && <p className="text-red-500 text-[10px] font-black uppercase block text-left ml-2">{errors.location.message}</p>}
                      </div>

                      <div className="pt-10 flex flex-col md:flex-row justify-between gap-4 text-left">
                        <Button type="button" onClick={prevStep} variant="ghost" className="font-black h-16 md:h-20 px-8 md:px-12 rounded-2xl md:rounded-3xl text-lg md:text-xl uppercase tracking-tighter text-slate-400">
                          <ArrowLeft className="mr-4 w-6 h-6" /> Back
                        </Button>
                        <Button type="button" onClick={nextStep} className="bg-emerald-950 hover:bg-emerald-900 text-white font-black h-16 md:h-20 px-12 md:px-16 rounded-2xl md:rounded-3xl text-lg md:text-xl uppercase tracking-tighter transition-all hover:scale-105">
                          Authorization <ArrowRight className="ml-4 w-6 h-6" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === "visibility" && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="p-6 md:p-14 space-y-10 md:space-y-16"
                    >
                      <div className="flex justify-between items-end gap-8">
                        <div className="space-y-4 text-left">
                          <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Visibility Boost</h2>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Select your node promotion tier</p>
                        </div>
                        <Award className="w-24 h-24 text-slate-50 hidden md:block" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                          { 
                            id: "standard", 
                            label: "Standard", 
                            desc: "Global baseline visibility. 24h queue.", 
                            icon: Shield, 
                            color: "slate",
                            features: ["Basic Listing", "7 Day Visibility"]
                          },
                          { 
                            id: "premium", 
                            label: "Featured", 
                            desc: "High-priority listing. Instant processing.", 
                            icon: Sparkles, 
                            color: "orange",
                            features: ["Priority Queue", "Highlighted Tag", "Top Search Results"]
                          },
                          { 
                            id: "spotlight", 
                            label: "Spotlight", 
                            desc: "Maximum saturation. Homepage hero slot.", 
                            icon: Zap, 
                            color: "emerald",
                            features: ["Unlimited Bumps", "Featured Slider", "WhatsApp Direct Icon"]
                          },
                        ].map((tier) => (
                          <div 
                            key={tier.id}
                            onClick={() => setValue("promotionTier", tier.id as any)}
                            className={`relative cursor-pointer rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 border-4 transition-all flex flex-col gap-6 text-center ${
                              watchPromotionTier === tier.id ? `bg-emerald-950 text-white border-emerald-500 scale-105 shadow-2xl` : "bg-white border-slate-50 hover:bg-slate-50"
                            }`}
                          >
                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl mx-auto flex items-center justify-center ${
                              watchPromotionTier === tier.id ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-100 text-slate-400"
                            }`}>
                              <tier.icon className="w-8 h-8 md:w-10 md:h-10" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter">{tier.label}</h3>
                              <p className={`text-[10px] md:text-xs font-medium leading-relaxed ${watchPromotionTier === tier.id ? "text-emerald-100/50" : "text-slate-400"}`}>
                                {tier.desc}
                              </p>
                            </div>
                            <div className="pt-6 border-t border-slate-100 space-y-4">
                              {tier.features.map(f => (
                                <div key={f} className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-left">
                                  <Check className={`w-3 h-3 md:w-4 md:h-4 ${watchPromotionTier === tier.id ? "text-emerald-500" : "text-slate-300"}`} /> {f}
                                </div>
                              ))}
                            </div>
                            {watchPromotionTier === tier.id && (
                              <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-emerald-500 text-emerald-950 p-2 rounded-full">
                                <CheckCircle className="w-4 h-4 font-black" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="bg-slate-50 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                         <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-8 text-center sm:text-left">
                           <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500 text-white rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                             <Award className="w-8 h-8 md:w-10 md:h-10" />
                           </div>
                           <div className="text-center sm:text-left pt-2 sm:pt-0">
                             <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">Security Contract</h4>
                             <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mt-2">By deploying, you agree to Trazot listing policies v4.0</p>
                           </div>
                         </div>
                         <Button disabled={isSubmitting} type="submit" className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black h-20 md:h-24 px-12 md:px-16 rounded-2xl md:rounded-[2rem] text-xl md:text-2xl shadow-xl transition-all hover:scale-105 uppercase tracking-tighter">
                            {isSubmitting ? (
                              <Loader2 className="mr-4 h-8 w-8 md:h-10 md:w-10 animate-spin" />
                            ) : (
                              <Zap className="mr-4 h-8 w-8 md:h-10 md:w-10" />
                            )}
                            {isSubmitting ? "FINALIZING..." : "INITIATE DEPLOY"}
                         </Button>
                      </div>

                      <div className="flex justify-start">
                        <Button type="button" onClick={prevStep} variant="ghost" className="font-black h-16 md:h-20 px-10 md:px-12 rounded-2xl md:rounded-3xl text-lg md:text-xl uppercase tracking-tighter text-slate-400">
                          <ArrowLeft className="mr-4 w-6 h-6" /> Back
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
