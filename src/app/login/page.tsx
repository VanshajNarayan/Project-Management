"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-sonner";
import { LayoutDashboard } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, error } = await signInUser(email, password);

      if (error) {
        toast.error("Login failed", {
          description: error,
        });
        return;
      }

      if (user) {
        toast.success("Logged in successfully", {
          description: "Welcome back!",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(`Something went wrong ${error}`, {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#eae6fd] to-[#f8f8ff] px-4">
      <Card className="w-full max-w-md border-0 rounded-2xl bg-white">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-[#c3b4fe]/20 p-3 rounded-full">
              <LayoutDashboard className="h-6 w-6 text-[#a789fc]" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-[#2e0f66] leading-4">
            Welcome back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your <span className="font-medium">ProjectPulse</span>{" "}
            account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5 px-6">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full max-w-lg bg-white border-[#ddd5ff] rounded-xl focus:ring-2 focus:ring-[#c3b4fe] focus:border-[#8443f1] transition-all px-4 py-2 text-sm text-[#2e0f66] font-medium"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full max-w-lg bg-white border-[#ddd5ff] rounded-xl focus:ring-2 focus:ring-[#c3b4fe] focus:border-[#8443f1] transition-all px-4 py-2 text-sm text-[#2e0f66] font-medium"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col mt-6 px-6 pb-6 space-y-4">
            <Button
              type="submit"
              className="w-full bg-[#a789fc] hover:bg-[#ab8ffa] text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer"
              disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
