"use client";

import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const UserButton = () => {
  const { data: session } = useSession(); // Get session info
  const router = useRouter();

  if (!session) {
    return (
      <div className="flex justify-center">
        <Button
          variant="default"
          onClick={() => router.push("/signin")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-md transition duration-300 ease-in-out">
          Sign In
        </Button>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  }

  const name = session.user?.name || "Guest";
  const imageUrl = session.user?.image || "";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        {/* <div className="absolute -top-1 -left-1 z-10 flex items-center justify-center">
          <div className="rounded-full bg-white flex items-center justify-center p-1 drop-shadow-sm">
            <Crown className="size-3 text-yellow-500 fill-yellow-500" />
          </div>
        </div> */}
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage alt={name} src={imageUrl} />
          <AvatarFallback className="bg-blue-500 font-medium text-white flex items-center justify-center">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        {/* <DropdownMenuItem className="h-10">
          <CreditCard className="size-4 mr-2" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem className="h-10" onClick={() => router.push("/profile")}>
          <User className="size-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-10" onClick={() => handleLogout()}>
          <LogOut className="size-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
