import React from "react";
import SEO from "../components/SEO";

interface LegalPageProps {
  title: string;
  content: React.ReactNode;
}

export default function LegalPage({ title, content }: LegalPageProps) {
  return (
    <div className="bg-slate-50 min-h-screen py-20 px-6 font-sans">
      <SEO title={title} description={`Official ${title} for Trazot Elite Marketplace.`} />
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
           <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">{title}</h1>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Effective Protocol Release: May 2026</p>
        </div>

        <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl border border-white">
           <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:font-medium prose-p:text-slate-500 leading-relaxed text-lg">
              {content}
           </div>
        </div>

        <div className="text-center pt-10">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
             For any clarification regarding our protocols, reach out to <span className="text-emerald-500 underline">support@trazot.com</span>
           </p>
        </div>
      </div>
    </div>
  );
}
