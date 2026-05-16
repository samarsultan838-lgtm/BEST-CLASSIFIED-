import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { createArticle, getArticles, deleteArticle, Article } from "../lib/newsService";
import { storage } from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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
  Eye,
  UploadCloud,
  Search,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminNews() {
  const { profile } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("Marketplace Tips");
  
  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoUrl, setVideoUrl] = useState("");
  const [tags, setTags] = useState("");

  // SEO State
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // Scheduling State
  const [scheduledDate, setScheduledDate] = useState("");

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

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileName = `news/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Storage Error:", error);
          // Fallback to base64 if Firebase Storage fails
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        },
        async () => {
           try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
           } catch {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
           }
        }
      );
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return toast.error("Essential fields missing");

    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    setIsPublishing(true);

    try {
      let finalImageUrl = "";
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      await createArticle({
        title,
        content,
        excerpt,
        category,
        image: finalImageUrl,
        videoUrl,
        authorId: profile?.uid || "",
        authorName: profile?.name || "Admin",
        published: !scheduledDate, // Only true if not scheduled
        featured: false,
        tags: tags.split(",").map(t => t.trim()),
        slug,
        seoTitle,
        seoDescription,
        seoKeywords,
        scheduledAt: scheduledDate ? new Date(scheduledDate) : null
      });
      toast.success(scheduledDate ? "Report Scheduled for Deployment" : "Intelligence Report Published");
      setIsCreating(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      toast.error("Deployment Failed");
      console.error(error);
    } finally {
      setIsPublishing(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setExcerpt("");
    setCategory("Marketplace Tips");
    setImageFile(null);
    setImagePreview("");
    setUploadProgress(0);
    setVideoUrl("");
    setTags("");
    setSeoTitle("");
    setSeoDescription("");
    setSeoKeywords("");
    setScheduledDate("");
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
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-300">Excerpt / Subtitle</label>
                       <Textarea 
                         value={excerpt}
                         onChange={(e) => setExcerpt(e.target.value)}
                         placeholder="Brief summary..." 
                         className="min-h-[100px] rounded-3xl border-slate-100 bg-slate-50 p-6 shadow-inner" 
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
                       <select 
                         value={category} 
                         onChange={(e) => setCategory(e.target.value)} 
                         className="w-full bg-white/5 border border-white/10 rounded-xl h-12 font-bold px-4 text-slate-100 focus:outline-none"
                       >
                          <option value="Real Estate News" className="text-slate-900">Real Estate News</option>
                          <option value="Car Market Updates" className="text-slate-900">Car Market Updates</option>
                          <option value="Tech News" className="text-slate-900">Tech News</option>
                          <option value="Marketplace Tips" className="text-slate-900">Marketplace Tips</option>
                          <option value="Business Promotions" className="text-slate-900">Business Promotions</option>
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <Calendar className="w-3 h-3" /> Schedule Publish
                       </label>
                       <Input 
                         type="datetime-local" 
                         value={scheduledDate} 
                         onChange={(e) => setScheduledDate(e.target.value)} 
                         className="bg-white/5 border-white/10 rounded-xl h-12 text-slate-100 flex-row-reverse" 
                       />
                       <p className="text-[9px] text-slate-500">Leave empty to deploy immediately</p>
                    </div>

                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-xs">Visual Cover Image</label>
                       <div 
                         onClick={() => fileInputRef.current?.click()}
                         className={`relative overflow-hidden cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all ${imagePreview ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/20 hover:border-emerald-500 bg-white/5'}`}
                       >
                         {imagePreview ? (
                           <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                             <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                           </div>
                         ) : (
                           <div className="text-center">
                             <UploadCloud className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                             <p className="text-xs font-bold text-slate-300">Click to upload image</p>
                             <p className="text-[10px] font-medium text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                           </div>
                         )}
                         <input 
                           type="file" 
                           ref={fileInputRef} 
                           onChange={handleImageSelect} 
                           accept="image/*" 
                           className="hidden" 
                         />
                       </div>
                       {uploadProgress > 0 && uploadProgress < 100 && (
                         <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
                           <div className="bg-emerald-500 h-1 transition-all" style={{ width: `${uploadProgress}%` }}></div>
                         </div>
                       )}
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

                    <div className="space-y-4 pt-6 border-t border-white/10">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                        <Search className="w-4 h-4" /> SEO Optimization
                      </h4>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-xs">Meta Title</label>
                         <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="SEO Title (60 chars max)" className="bg-white/5 border-white/10 rounded-xl h-10" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-xs">Meta Description</label>
                         <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Compelling meta description for search engines..." className="bg-white/5 border-white/10 rounded-xl min-h-[80px]" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-xs">Focus Keywords</label>
                         <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="keyword1, keyword2" className="bg-white/5 border-white/10 rounded-xl h-10" />
                      </div>
                    </div>

                    <Button type="submit" disabled={isPublishing} className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl shadow-2xl">
                       <Send className="mr-2 h-5 w-5" /> {isPublishing ? 'Deploying...' : scheduledDate ? 'Schedule Report' : 'Deploy Report'}
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
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                       <Badge className="bg-emerald-950 text-emerald-500 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 flex justify-center">{article.category}</Badge>
                       {!article.published && article.scheduledAt && (
                          <Badge className="bg-orange-500 text-white border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 flex justify-center">Scheduled</Badge>
                       )}
                    </div>
                 </div>
                 <CardContent className="p-8">
                    <h3 className="text-xl font-black text-slate-900 leading-none mb-4 group-hover:text-emerald-500 transition-colors">{article.title}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 line-clamp-2">{article.excerpt || "No summary available for this intelligence report."}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-3">
                          <Eye className="w-4 h-4 text-emerald-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{article.publishedAt?.toDate ? format(article.publishedAt.toDate(), "MMM dd, yyyy") : article.scheduledAt?.toDate ? `Scheduled ${format(article.scheduledAt.toDate(), "MMM dd, yyyy")}` : "Recent"}</span>
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
