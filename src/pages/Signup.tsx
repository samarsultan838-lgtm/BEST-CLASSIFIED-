import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ShieldCheck, Mail, Lock, User, UserPlus, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner";

export default function SignupPage() {
  const { signInWithGoogle, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up with Google");
      console.error(error);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, name);
      toast.success("Identity created. Welcome to the network!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create identity");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 font-sans">
      <Link to="/" className="absolute top-12 left-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600 transition-all">
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="w-full max-w-xl"
      >
        <Card className="shadow-[0_80px_160px_rgba(0,0,0,0.1)] border-none rounded-[3.5rem] overflow-hidden bg-white">
          <CardHeader className="space-y-4 md:space-y-6 text-center p-8 sm:p-12 md:p-16 pb-6 md:pb-12">
            <div className="mx-auto bg-emerald-500 p-4 rounded-3xl w-max shadow-2xl shadow-emerald-500/30 rotate-6">
              <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-emerald-950" />
            </div>
            <div>
              <CardTitle className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">Merchant Enrollment</CardTitle>
              <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                Create your credentials for the global network
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 md:space-y-10 px-6 sm:px-12 md:px-16 pb-8 md:pb-16">
            <form onSubmit={handleEmailSignup} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="fullname" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Full Designation</Label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <Input 
                    id="fullname" 
                    placeholder="John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-14 h-16 rounded-2xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner" 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Merchant Email</Label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@domain.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-14 h-16 rounded-2xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner" 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Master Passkey</Label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Minimum 8 characters" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-14 h-16 rounded-2xl border-slate-100 bg-slate-50 font-black focus:ring-emerald-500 shadow-inner" 
                  />
                </div>
              </div>
              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-black h-20 rounded-3xl transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-tighter text-lg shadow-2xl disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <><UserPlus className="mr-3 w-6 h-6" /> Create Identity</>}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-50" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
                <span className="bg-white px-6 text-slate-200 font-black">Fast Entry</span>
              </div>
            </div>

            <Button onClick={handleGoogleLogin} variant="outline" className="w-full h-16 rounded-2xl font-black border-slate-100 hover:bg-slate-50 uppercase tracking-tighter transition-all group">
                <svg className="mr-3 h-5 w-5 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign up with Google
            </Button>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-50 bg-slate-50/30 p-6 md:p-10">
            <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
              Registered Merchant?{" "}
              <Link to="/login" className="text-emerald-600 hover:underline ml-2">
                Secure Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
