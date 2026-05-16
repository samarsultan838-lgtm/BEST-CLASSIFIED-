import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createArticle, getArticles, deleteArticle, Article } from "../lib/newsService";
import { 
  Plus, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  Save,
  Send,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { AdminNav } from "../components/admin/AdminNav";

export default function AdminNews() {
  const { profile } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Market Update");
  const [image, setImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles(false, 50);
      setArticles(data);
    } catch (error) {
      toast.error("Failed to fetch intelligence reports");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return toast.error("Essential fields missing");

    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    try {
      await createArticle({
        title,
        content,
        excerpt,
        category,
        image,
        videoUrl,
        authorId: profile?.uid || "",
        authorName: profile?.name || "Admin",
        published: true,
        featured: false,
        tags: tags.split(",").map(t => t.trim()),
        slug
      });
      toast.success("Intelligence Report Published");
      setIsCreating(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      toast.error("Deployment Failed");
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setExcerpt("");
    setCategory("Market Update");
    setImage("");
    setVideoUrl("");
    setTags("");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Confirm Deletion of Intelligence Report?")) {
      await deleteArticle(id);
      toast.success("Article Terminated");
      fetchArticles();
    }
  };

  if (isCreating) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
           <button onClick={() => setIsCreating(false)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Abort Mission
           </button>
           <h2 className="text-2xl font-black uppercase tracking-tighter">Draft New Intel</h2>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8 space-y-8">
              <Card className="border-none shadow-2xl rounded-[3rem] p-10 bg-white">
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Report Headline</label>
                       <Input 
                         value={title} 
                         onChange={(e) => setTitle(e.target.value)}
                         placeholder="The Future of E-Commerce 2025" 
                         className="h-20 text-2xl font-black rounded-3xl border-slate-100 bg-slate-50 shadow-inner" 
                        />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Detailed Intelligence (Markdown Supported)</label>
                       <Textarea 
                         value={content}
                         onChange={(e) => setContent(e.target.value)}
                         placeholder="Input full article content here..." 
                         className="min-h-[400px] rounded-3xl border-slate-100 bg-slate-50 p-8 font-medium leading-relaxed shadow-inner" 
                        />
                    </div>
                 </div>
              </Card>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <Card className="border-none shadow-2xl rounded-[3rem] p-10 bg-emerald-950 text-white">
                 <h3 className="text-sm font-black uppercase tracking-widest text-emerald-500 mb-8 flex items-center gap-3">
                    <Save className="w-5 h-5" /> Meta Protocol
                 </h3>
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                       <Input value={category} onChange={(e) => setCategory(e.target.value)} className="bg-white/5 border-white/10 rounded-xl h-12 font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-xs">Visual Asset URL</label>
                       <div className="relative">
                          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                          <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="pl-12 bg-white/5 border-white/10 rounded-xl h-12" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Video link (YouTube/Vimeo)</label>
                       <div className="relative">
                          <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                          <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." className="pl-12 bg-white/5 border-white/10 rounded-xl h-12" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tags (comma separated)</label>
                       <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="crypto, market, elite" className="bg-white/5 border-white/10 rounded-xl h-12" />
                    </div>

                    <Button type="submit" className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl shadow-2xl">
                       <Send className="mr-2 h-5 w-5" /> Deploy Report
                    </Button>
                 </div>
              </Card>
           </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Report Depository</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Intel Assets: {articles.length}</p>
        </div>
        <Button 
          onClick={() => setIsCreating(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black h-16 px-10 rounded-3xl shadow-xl uppercase tracking-tighter"
        >
          <Plus className="mr-2 h-6 w-6" /> Initialize New Intel
        </Button>
      </div>

      <AdminNav />

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="p-20 text-center"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
        ) : articles.length === 0 ? (
          <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 italic text-slate-400 font-bold uppercase tracking-widest text-sm">No Intel Assets Found in System</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden group">
                 <div className="aspect-video relative overflow-hidden">
                    <img src={article.image || "https://picsum.photos/seed/news/800/600"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-4 left-4">
                       <Badge className="bg-emerald-950 text-emerald-500 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">{article.category}</Badge>
                    </div>
                 </div>
                 <CardContent className="p-8">
                    <h3 className="text-xl font-black text-slate-900 leading-none mb-4 group-hover:text-emerald-500 transition-colors">{article.title}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 line-clamp-2">{article.excerpt || "No summary available for this intelligence report."}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-3">
                          <Eye className="w-4 h-4 text-emerald-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{article.publishedAt?.toDate ? format(article.publishedAt.toDate(), "MMM dd, yyyy") : "Recent"}</span>
                       </div>
                       <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-emerald-500"><ExternalLink className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-500" onClick={() => handleDelete(article.id!)}><Trash2 className="w-4 h-4" /></Button>
                       </div>
                    </div>
                 </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
