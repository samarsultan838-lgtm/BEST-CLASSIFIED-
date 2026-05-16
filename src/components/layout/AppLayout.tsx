import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MessageSquare, PlusCircle, Search, Menu, User, LogOut, LayoutDashboard, Newspaper, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/src/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const isAdmin = profile?.role === "admin";
  const isNavigable = !["/login", "/signup", "/admin/login"].includes(location.pathname) && !location.pathname.startsWith("/admin");

  if (!isNavigable) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Utility Bar */}
      <div className="bg-slate-950 text-slate-300 py-1.5 px-4 text-[10px] sm:text-xs font-bold flex justify-between items-center hidden md:flex relative z-[60]">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">TRAZOT — Global Marketplace for Everything</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer h-full flex items-center">
              <span className="flex items-center gap-1 hover:text-white transition-colors py-1">
                🌎 Country <ChevronDown className="w-3 h-3" />
              </span>
              <div className="absolute top-full right-0 mt-1 w-48 bg-slate-900 border border-slate-800 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2 max-h-64 overflow-y-auto z-[70]">
                {['Pakistan', 'China', 'Saudi Arabia', 'Qatar', 'UAE (Dubai)', 'USA', 'New Zealand', 'Canada', 'Europe'].map((country) => (
                  <span key={country} className="p-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">{country}</span>
                ))}
              </div>
            </div>

            <div className="relative group cursor-pointer h-full flex items-center">
              <span className="flex items-center gap-1 hover:text-white transition-colors py-1">
                🗣️ Language <ChevronDown className="w-3 h-3" />
              </span>
              <div className="absolute top-full right-0 mt-1 w-32 bg-slate-900 border border-slate-800 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2 z-[70]">
                {['English', 'Arabic', 'French'].map((lang) => (
                  <span key={lang} className="p-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">{lang}</span>
                ))}
              </div>
            </div>

            <div className="relative group cursor-pointer h-full flex items-center">
              <span className="flex items-center gap-1 hover:text-white transition-colors py-1">
                💵 Currency <ChevronDown className="w-3 h-3" />
              </span>
              <div className="absolute top-full right-0 mt-1 w-32 bg-slate-900 border border-slate-800 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2 z-[70]">
                {['USD', 'PKR', 'AED', 'SAR', 'QAR', 'GBP', 'EUR', 'JPY'].map((currency) => (
                  <span key={currency} className="p-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">{currency}</span>
                ))}
              </div>
            </div>
            
            <a href="mailto:info@trazot.com" className="hover:text-white transition-colors ml-2 py-1">info@trazot.com</a>
          </div>
        </div>
      </div>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-200 group-hover:rotate-6 transition-transform">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">TRAZOT</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <div className="relative group cursor-pointer">
                <span className="text-sm font-black text-slate-700 hover:text-emerald-600 transition-all uppercase tracking-widest flex items-center gap-1">
                  Categories <Menu className="w-3 h-3" />
                </span>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-2">
                  <Link to="/search?category=property" className="p-3 text-sm font-bold text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg">Property</Link>
                  <Link to="/search?category=vehicles" className="p-3 text-sm font-bold text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg">Vehicles</Link>
                  <Link to="/search?category=electronics" className="p-3 text-sm font-bold text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg">Electronics</Link>
                  <Link to="/search?category=fashion" className="p-3 text-sm font-bold text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg">Fashion</Link>
                  <Link to="/search?category=services" className="p-3 text-sm font-bold text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg">Services</Link>
                </div>
              </div>
              <Link to="/search" className="text-sm font-black text-slate-700 hover:text-emerald-600 transition-all uppercase tracking-widest flex items-center gap-2 group">
                 Browse
              </Link>
              <Link to="/news" className="text-sm font-black text-slate-700 hover:text-emerald-600 transition-all uppercase tracking-widest flex items-center gap-2 group">
                 Intelligence
              </Link>
            </nav>
          </div>

          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative flex items-center w-full h-10 rounded-full bg-slate-100 px-4 focus-within:ring-2 ring-emerald-500/50">
              <Search className="w-4 h-4 text-emerald-500 mr-2" />
              <input type="text" placeholder="Search globally..." className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700 w-full" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4 mr-4 text-sm font-black uppercase tracking-widest">
              <a href="tel:+923001887808" className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors">
                <Phone className="w-4 h-4" /> +923001887808
              </a>
            </div>

            {/* Post Ad Button - Always visible, but handled by PrivateRoute */}
            <Link to="/post-ad" className="hidden sm:flex mr-2">
              <Button variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black rounded-xl">
                <PlusCircle className="mr-2 h-4 w-4" /> Post Ad
              </Button>
            </Link>

            {profile ? (
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile.profileImage} alt={profile.name} />
                          <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    }
                  />
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile.name}</p>
                        <p className="text-xs leading-none text-slate-500">{profile.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      render={
                        <Link to="/dashboard" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                        </Link>
                      }
                    />
                    <DropdownMenuItem
                      render={
                        <Link to="/dashboard/messages" className="cursor-pointer">
                          <MessageSquare className="mr-2 h-4 w-4" /> Messages
                        </Link>
                      }
                    />
                    {isAdmin && (
                      <DropdownMenuItem
                        render={
                          <Link to="/admin" className="cursor-pointer text-emerald-600 font-bold">
                            <ShieldCheck className="mr-2 h-4 w-4" /> Admin Panel
                          </Link>
                        }
                      />
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-slate-600">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-navy-900 bg-slate-900 hover:bg-slate-800 text-white">Sign Up</Button>
                </Link>
              </div>
            )}

            <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                }
              />
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="p-8 flex flex-col gap-8 mt-12">
                  <Link to="/search" className="text-3xl font-black uppercase tracking-tighter hover:text-emerald-500 transition-colors">Browse Marketplace</Link>
                  <Link to="/news" className="text-3xl font-black uppercase tracking-tighter hover:text-emerald-500 transition-colors">Intelligence</Link>
                  <Link to="/about" className="text-3xl font-black uppercase tracking-tighter hover:text-emerald-500 transition-colors">History</Link>
                  <Link to="/contact" className="text-3xl font-black uppercase tracking-tighter hover:text-emerald-500 transition-colors">Support</Link>
                  <Link to="/post-ad" className="text-4xl font-black text-emerald-500 tracking-tighter uppercase leading-none">Execute Listing</Link>
                  
                  <div className="pt-12 border-t border-slate-100 flex flex-col gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-500"><Phone className="w-4 h-4" /></div> +923001887808</div>
                    <div className="flex items-center gap-4"><div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-500"><Mail className="w-4 h-4" /></div> info@trazot.com</div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-100/60 pt-20 pb-10 border-t border-emerald-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-3 text-white">
                <div className="bg-emerald-500 p-2 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-emerald-950" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase">TRAZOT</span>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs font-medium">
                Buy & Sell Anything, Anywhere — Trusted Marketplace for everything you need. Quality checked and verified sellers.
              </p>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Quick Links</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Support</Link></li>
                <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Popular Categories</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/search?category=vehicles" className="hover:text-emerald-400 transition-colors">Vehicles</Link></li>
                <li><Link to="/search?category=property" className="hover:text-emerald-400 transition-colors">Property</Link></li>
                <li><Link to="/search?category=electronics" className="hover:text-emerald-400 transition-colors">Electronics</Link></li>
                <li><Link to="/search?category=jobs" className="hover:text-emerald-400 transition-colors">Jobs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Contact Us</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li>
                  <a href="tel:+923001887808" className="flex items-center gap-4 hover:text-emerald-400 transition-colors group">
                    <div className="bg-emerald-900 group-hover:bg-emerald-800 p-2.5 rounded-xl transition-colors"><Phone className="w-4 h-4 text-emerald-400" /></div>
                    +923001887808
                  </a>
                </li>
                <li>
                  <a href="mailto:info@trazot.com" className="flex items-center gap-4 hover:text-emerald-400 transition-colors group">
                    <div className="bg-emerald-900 group-hover:bg-emerald-800 p-2.5 rounded-xl transition-colors"><Mail className="w-4 h-4 text-emerald-400" /></div>
                    info@trazot.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-emerald-900/50 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
            <p>© 2025 Trazot.com — All Rights Reserved</p>
            <div className="flex gap-8">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Protocol</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Engagement</Link>
              {isAdmin && (
                <Link to="/admin" className="text-emerald-500 hover:text-emerald-400 font-black tracking-widest text-[8px] border border-emerald-500/20 px-3 py-1 rounded-full hover:bg-emerald-500/5 transition-all">TERMINAL ACCESS →</Link>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
