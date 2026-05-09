import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldAlert, Mail, Lock, LogIn, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const { signInWithEmail, profile } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    // If already logged in and admin, redirect to admin dashboard
    if (profile?.role === "admin") {
      navigate("/admin");
    }
  }, [profile, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please provide both email and passkey");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      // AuthContext will fetch the profile, the useEffect above will trigger navigation if they are admin
      toast.success("Admin clearance verified.");
    } catch (error: any) {
       toast.error("Failed to authenticate admin session");
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-sans">
      <Link to="/" className="absolute top-12 left-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-emerald-500 transition-all">
        <ArrowLeft className="w-5 h-5" /> Escape to Public Sector
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="border-slate-800 rounded-3xl overflow-hidden bg-slate-900 border-2">
          <CardHeader className="space-y-6 text-center p-12 pb-8">
            <div className="mx-auto bg-slate-800 p-4 rounded-3xl w-max shadow-2xl relative">
              <ShieldAlert className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Admin Terminal</CardTitle>
              <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                Restricted access protocol
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 px-12 pb-12">
            <form onSubmit={handleEmailLogin} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Admin Identity</Label>
                <div className="relative">
                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@domain.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 rounded-xl border-slate-700 bg-slate-800/50 text-white font-black focus:ring-emerald-500/50 focus:border-emerald-500" 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Security Clearance Key</Label>
                <div className="relative">
                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/50" />
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-14 rounded-xl border-slate-700 bg-slate-800/50 text-white font-black focus:ring-emerald-500/50 focus:border-emerald-500" 
                  />
                </div>
              </div>
              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black h-16 rounded-xl transition-all uppercase tracking-widest text-sm shadow-xl shadow-emerald-900/50 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><LogIn className="mr-3 w-5 h-5" /> Execute Login</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
