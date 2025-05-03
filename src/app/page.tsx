"use client";

import { useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const user = getCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="text-center min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-[var(--color-blue-dark)]">
          ProjectPulse
        </h1>
        <p className="mt-2 text-[#5b1eb9]">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-[#f5f3ff] flex items-center justify-center px-6 py-16">
        <div className="max-w-4xl text-center">
          <LayoutDashboard className="size-12 mb-6 inline-block text-[#a789fc]" />
          <motion.h1
            className="text-5xl font-extrabold text-[#8b59f9] mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            Welcome to <span className="text-black">ProjectPulse</span>
          </motion.h1>

          <motion.p
            className="text-lg text-gray-700 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}>
            Your smart companion for tracking project progress and growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-[#8b59f9] text-white hover:bg-[#7a3ef8] px-8 py-3 pt-2.5 cursor-pointer rounded-xl text-base font-semibold">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
