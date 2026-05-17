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
  Plus,
  Box,
  Settings,
  Car,
  Home,
  Briefcase
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
const adSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Price must be a valid number"),
  condition: z.string().optional(),
  propertyType: z.string().optional(),
  propertySubType: z.string().optional(),
  purpose: z.string().optional(),
  area: z.string().optional(),
  areaUnit: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleVIN: z.string().optional(),
  registeredIn: z.string().optional(),
  mileage: z.string().optional(),
  fuelType: z.string().optional(),
  vehicleYear: z.string().optional(),
  jobType: z.string().optional(),
  fashionCategory: z.string().optional(),
  location: z.string().optional().or(z.literal("")),
  imageUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
  videoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  whatsapp: z.string().min(10, "WhatsApp number must be valid").optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
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
      imageUrl: "",
      videoUrl: "",
      whatsapp: profile?.phone || "",
      email: profile?.email || "",
    }
  });

  const watchCategory = watch("category");
  const watchPromotionTier = watch("promotionTier");
  const watchFeatures = watch("features");
  const watchPropertyType = watch("propertyType");

  React.useEffect(() => {
    if (profile?.phone && !watch("whatsapp")) {
      setValue("whatsapp", profile.phone);
    }
    if (profile?.email && !watch("email")) {
      setValue("email", profile.email);
    }
  }, [profile, setValue, watch]);

  const nextStep = async () => {
    let fieldsToValidate: (keyof AdFormValues)[] = [];
    
    if (currentStep === "classification") {
      fieldsToValidate = ["category"];
    } else if (currentStep === "details") {
      fieldsToValidate = ["title", "description", "price", "condition"];
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
        price: Number(data.price),
        userId: profile.uid,
        userName: profile.name,
        userEmail: profile.email,
        userPhone: profile.phone || data.whatsapp,
        userProfileImage: profile.profileImage || "",
        images: data.imageUrl ? [data.imageUrl] : ["https://picsum.photos/seed/ad/800/600"],
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
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Ad Posted Successfully!</h2>
          <p className="text-slate-500 text-xl mb-12 font-medium leading-relaxed">
            Your item is now in review and will be live shortly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={() => window.location.reload()} className="bg-emerald-950 hover:bg-emerald-900 text-white font-black py-8 rounded-3xl text-lg uppercase tracking-tighter shadow-2xl">
              Post Another Ad
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="border-slate-100 font-black py-8 rounded-3xl text-lg uppercase tracking-tighter hover:bg-slate-50">
              Back to Home
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
              Post Ad
            </Badge>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.85]">
              Sell <span className="text-emerald-500">Faster</span>
            </h1>
            <p className="text-emerald-100/40 text-lg md:text-2xl font-medium max-w-2xl mx-auto uppercase tracking-widest">
              Fill out the form below to list your item
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-20 max-w-5xl">
        {/* Step Indicator */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-3xl md:rounded-[2.5rem] p-3 md:p-4 mb-8 md:mb-12 shadow-2xl border border-white/50 flex items-center justify-between overflow-x-auto no-scrollbar gap-2 md:gap-0">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isPast = idx < STEPS.findIndex(s => s.id === currentStep);
            
            return (
              <div 
                key={step.id}
                className={`flex items-center gap-2 md:gap-4 px-4 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-3xl transition-all flex-shrink-0 ${
                  isActive ? "bg-emerald-500 text-emerald-950 scale-105 shadow-xl shadow-emerald-500/20" : 
                  isPast ? "text-emerald-600" : "text-slate-300"
                }`}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center ${
                  isActive ? "bg-white/30" : isPast ? "bg-emerald-50" : "bg-slate-50"
                }`}>
                  {isPast ? <Check className="w-4 h-4 md:w-5 md:h-5 font-black" /> : <Icon className="w-4 h-4 md:w-5 md:h-5" />}
                </div>
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">{step.label}</span>
                {idx < STEPS.length - 1 && (
                  <div className={`w-4 md:w-8 h-[2px] mx-2 md:mx-4 hidden sm:block ${isPast ? "bg-emerald-500" : "bg-slate-100"}`} />
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
                          <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Basic Information</h2>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">What are you selling?</p>
                        </div>
                        <Layers className="w-24 h-24 text-slate-50 hidden md:block" />
                      </div>

                      <div className="space-y-12">
                        <div className="space-y-6">
                          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Select Category</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {[
                              { id: "vehicles", label: "Vehicles", icon: Car },
                              { id: "property", label: "Property", icon: Home },
                              { id: "mobiles" , label: "Mobiles", icon: Shield },
                              { id: "electronics", label: "Electronics", icon: Video },
                              { id: "fashion", label: "Fashion", icon: Tag },
                              { id: "machinery", label: "Machinery", icon: Settings },
                              { id: "jobs", label: "Jobs", icon: Briefcase },
                              { id: "general", label: "General", icon: Box }
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
                      </div>

                      <div className="pt-10 flex justify-end">
                        <Button type="button" onClick={nextStep} className="w-full md:w-auto bg-emerald-950 hover:bg-emerald-900 text-white font-black h-16 md:h-20 px-8 md:px-16 rounded-2xl md:rounded-3xl text-sm md:text-xl uppercase tracking-tighter transition-all hover:scale-105 group">
                          Next Step <ArrowRight className="ml-2 md:ml-4 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
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
                          <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Ad Details</h2>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Provide more information about your item</p>
                        </div>
                        <Search className="w-24 h-24 text-slate-50 hidden md:block" />
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Ad Title</Label>
                        <Input 
                          {...register("title")} 
                          id="title" 
                          placeholder="e.g. iPhone 13 Pro Max 256GB" 
                          className="h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-2xl border-slate-100 bg-slate-50 font-black placeholder:text-slate-300 focus:ring-emerald-500 shadow-inner px-8 md:px-10" 
                        />
                        {errors.title && <p className="text-red-500 text-[10px] font-black uppercase block text-left ml-2">{errors.title.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="space-y-4">
                          <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">{watchCategory === "jobs" ? "Salary (USD)" : "Price (USD)"}</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500 font-black" />
                            <Input {...register("price")} id="price" type="number" placeholder="0.00" className="pl-16 h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-2xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner" />
                          </div>
                          {errors.price && <p className="text-red-500 text-[10px] font-black uppercase block text-left ml-2">{errors.price.message}</p>}
                        </div>

                        {watchCategory === "property" && (
                          <>
                            <div className="space-y-4">
                              <Label htmlFor="purpose" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Purpose</Label>
                              <Select value={watch("purpose")} onValueChange={(v) => setValue("purpose", v)}>
                                <SelectTrigger className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black text-slate-600 uppercase tracking-[0.2em] text-xs px-8 md:px-10">
                                  <SelectValue placeholder="Select Purpose" />
                                </SelectTrigger>
                                <SelectContent className="rounded-3xl border-slate-200 bg-white text-slate-800 shadow-xl p-2">
                                  <SelectItem value="sale">Sell</SelectItem>
                                  <SelectItem value="rent">Rent</SelectItem>
                                  <SelectItem value="required">Required</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-4">
                              <Label htmlFor="propertyType" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Type of Property</Label>
                              <Select value={watch("propertyType")} onValueChange={(v) => setValue("propertyType", v)}>
                                <SelectTrigger className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black text-slate-600 uppercase tracking-[0.2em] text-xs px-8 md:px-10">
                                  <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-3xl border-slate-200 bg-white text-slate-800 shadow-xl p-2">
                                  <SelectItem value="residential">Residential</SelectItem>
                                  <SelectItem value="commercial">Commercial</SelectItem>
                                  <SelectItem value="agriculture">Agricultural</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {watchPropertyType && (
                              <div className="space-y-4">
                                <Label htmlFor="propertySubType" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Property Category</Label>
                                <Select value={watch("propertySubType")} onValueChange={(v) => setValue("propertySubType", v)}>
                                  <SelectTrigger className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black text-slate-600 uppercase tracking-[0.2em] text-xs px-8 md:px-10">
                                    <SelectValue placeholder="Select Category" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-3xl border-slate-200 bg-white text-slate-800 shadow-xl p-2">
                                    {watchPropertyType === "residential" && (
                                      <>
                                        <SelectItem value="plot">Plot</SelectItem>
                                        <SelectItem value="house">House</SelectItem>
                                        <SelectItem value="flat">Flat</SelectItem>
                                        <SelectItem value="villa_farmhouse">Villa/Farm House</SelectItem>
                                      </>
                                    )}
                                    {watchPropertyType === "commercial" && (
                                      <>
                                        <SelectItem value="shop">Shop</SelectItem>
                                        <SelectItem value="plaza">Plaza</SelectItem>
                                        <SelectItem value="plot">Plot</SelectItem>
                                      </>
                                    )}
                                    {watchPropertyType === "agriculture" && (
                                      <SelectItem value="land">Land</SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                            <div className="space-y-4">
                              <Label htmlFor="area" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Area / Size</Label>
                              <div className="flex gap-4">
                                <Input {...register("area")} id="area" type="number" placeholder="0" className="flex-1 h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner px-8 md:px-10" />
                                <Select value={watch("areaUnit")} onValueChange={(v) => setValue("areaUnit", v)}>
                                  <SelectTrigger className="w-1/2 h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black text-slate-600 tracking-[0.1em] text-sm px-4 md:px-6">
                                    <SelectValue placeholder="Unit" />
                                  </SelectTrigger>
                                  <SelectContent className="rounded-3xl border-slate-200 bg-white text-slate-800 shadow-xl p-2">
                                    {(!watchPropertyType || watchPropertyType === "residential") && (
                                      <>
                                        <SelectItem value="marla">Marla</SelectItem>
                                        <SelectItem value="kanal">Kanal</SelectItem>
                                      </>
                                    )}
                                    {watchPropertyType === "commercial" && (
                                      <>
                                        <SelectItem value="square_feet">Square feet</SelectItem>
                                        <SelectItem value="marla">Marla</SelectItem>
                                      </>
                                    )}
                                    {watchPropertyType === "agriculture" && (
                                      <>
                                        <SelectItem value="acre">Acre</SelectItem>
                                        <SelectItem value="kanal">Kanal</SelectItem>
                                      </>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {watchCategory === "vehicles" && (
                          <>
                            <div className="space-y-4">
                              <Label htmlFor="vehicleMake" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Make / Brand</Label>
                              <Input {...register("vehicleMake")} id="vehicleMake" placeholder="e.g. Toyota, Honda, Ford" className="h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner px-8 md:px-10" />
                            </div>
                            <div className="space-y-4">
                              <Label htmlFor="vehicleModel" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Model</Label>
                              <Input {...register("vehicleModel")} id="vehicleModel" placeholder="e.g. Corolla, Civic, Ranger" className="h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner px-8 md:px-10" />
                            </div>
                            <div className="space-y-4">
                              <Label htmlFor="vehicleYear" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Year</Label>
                              <Input {...register("vehicleYear")} id="vehicleYear" type="number" placeholder="YYYY" className="h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner px-8 md:px-10" />
                            </div>
                            <div className="space-y-4">
                              <Label htmlFor="vehicleVIN" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">VIN / Chassis No (Verification)</Label>
                              <Input {...register("vehicleVIN")} id="vehicleVIN" placeholder="e.g. 17-digit VIN" className="h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner px-8 md:px-10 uppercase" />
                            </div>
                            <div className="space-y-4">
                              <Label htmlFor="registeredIn" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Registered In</Label>
                              <Input {...register("registeredIn")} id="registeredIn" placeholder="e.g. California, Dubai" className="h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner px-8 md:px-10" />
                            </div>
                            <div className="space-y-4">
                              <Label htmlFor="mileage" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Mileage (km/miles)</Label>
                              <Input {...register("mileage")} id="mileage" placeholder="e.g. 50000" className="h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner px-8 md:px-10" />
                            </div>
                            <div className="space-y-4">
                              <Label htmlFor="fuelType" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Fuel Type</Label>
                              <Select value={watch("fuelType")} onValueChange={(v) => setValue("fuelType", v)}>
                                <SelectTrigger className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black text-slate-600 uppercase tracking-[0.2em] text-xs px-8 md:px-10">
                                  <SelectValue placeholder="Select Fuel Type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-3xl border-slate-200 bg-white text-slate-800 shadow-xl p-2">
                                  <SelectItem value="petrol">Petrol</SelectItem>
                                  <SelectItem value="diesel">Diesel</SelectItem>
                                  <SelectItem value="electric">Electric</SelectItem>
                                  <SelectItem value="hybrid">Hybrid</SelectItem>
                                  <SelectItem value="cng">CNG</SelectItem>
                                  <SelectItem value="lpg">LPG</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        {watchCategory === "jobs" && (
                          <div className="space-y-4">
                            <Label htmlFor="jobType" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Job Type</Label>
                            <Select value={watch("jobType")} onValueChange={(v) => setValue("jobType", v)}>
                              <SelectTrigger className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black text-slate-600 uppercase tracking-[0.2em] text-xs px-8 md:px-10">
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent className="rounded-3xl border-slate-200 bg-white text-slate-800 shadow-xl p-2">
                                <SelectItem value="full-time">Full-time</SelectItem>
                                <SelectItem value="part-time">Part-time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {watchCategory === "fashion" && (
                          <div className="space-y-4">
                            <Label htmlFor="fashionCategory" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Category</Label>
                            <Select value={watch("fashionCategory")} onValueChange={(v) => setValue("fashionCategory", v)}>
                              <SelectTrigger className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black text-slate-600 uppercase tracking-[0.2em] text-xs px-8 md:px-10">
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent className="rounded-3xl border-slate-200 bg-white text-slate-800 shadow-xl p-2">
                                <SelectItem value="men">Men</SelectItem>
                                <SelectItem value="women">Women</SelectItem>
                                <SelectItem value="boy">Boy</SelectItem>
                                <SelectItem value="girl">Girl</SelectItem>
                                <SelectItem value="kids">Kids</SelectItem>
                                <SelectItem value="baby_girl">Baby Girl</SelectItem>
                                <SelectItem value="baby_boy">Baby Boy</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {watchCategory !== "property" && watchCategory !== "jobs" && (
                          <div className="space-y-4">
                            <Label htmlFor="condition" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Condition</Label>
                            <Select value={watch("condition")} onValueChange={(v) => setValue("condition", v)}>
                              <SelectTrigger className="h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black text-slate-600 uppercase tracking-[0.2em] text-xs px-8 md:px-10">
                                <SelectValue placeholder="Condition" />
                              </SelectTrigger>
                              <SelectContent className="rounded-3xl border-slate-200 bg-white text-slate-800 shadow-xl p-2">
                                <SelectItem value="new">NEW</SelectItem>
                                <SelectItem value="used">USED</SelectItem>
                                <SelectItem value="refurbished">REFURBISHED</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Full Specifications / Details</Label>
                        <Textarea 
                          {...register("description")} 
                          id="description" 
                          placeholder="Provide detailed description here..." 
                          className="min-h-[200px] md:min-h-[250px] rounded-[2rem] md:rounded-[3rem] border-slate-100 bg-slate-50 p-8 md:p-10 text-lg md:text-xl font-medium leading-relaxed focus:ring-emerald-500 shadow-inner no-scrollbar" 
                        />
                        {errors.description && <p className="text-red-500 text-[10px] font-black uppercase block text-left ml-2">{errors.description.message}</p>}
                      </div>

                      <div className="space-y-8">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Extended Capabilities</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                          {(() => {
                            let features = ["Warranty Included", "Home Delivery", "Verified History", "Negotiable Price", "Urgent Sale", "Exchange Possible", "Installment Plan", "Good Condition"];
                            if (watchCategory === "property") features = ["Installment", "Approved Society", "Park Facing", "Corner Plot", "Furnished", "Ready to Move", "Security", "Negotiable"];
                            else if (watchCategory === "jobs") features = ["Remote", "Full-time", "Part-time", "Contract", "Health Insurance", "Paid Leave", "Flexible Hours", "Urgent Hiring"];
                            else if (watchCategory === "vehicles") features = ["Warranty Included", "First Owner", "Dealer Serviced", "Accident Free", "New Tires", "Urgent Sale", "Exchange Possible", "Installment Plan"];
                            else if (watchCategory === "electronics" || watchCategory === "mobiles") features = ["Under Warranty", "Box Packed", "Used lightly", "Accessories Included", "PTA Approved", "Home Delivery", "Urgent Sale", "Exchange Possible"];
                            else if (watchCategory === "fashion") features = ["Brand New", "Unworn", "Designer", "Limited Edition", "Original Packaging", "Vintage", "Multiple Sizes", "Home Delivery"];
                            else if (watchCategory === "machinery") features = ["Imported", "Local Assembly", "Heavy Duty", "Industrial Grade", "Commercial Use", "Under Warranty", "Working Condition", "Needs Repair"];
                            else if (watchCategory === "general") features = ["Like New", "Used", "Negotiable Price", "Urgent Sale", "Home Delivery", "Exchange Possible", "Handmade", "Vintage"];
                            
                            return features.map((feature) => (
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
                            ));
                          })()}
                        </div>
                      </div>

                      <div className="pt-10 flex flex-col md:flex-row justify-between gap-4">
                        <Button type="button" onClick={prevStep} variant="ghost" className="font-black h-16 md:h-20 px-8 md:px-12 rounded-2xl md:rounded-3xl text-lg md:text-xl uppercase tracking-tighter text-slate-400">
                          <ArrowLeft className="mr-4 w-6 h-6" /> Back
                        </Button>
                        <Button type="button" onClick={nextStep} className="bg-emerald-950 hover:bg-emerald-900 text-white font-black h-16 md:h-20 px-12 md:px-16 rounded-2xl md:rounded-3xl text-lg md:text-xl uppercase tracking-tighter transition-all hover:scale-105">
                          Visibility <ArrowRight className="ml-4 w-6 h-6" />
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
                          <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Media & Contact</h2>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Add photos, videos and contact info</p>
                        </div>
                        <Camera className="w-24 h-24 text-slate-50 hidden md:block" />
                      </div>

                      <div className="space-y-6 md:space-y-8">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Photos</Label>
                        <div className="space-y-4">
                          <div className="relative">
                            <ImageIcon className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500 font-black" />
                            <Input {...register("imageUrl")} id="imageUrl" placeholder="https://example.com/image.jpg" className="pl-16 h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner pr-4 text-xs md:text-base md:px-10" />
                          </div>
                          {errors.imageUrl && <p className="text-red-500 text-[10px] font-black uppercase block text-left ml-2">{errors.imageUrl.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-12">
                        <div className="space-y-4">
                          <Label htmlFor="whatsapp" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">WhatsApp Number (Optional)</Label>
                          <div className="relative">
                            <MessageCircle className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-green-500 font-black" />
                            <Input {...register("whatsapp")} id="whatsapp" placeholder="+92 300 0000000" className="pl-12 md:pl-16 h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner pr-4 text-xs md:text-base md:px-10" />
                          </div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 text-left">
                            This number enables prompt interest from potential buyers via instant messaging.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Email Address (Optional)</Label>
                          <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500 font-black"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            <Input {...register("email")} id="email" type="email" placeholder="hello@example.com" className="pl-12 md:pl-16 h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner pr-4 text-xs md:text-base md:px-10" />
                          </div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 text-left">
                            Buyers can send you email inquiries directly.
                          </p>
                          {errors.email && <p className="text-red-500 text-[10px] font-black uppercase block text-left ml-2">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-4 md:col-span-2">
                          <Label htmlFor="videoUrl" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Video Link (Optional)</Label>
                          <div className="relative">
                            <Youtube className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-red-500 font-black" />
                            <Input {...register("videoUrl")} id="videoUrl" placeholder="https://youtube.com/watch?v=..." className="pl-12 md:pl-16 h-16 md:h-20 rounded-2xl md:rounded-3xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner pr-4 text-xs md:text-base md:px-10" />
                          </div>
                          {errors.videoUrl && <p className="text-red-500 text-[10px] font-black uppercase block text-left ml-2">{errors.videoUrl.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-4 md:space-y-6">
                        <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 block text-left ml-2">Location</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Input 
                            {...register("country")} 
                            placeholder="Country" 
                            className="h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner px-8 md:px-10" 
                          />
                          <Input 
                            {...register("state")} 
                            placeholder="State" 
                            className="h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner px-8 md:px-10" 
                          />
                          <Input 
                            {...register("city")} 
                            placeholder="City" 
                            className="h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner px-8 md:px-10" 
                          />
                        </div>
                        <div className="relative mt-4">
                          <Input 
                            {...register("location")} 
                            placeholder="Full Address / Location" 
                            className="h-16 md:h-20 rounded-2xl md:rounded-3xl text-lg md:text-xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner px-8 md:px-10" 
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
                          <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Final Review</h2>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Check your details before posting</p>
                        </div>
                        <Award className="w-24 h-24 text-slate-50 hidden md:block" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
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
                             <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">Posting Policy</h4>
                             <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px] mt-2">By posting this ad, you agree to our terms and conditions.</p>
                           </div>
                         </div>
                         <Button disabled={isSubmitting} type="submit" className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black h-20 md:h-24 px-12 md:px-16 rounded-2xl md:rounded-[2rem] text-xl md:text-2xl shadow-xl transition-all hover:scale-105 uppercase tracking-tighter">
                            {isSubmitting ? (
                              <Loader2 className="mr-4 h-8 w-8 md:h-10 md:w-10 animate-spin" />
                            ) : (
                              <Zap className="mr-4 h-8 w-8 md:h-10 md:w-10" />
                            )}
                            {isSubmitting ? "POSTING..." : "POST AD"}
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
