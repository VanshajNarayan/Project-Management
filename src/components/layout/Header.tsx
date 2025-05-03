"use client";

import Link from "next/link";
// import { ModeToggle } from "@/components/theme/mode-toggle";
import Navbar from "./Nav";
import { useAuth } from "../auth/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-sonner";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

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

  const userInitial = user?.email ? user.email[0].toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-40 w-full border-1 border-[#c3b4fe] bg-[var(--color-dark-blue)]">
      <div className="container mx-auto flex h-16 items-center">
        <Link href={"/"} className="flex items-center gap-2 mr-6">
          <LayoutDashboard className="h-6 w-6 hidden lg:inline-block text-[#a789fc]" />
          <span className="hidden text-[var(--color-text)] font-bold lg:inline-block">
            ProjectPulse
          </span>
        </Link>

        <Navbar />

        <div className="ml-auto flex items-center gap-2">
          {/* <ModeToggle /> */}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="profile"
                    />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              {/* LOGOUT */}
              <DropdownMenuContent
                align="end"
                className="bg-[var(--color-dark-blue)] border-2 border-[#c3b4fe]">
                <DropdownMenuLabel className="text-[var(--color-text)]">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4 text-[#a789fc]" />
                  <span className="text-[var(--color-text)]">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
