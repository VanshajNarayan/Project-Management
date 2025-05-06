"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/auth";
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
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { success, error } = await resetPassword(email);

      if (error) {
        toast.error("Password reset failed", {
          description: error,
        });
        return;
      }

      if (success) {
        setSubmitted(true);
        toast.success("Password reset email sent", {
          description:
            "Check your email for instructions to reset your password",
        });
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
    <div className="min-h-screen bg-gradient-to-tr from-[#eae6fd] to-[#f8f8ff] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 rounded-2xl bg-white">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-[#c3b4fe]/20 p-3 rounded-full">
              <LayoutDashboard className="h-6 w-6 text-[#a789fc]" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-[#2e0f66] leading-4">
            {submitted ? "Check your email" : "Reset your password"}
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            <span className="font-normal mt-2">
              {submitted
                ? `We've sent a password reset link to ${email}`
                : "Enter your email address and we will send you a link to reset your password"}
            </span>
          </CardDescription>
        </CardHeader>
        {!submitted ? (
          <form onSubmit={handleResetPassword}>
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
            </CardContent>
            <CardFooter className="flex flex-col mt-6 px-6 pb-6 space-y-4">
              <Button
                type="submit"
                className="w-full bg-[#a789fc] hover:bg-[#ab8ffa] text-white font-semibold rounded-xl transition-all duration-200 cursor-pointer"
                disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <div className="text-center text-sm">
                <Link
                  href="/login"
                  className="text-center text-sm text-muted-foreground flex justify-center items-center gap-1">
                  <ArrowLeft className="h-3 w-3" />
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </form>
        ) : (
          <CardFooter className="flex flex-col space-y-4 pt-6">
            <p className="text-center text-sm text-muted-foreground mb-4">
              Didn&apos;t receive the email? Check your spam folder or try
              again.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSubmitted(false)}>
              Try again
            </Button>
            <div className="text-center text-sm">
              <Link
                href="/login"
                className="text-primary hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Back to login
              </Link>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
