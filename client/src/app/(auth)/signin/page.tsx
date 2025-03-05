"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2, TriangleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/ui/card";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const params = useSearchParams();
  const error = params.get("error");

  const onProviderSignUp = (provider: "github" | "google") => {
    setLoading(true);
    setLoadingGithub(provider === "github");
    setLoadingGoogle(provider === "google");

    signIn(provider, { callbackUrl: "/" });
  };

  const onCredentialSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setLoadingLogin(true);

    signIn("credentials", {
      email: email,
      password: password,
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-8 shadow-lg rounded-2xl bg-white">
        <CardHeader className="px-0 pt-0 text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">Login to continue</CardTitle>
          <CardDescription className="text-gray-500">
            Use your email or another service to continue
          </CardDescription>
        </CardHeader>

        {!!error && (
          <div className="bg-red-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-600 mb-6">
            <TriangleAlert className="size-4" />
            <p>Invalid email or password</p>
          </div>
        )}

        <CardContent className="space-y-5 px-0 pb-0">
          {/* Email & Password Login */}
          <form onSubmit={onCredentialSignIn} className="space-y-2.5">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              disabled={loading || loadingLogin}
              required
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              disabled={loading || loadingLogin}
              required
            />
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300"
              type="submit"
              size="lg"
              disabled={loading}
            >
              {loadingLogin ? (
                <Loader2 className="mr-2 size-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <Separator />

          {/* Social Logins */}
          <div className="flex flex-col gap-y-2.5">
            <Button
              onClick={() => onProviderSignUp("google")}
              variant="outline"
              size="lg"
              className="w-full relative border-gray-300 hover:bg-gray-100 transition-all duration-300"
              disabled={loading}
            >
              {loadingGoogle ? (
                <Loader2 className="mr-2 size-5 top-2.5 left-2.5 absolute animate-spin" />
              ) : (
                <FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute" />
              )}
              Continue with Google
            </Button>

            <Button
              onClick={() => onProviderSignUp("github")}
              variant="outline"
              size="lg"
              className="w-full relative border-gray-300 hover:bg-gray-100 transition-all duration-300"
              disabled={loading}
            >
              {loadingGithub ? (
                <Loader2 className="mr-2 size-5 top-2.5 left-2.5 absolute animate-spin" />
              ) : (
                <FaGithub className="mr-2 size-5 top-2.5 left-2.5 absolute text-gray-700" />
              )}
              Continue with Github
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-xs text-gray-500 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" onClick={() => setLoading(true)}>
              <span className="text-blue-600 font-medium hover:underline">Sign up</span>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
