"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";
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

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure your passwords match",
      });
      return;
    }

    setLoading(true);

    try {
      const { user, error } = await registerUser(email, password);

      if (error) {
        toast.error("Signup Failed", { description: error });
        return;
      }

      if (user) {
        toast.success("Account created successfully", {
          description: "Welcome to ProjectPulse!",
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#ede9fe] to-[#fafaff] px-4">
      <Card className="w-full max-w-md border-0 rounded-2xl bg-white">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-[#c3b4fe]/20 p-3 rounded-full">
              <LayoutDashboard className="h-6 w-6 text-[#a789fc]" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-[#2e0f66] leading-4">
            Create an account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your details to get started with{" "}
            <span className="font-medium">ProjectPulse</span>
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSignup}>
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
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full max-w-lg bg-white border-[#ddd5ff] rounded-xl focus:ring-2 focus:ring-[#c3b4fe] focus:border-[#8443f1] transition-all px-4 py-2 text-sm text-[#2e0f66] font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
