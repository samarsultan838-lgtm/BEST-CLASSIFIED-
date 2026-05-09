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

// Import Google icon from somewhere or use an SVG
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function AdminLoginPage() {
  const { signInWithEmail, signInWithGoogle, profile } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  useEffect(() => {
    // If already logged in and admin, redirect to admin dashboard
    if (profile?.role === "admin") {
      navigate("/admin");
    }
  }, [profile, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please provide both email and password");
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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Admin clearance verified via Google.");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      console.error(error);
    } finally {
      setGoogleLoading(false);
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
            <Button 
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                variant="outline"
                className="w-full bg-white hover:bg-slate-50 text-slate-900 font-black h-16 rounded-xl transition-all uppercase tracking-widest text-sm disabled:opacity-50 border-none"
            >
                {googleLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <><GoogleIcon /> <span className="ml-3">Authorize with Google</span></>}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500 font-black tracking-widest">Or execute manually</span>
              </div>
            </div>

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
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Password</Label>
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
                disabled={loading || googleLoading}
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
