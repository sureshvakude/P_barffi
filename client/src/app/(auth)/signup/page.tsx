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

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onProviderSignUp = async (provider: "github" | "google") => {
    setLoading(true);
    setLoadingGithub(provider === "github");
    setLoadingGoogle(provider === "google");

    await signIn(provider, { callbackUrl: "/" });
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

      // Auto-login after successful signup
      await signIn("credentials", { email, password, callbackUrl: "/" });
    } catch (error: any) {
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
          <form onSubmit={onCredentialSignUp} className="space-y-3">
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
            <Button className="w-full" type="submit" size="lg" disabled={loading}>
              {loading ? <Loader2 className="animate-spin size-5 mr-2" /> : "Sign Up"}
            </Button>
          </form>

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
