"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/auth";
import { LayoutDashboard, Map, BarChart3, LogOut, Menu } from "lucide-react";
import { useAuth } from "../auth/auth-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { toast } from "@/hooks/use-sonner";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [, setOpen] = useState(false);

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      title: "Map View",
      href: "/map",
      icon: <Map size={18} />,
    },
    {
      title: "Charts",
      href: "/charts",
      icon: <BarChart3 size={18} />,
    },
  ];

  const handleLogout = async () => {
    const results = await signOutUser();
    if (results.success) toast.success("Logged out successfully");
    else {
      toast.error("Something went wrong", {
        description: "Please try again later",
      });
    }
    router.push("/login");
  };

  if (!user) return null;

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="text-[#a789fc]" />
            <span className="sr-only text-[var(--color-text)]">
              Toggle menu
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full border-1 border-[#c3b4fe] bg-[var(--color-dark-blue)]">
            <div className="flex items-center justify-between p-4 border-b">
              <div
                onClick={() => router.push("/")}
                className="flex items-center gap-2 cursor-pointer font-semibold text-xl">
                <LayoutDashboard className="h-6 w-6 text-[#a789fc]" />
                <span className="text-[#5b1eb9] tracking-[0.02rem]">
                  ProjectPulse
                </span>
              </div>
              {/* <Button variant="ghost" size="icon">
                <X size={18} className="text-[#a789fc]" />
              </Button> */}
            </div>
            <div className="flex-1 py-4">
              <nav className="flex flex-col gap-1 px-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      pathname === item.href ||
                        pathname?.startsWith(`${item.href}/`)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-primary/5"
                    )}>
                    {item.icon}
                    <span className="text-[var(--color-text)]">
                      {item.title}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start text-[#6d25dc]">
                <LogOut size={16} className="mr-2 text-[#a789fc]" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors",
              pathname === item.href || pathname?.startsWith(`${item.href}/`)
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}>
            {item.icon}
            <span className="text-[var(--color-text)]">{item.title}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navbar;
