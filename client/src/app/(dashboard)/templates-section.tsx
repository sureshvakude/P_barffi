"use client";

import { useRouter } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";
import { TemplateCard } from "./template-card";
import { useAdminProjects } from "@/features/projects/hooks/useGetAdminProjects";

export const TemplatesSection = () => {
    const router = useRouter();
    const { data: projects, isLoading, isError } = useAdminProjects();

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Start from a template</h3>
                <div className="flex items-center justify-center h-32">
                    <Loader className="size-6 text-muted-foreground animate-spin" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Start from a template</h3>
                <div className="flex flex-col gap-y-4 items-center justify-center h-32">
                    <TriangleAlert className="size-6 text-muted-foreground" />
                    <p>Failed to load templates</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3 className="font-semibold text-lg">Start from a template</h3>

            {projects && projects.length === 0 ? (
                <div className="flex flex-col gap-y-4 items-center justify-center h-32">
                    <TriangleAlert className="size-6 text-muted-foreground" />
                    <p>No templates found</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 mt-4 gap-4">
                    {projects?.map((template: any) => (
                        <TemplateCard
                            key={template.id}
                            title={template.name}
                            imageSrc={template.thumbnail || ""}
                            onClick={() => router.push(`/editor/${template.id}`)}
                            description={`${template.width} x ${template.height} px`}
                            width={template.width}
                            height={template.height}
                            isPro={template.isPro}
                        />
                    ))}
                </div>
            )
            }
        </div >
    );
};
