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
            <h3 className="font-semibold text-lg">Start from a pre-defined Templates</h3>

            {projects && projects.length === 0 ? (
                <div className="flex flex-col gap-y-4 items-center justify-center h-32">
                    <TriangleAlert className="size-6 text-muted-foreground" />
                    <p>No templates found</p>
                </div>
            ) : (
                <div className="flex flex-wrap items-center jusitfy-center gap-4 mt-4">
                    {projects?.map((template: any) => (
                        <TemplateCard
                            key={template?.id}
                            title={template?.name}
                            canvasJson={template?.json || ""}
                            onClick={() => router.push(`/editor/${template?.id}`)}
                            width={template?.width}
                            height={template?.height}
                            isPro={template?.isPro}
                        />
                    ))}
                </div>
            )
            }
        </div >
    );
};
