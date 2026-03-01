import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bookmark,
  ChevronDown,
  FileText,
  LogOut,
  Menu,
  Shield,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const navLinks = [
  { href: "/tenders" as const, label: "Tenders", icon: FileText },
  { href: "/saved" as const, label: "Saved", icon: Bookmark },
  { href: "/analytics" as const, label: "Analytics", icon: BarChart3 },
  { href: "/profile" as const, label: "Profile", icon: User },
];

export function Navbar() {
  const { identity, clear } = useInternetIdentity();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-4)}`
    : "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-navy shadow-navy">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/tenders" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md gradient-gold flex items-center justify-center shadow-sm">
              <Shield className="w-4 h-4 text-navy" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-base text-white tracking-tight">
                TenderSmart
              </span>
              <span className="text-[10px] text-gold/80 font-medium tracking-wider uppercase">
                Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  to={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {identity && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center gap-1.5 text-white/80 hover:text-white hover:bg-white/10 h-8"
                  >
                    <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                      <User className="w-3 h-3 text-gold" />
                    </div>
                    <span className="text-xs font-mono">{shortPrincipal}</span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={clear}
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10 h-8 w-8"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-2 animate-fade-in">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-0.5 ${
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
            {identity && (
              <button
                type="button"
                onClick={() => {
                  clear();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-white/10 w-full mt-1"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
            {shortPrincipal && (
              <div className="px-3 py-2 mt-1 border-t border-white/10">
                <Badge
                  variant="outline"
                  className="text-xs text-gold/70 border-gold/20 font-mono"
                >
                  {shortPrincipal}
                </Badge>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
