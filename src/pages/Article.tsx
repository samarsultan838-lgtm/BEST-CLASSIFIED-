import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, Calendar, Share2, ArrowRight, Bookmark, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { getArticleBySlug, getArticles, Article } from "../lib/newsService";
import { format } from "date-fns";
import SEO from "../components/SEO";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const data = await getArticleBySlug(slug!);
      if (data) {
        setArticle(data);
        const relatedData = await getArticles(true, 3);
        setRelated(relatedData.filter(a => a.id !== data.id));
      }
    } catch (error) {
      console.error("Failed to fetch article:", error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Article Not Found</h2>
        <p className="text-slate-500 mb-8 font-medium">The intelligence report you're seeking doesn't exist or has been archived.</p>
        <Link to="/news">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black h-16 px-10 rounded-2xl">Return to Newsroom</Button>
        </Link>
      </div>
    );
  }

  const videoId = article.videoUrl ? getYouTubeId(article.videoUrl) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [article.image || "https://trazot.com/default-news.jpg"],
    "datePublished": article.publishedAt?.toDate ? article.publishedAt.toDate().toISOString() : new Date().toISOString(),
    "dateModified": article.updatedAt?.toDate ? article.updatedAt.toDate().toISOString() : new Date().toISOString(),
    "author": [{
      "@type": "Person",
      "name": article.authorName,
      "url": "https://trazot.com"
    }]
  };

  return (
    <div className="bg-white min-h-screen pb-32">
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
      <SEO 
        title={article.title} 
        description={article.excerpt || article.content.substring(0, 160)}
        type="article"
        image={article.image}
      />
      
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <Button variant="ghost" className="mb-12 gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-emerald-500 bg-slate-50 rounded-xl" onClick={() => navigate("/news")}>
             <ChevronLeft className="w-4 h-4" /> Back to Newsroom
          </Button>

          <div className="space-y-8 mb-16">
             <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black px-6 py-2 rounded-xl uppercase tracking-widest text-[10px]">{article.category}</Badge>
             <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase">{article.title}</h1>
             
             <div className="flex flex-wrap items-center gap-12 py-10 border-y border-slate-50">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-emerald-500 text-emerald-950 flex items-center justify-center rounded-2xl font-black text-lg">
                      {article.authorName.charAt(0)}
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Reporter</p>
                      <p className="font-black text-slate-900 text-lg">{article.authorName}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-500 border border-slate-100 shadow-inner">
                      <Calendar className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Released</p>
                      <p className="font-black text-slate-900 text-lg">
                        {article.publishedAt?.toDate ? format(article.publishedAt.toDate(), "MMM dd, yyyy") : "RECENT"}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                   <Button variant="ghost" size="icon" className="w-14 h-14 bg-slate-50 rounded-2xl text-slate-300 hover:text-emerald-500 transition-all"><Share2 className="w-6 h-6" /></Button>
                   <Button variant="ghost" size="icon" className="w-14 h-14 bg-slate-50 rounded-2xl text-slate-300 hover:text-emerald-500 transition-all"><Bookmark className="w-6 h-6" /></Button>
                </div>
             </div>
          </div>

          {videoId ? (
            <div className="aspect-video bg-black rounded-[3rem] overflow-hidden mb-16 shadow-2xl relative border-8 border-slate-50">
               <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0`} 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
               ></iframe>
            </div>
          ) : article.image ? (
            <div className="aspect-video bg-slate-100 rounded-[3rem] overflow-hidden mb-16 shadow-2xl relative border-8 border-slate-50">
               <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
          ) : null}

          <div className="prose prose-2xl max-w-none prose-slate prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-slate-500 prose-p:font-medium prose-p:leading-relaxed prose-strong:text-slate-900 prose-img:rounded-[2.5rem] prose-img:shadow-2xl">
             <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          {/* Call to Action */}
          <div className="my-20 bg-emerald-950 rounded-[4rem] p-16 text-white text-center relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px]"></div>
             <div className="relative z-10">
                <h3 className="text-4xl font-black mb-6 uppercase tracking-tighter">Ready to Execute?</h3>
                <p className="text-emerald-500/60 font-black mb-10 text-xs uppercase tracking-widest max-w-md mx-auto">Join the most secure ecosystem for luxury marketplace intelligence in Pakistan.</p>
                <Link to="/signup">
                   <Button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black h-20 px-16 rounded-3xl text-xl uppercase tracking-tighter">
                      Initialize Account
                   </Button>
                </Link>
             </div>
          </div>

          {/* Related Intel */}
          {related.length > 0 && (
            <div className="mt-32 pt-20 border-t border-slate-100">
               <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Related Intelligence</h3>
                  <Link to="/news" className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 group">
                     Explore All Reports <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </Link>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {related.map(a => (
                    <Link key={a.id} to={`/news/${a.slug}`} className="group">
                      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden group-hover:shadow-[0_40px_80px_rgba(16,185,129,0.1)] transition-all duration-500 bg-white">
                         <div className="aspect-[2/1] bg-slate-100 overflow-hidden relative">
                            <img src={a.image || "https://picsum.photos/seed/related/800/400"} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            {a.videoUrl && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"><Play className="w-6 h-6 fill-white" /></div></div>}
                         </div>
                         <CardContent className="p-8">
                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">{a.category}</div>
                            <h4 className="text-xl font-black text-slate-900 group-hover:text-emerald-500 transition-colors uppercase tracking-tight leading-tight">{a.title}</h4>
                         </CardContent>
                      </Card>
                    </Link>
                  ))}
               </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
