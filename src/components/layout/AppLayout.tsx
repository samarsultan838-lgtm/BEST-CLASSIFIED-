import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MessageSquare, PlusCircle, Search, Menu, User, LogOut, LayoutDashboard, Newspaper, ShieldCheck } from "lucide-react";
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
  const isNavigable = !["/login", "/signup", "/admin/login"].includes(location.pathname);

  if (!isNavigable) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-orange-500 p-1.5 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">TRAZOT</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/search" className="text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors flex items-center gap-1">
                <Search className="w-4 h-4" /> Browse
              </Link>
              <Link to="/news" className="text-sm font-medium text-slate-600 hover:text-orange-500 transition-colors flex items-center gap-1">
                <Newspaper className="w-4 h-4" /> News
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4 mr-4 text-sm font-medium">
              <a href="tel:+923001887808" className="flex items-center gap-1.5 text-slate-600 hover:text-orange-500 transition-colors">
                <Phone className="w-4 h-4" /> +923001887808
              </a>
            </div>

            {profile ? (
              <div className="flex items-center gap-4">
                <Link to="/post-ad" className="hidden sm:flex">
                  <Button variant="default" className="bg-orange-500 hover:bg-orange-600">
                    <PlusCircle className="mr-2 h-4 w-4" /> Post Ad
                  </Button>
                </Link>

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
                          <Link to="/admin" className="cursor-pointer text-orange-600">
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
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/search" className="text-lg font-medium">Browse Ads</Link>
                  <Link to="/news" className="text-lg font-medium">Market News</Link>
                  <Link to="/about" className="text-lg font-medium">About Trazot</Link>
                  <Link to="/contact" className="text-lg font-medium">Contact Us</Link>
                  {profile && (
                    <Link to="/post-ad" className="text-lg font-medium text-orange-500 font-bold">Post an Ad</Link>
                  )}
                  <hr />
                  <div className="flex flex-col gap-2 mt-4 text-sm text-slate-500">
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +923001887808</p>
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@trazot.com</p>
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
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2 text-white">
                <ShieldCheck className="w-8 h-8 text-orange-500" />
                <span className="text-2xl font-bold tracking-tight">TRAZOT</span>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs">
                Buy & Sell Anything, Anywhere — Trusted Marketplace for everything you need. Quality checked and verified sellers.
              </p>
              <div className="flex items-center gap-4 pt-2">
                {/* Social icons would go here */}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Contact Support</Link></li>
                <li><Link to="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Popular Categories</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/search?category=vehicles" className="hover:text-orange-500 transition-colors">Vehicles</Link></li>
                <li><Link to="/search?category=property" className="hover:text-orange-500 transition-colors">Property</Link></li>
                <li><Link to="/search?category=electronics" className="hover:text-orange-500 transition-colors">Electronics</Link></li>
                <li><Link to="/search?category=jobs" className="hover:text-orange-500 transition-colors">Jobs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a href="tel:+923001887808" className="flex items-center gap-3 hover:text-orange-500 transition-colors">
                    <div className="bg-slate-800 p-2 rounded-full"><Phone className="w-4 h-4" /></div>
                    +923001887808
                  </a>
                </li>
                <li>
                  <a href="mailto:info@trazot.com" className="flex items-center gap-3 hover:text-orange-500 transition-colors">
                    <div className="bg-slate-800 p-2 rounded-full"><Mail className="w-4 h-4" /></div>
                    info@trazot.com
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-full"><Search className="w-4 h-4" /></div>
                    <span>Global Marketplace</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 text-center">
            <p>© 2025 Trazot.com — All Rights Reserved</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
