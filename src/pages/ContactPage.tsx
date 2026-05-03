import React from "react";
import LegalPage from "./LegalPage";
import { Mail, Phone, MapPin, MessageSquare, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <LegalPage 
      title="Contact Support"
      content={
        <div className="space-y-12">
          <p className="text-xl font-medium text-slate-500 leading-relaxed">
            Our Elite Support team is standing by 24/7 to assist with your marketplace needs. 
            Whether you require assistance with merchant verification or ad promotion, we are here.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group hover:border-emerald-500 transition-colors">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Direct Intelligence</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">Electronic Correspondence</p>
              <a href="mailto:info@trazot.com" className="text-xl font-black text-emerald-600 hover:text-emerald-500 transition-colors">info@trazot.com</a>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group hover:border-emerald-500 transition-colors">
              <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Direct Line</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6">Voice Comms Protocol</p>
              <a href="tel:+923001887808" className="text-xl font-black text-emerald-600 hover:text-emerald-500 transition-colors">+923001887808</a>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Standard Operations</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 py-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><Clock className="w-5 h-5" /></div>
                <div>
                   <p className="text-slate-900 font-black uppercase text-xs tracking-widest">Support Hours</p>
                   <p className="text-slate-500 font-medium font-mono text-sm leading-none">24/7/365 GLOBAL AVAILABILITY</p>
                </div>
              </div>
              <div className="flex items-center gap-4 py-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400"><MessageSquare className="w-5 h-5" /></div>
                <div>
                   <p className="text-slate-900 font-black uppercase text-xs tracking-widest">Live Chat</p>
                   <p className="text-slate-500 font-medium text-sm leading-none">AVAILABLE VIA MERCHANT DASHBOARD</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-950 p-12 rounded-[3rem] text-white overflow-hidden relative not-prose">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full"></div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 relative z-10">Elite Merchant Inquiry?</h3>
            <p className="text-emerald-100/60 font-medium text-lg leading-relaxed mb-10 relative z-10">
              For high-volume sellers and enterprise grade inventory, our specialized trade desk is at your disposal.
            </p>
            <button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black px-10 py-5 rounded-2xl uppercase tracking-tighter relative z-10 transition-transform active:scale-95 shadow-2xl shadow-emerald-500/20">
              Request Verification Protocol
            </button>
          </div>
        </div>
      }
    />
  );
}
