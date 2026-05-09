import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Fingerprint, Lock, Key, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface AdminSecurityGateProps {
  children: React.ReactNode;
}

export default function AdminSecurityGate({ children }: AdminSecurityGateProps) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState<"pin" | "passkey" | "verifying">("pin");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  // We use a default pin for the prototype, but in production this would be VITE_ADMIN_PROTOCOL_PIN
  const ADMIN_PIN = (import.meta as any).env.VITE_ADMIN_PROTOCOL_PIN || "2024";

  useEffect(() => {
    if (profile && profile.role !== "admin") {
      navigate("/");
    }
  }, [profile, navigate]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setStep("verifying");
      setError("");
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 1500);
    } else {
      setError("Incorrect terminal access code.");
      setPin("");
    }
  };

  const handlePasskeyAuth = async () => {
    setIsScanning(true);
    setError("");

    // Simulate High-Fidelity Biometric/Passkey Auth
    // In a real app, we would use window.PublicKeyCredential or similar WebAuthn API
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Verification successful
      setStep("verifying");
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsAuthenticated(true);
    } catch (err) {
      setError("Passkey verification failed. Try again.");
    } finally {
      setIsScanning(false);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="py-20 flex items-center justify-center bg-slate-50 px-6 relative overflow-hidden min-h-[calc(100vh-4rem-20rem)]">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_70%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter mb-2 uppercase">Admin Protocol</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Security clearance required</p>
          </div>

          <AnimatePresence mode="wait">
            {step === "pin" && (
              <motion.form 
                key="pin"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handlePinSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                      <Lock className="w-3 h-3" /> Terminal PIN (Use: 2024)
                    </label>
                  </div>
                  <Input 
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="h-16 bg-slate-50 border-slate-100 rounded-2xl text-center text-2xl font-black tracking-[1em] text-slate-900 focus:ring-emerald-500/20 focus:border-emerald-500/50 shadow-inner"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black justify-center uppercase tracking-widest">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}

                <Button 
                  type="submit"
                  className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-xs"
                >
                  Verify Access Code
                </Button>
              </motion.form>
            )}

            {step === "verifying" && (
              <motion.div 
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 gap-6"
              >
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <div className="text-center">
                  <h2 className="text-slate-900 font-black uppercase tracking-widest text-[10px] mb-2">Synchronizing Data</h2>
                  <p className="text-slate-400 text-[8px] font-mono leading-relaxed uppercase tracking-wider">
                    DECRYPTING PROTOCOL...<br/>
                    AUTHORIZING USER_ADMIN...<br/>
                    GRANTING TERMINAL ACCESS...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
