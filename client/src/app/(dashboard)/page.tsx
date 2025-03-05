"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Banner } from "./banner";
import { ProjectsSection } from "./projects-section";
import { TemplatesSection } from "./templates-section";

export default function Home() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col space-y-6 max-w-screen-xl mx-auto pb-10">
        <h1 className="text-2xl font-bold">Welcome to the Barffi👋</h1>
        <Banner />
        <TemplatesSection />
        <ProjectsSection />
      </div>
    </QueryClientProvider>
  );
}