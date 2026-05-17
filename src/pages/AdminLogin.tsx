import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signInWithEmail, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.role === "admin") {
      navigate("/admin");
    }
  }, [profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
      // AuthContext will fetch the profile, the useEffect above will trigger navigation if they are admin
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
         toast.error("Invalid secure credentials.");
      } else {
         toast.error(error.message || "Failed to authenticate admin session");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30">
      <div className="absolute top-8 left-8 flex flex-col">
          <div className="flex items-center gap-2 text-white pb-2 mb-2 border-b border-white/5 w-fit">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <span className="font-black tracking-tight text-xl">TRAZOT</span>
          </div>
          <span className="text-emerald-500 text-[10px] font-black tracking-[0.2em] uppercase">Control Protocol</span>
      </div>
      
      <div className="w-full max-w-md">
        <div className="mb-10 animate-fade-in-up">
            <h1 className="text-4xl font-black tracking-tighter text-white mb-3">Admin Identity</h1>
            <p className="text-slate-500 font-bold text-sm">Secure Terminal Access Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 animate-fade-in-up [animation-delay:100ms]">
          <div className="space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Protocol Identifier (Email)</label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                 <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@domain.com" 
                    className="h-14 bg-black/20 border-white/10 text-white pl-12 placeholder:text-slate-600 font-medium rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20" 
                 />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Security Key (Password)</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                 <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••" 
                    className="h-14 bg-black/20 border-white/10 text-white pl-12 placeholder:text-slate-600 font-medium rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20" 
                 />
              </div>
            </div>

            <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black tracking-widest text-sm uppercase rounded-xl mt-4"
            >
              {isSubmitting ? "Authenticating..." : "Initialize Session"}
            </Button>
          </div>
          
          <div className="flex justify-center mt-6">
              <button type="button" onClick={() => navigate("/")} className="text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                 ← Abort & Return to Public Site
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}
