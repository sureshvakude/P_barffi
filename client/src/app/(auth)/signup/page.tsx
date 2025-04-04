"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/ui/card";
import { sendOtpEmail } from "@/lib/sendOtpToUser";

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [serverOtp, setServerOtp] = useState("");

  const onProviderSignUp = async (provider: "github" | "google") => {
    setLoading(true);
    setLoadingGithub(provider === "github");
    setLoadingGoogle(provider === "google");
    await signIn(provider, { callbackUrl: "/" });
  };

  const sendOtp = async () => {
    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
      return;
    }
    setLoading(true);
    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random OTP (6 digits)
      setServerOtp(otpCode);
      const result = await sendOtpEmail(email, otpCode);
      if (result.success) {
        setOtpSent(true);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp === serverOtp) {
      onCredentialSignUp(e);
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const onCredentialSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      window.location.href = "/signin";
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md mx-auto p-8 shadow-md">
        <CardHeader className="text-center">
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Sign up with email or a provider</CardDescription>
        </CardHeader>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <CardContent className="space-y-4">
          {!otpSent ? (
            <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="space-y-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                type="text"
                required
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                required
              />
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                required
                minLength={6}
              />
              <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300" type="submit" size="lg" disabled={loading}>
                {loading ? <Loader2 className="animate-spin size-5 mr-2" /> : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-3">
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                type="text"
                required
              />
              <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300" type="submit" size="lg" disabled={loading}>
                {loading ? <Loader2 className="animate-spin size-5 mr-2" /> : "Verify OTP"}
              </Button>
            </form>
          )}

          <Separator />

          <div className="flex flex-col gap-y-2">
            <Button
              onClick={() => onProviderSignUp("google")}
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              disabled={loadingGoogle}
            >
              {loadingGoogle ? <Loader2 className="animate-spin size-5" /> : <FcGoogle className="size-5" />}
              Continue with Google
            </Button>

            <Button
              onClick={() => onProviderSignUp("github")}
              variant="outline"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              disabled={loadingGithub}
            >
              {loadingGithub ? <Loader2 className="animate-spin size-5" /> : <FaGithub className="size-5" />}
              Continue with GitHub
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/signin">
              <span className="text-sky-700 hover:underline">Sign in</span>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;