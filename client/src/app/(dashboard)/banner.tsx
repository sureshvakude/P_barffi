"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { useSession } from "next-auth/react";

export const Banner = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreateProject();
  const { data: session } = useSession();

  const onClick = () => {
    if (isPending) return;

    mutate(
      { name: "Untitled Project", json: "" },
      {
        onSuccess: (data) => {
          if (data) {
            router.push(`/editor/${data?.projectId}`);
          } else {
            console.error("Project ID missing:", data);
          }
        },
        onError: (error) => {
          console.error("Failed to create project:", error);
        },
      }
    );
  };

  return (
    <div className="text-white aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl bg-gradient-to-r from-[#2e62cb] via-[#0073ff] to-[#3faff5]">
      <div className="rounded-full size-28 items-center justify-center bg-white/50 hidden md:flex">
        <div className="rounded-full size-20 flex items-center justify-center bg-white">
          <Sparkles className="h-20 text-[#0073ff] fill-[#0073ff]" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-xl md:text-3xl font-semibold">
          Visualize your ideas with The Canvas
        </h1>
        <p className="text-xs md:text-sm mb-2">
          Turn inspiration into design in no time. Simply upload an image and let AI do the rest.
        </p>

        {session?.user?.userType === "admin" ? (
          <Button disabled={isPending} onClick={onClick} variant="secondary" className="w-[160px] cursor-pointer">
            Start creating
            {isPending ? <Loader2 className="size-4 ml-2 animate-spin" /> : <ArrowRight className="size-4 ml-2" />}
          </Button>
        ) : (
          <Button variant="secondary" className="w-[160px] cursor-pointer">
            Start creating 👇
          </Button>
        )}
      </div>
    </div>
  );
};
