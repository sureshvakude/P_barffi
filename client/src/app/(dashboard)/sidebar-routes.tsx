"use client";

import { CreditCard, Crown, Home, MessageCircleQuestion } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { SidebarItem } from "./sidebar-item";

export const SidebarRoutes = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-y-4 flex-1">
      <div className="px-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="w-full rounded-xl border-none opacity-50 cursor-not-allowed"
              variant="outline"
              size="lg"
            >
              <Crown className="mr-2 size-4 fill-yellow-500 text-yellow-500" />
              Upgrade to Pro
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Coming soon! This feature is under development.</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="px-3">
        <Separator />
      </div>

      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem href="/" icon={Home} label="Home" isActive={pathname === "/"} />
      </ul>

      <div className="px-3">
        <Separator />
      </div>

      <ul className="flex flex-col gap-y-1 px-3">
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <SidebarItem
                href={pathname}
                icon={CreditCard}
                label="Billing"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Billing is currently under development.</p>
          </TooltipContent>
        </Tooltip> */}

        <SidebarItem
          href="mailto:mybanner369@gmail.com"
          icon={MessageCircleQuestion}
          label="Get Help"
        />
      </ul>
    </div>
  );
};
