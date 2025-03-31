"use client";

import Link from "next/link";
import { Loader, TriangleAlert } from "lucide-react";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { Editor } from "@/features/editor/components/editor";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const EditorProjectIdPage = ({ params }: { params: Promise<{ projectId: string }> }) => {
    const [projectId, setProjectId] = useState<string | null>(null);
    const [localProject, setLocalProject] = useState<any>(null);
    const { data: session } = useSession();

    useEffect(() => {
        params.then(({ projectId }) => setProjectId(projectId)).catch(console.error);
    }, [params]);

    // Fetch project data if session exists (User is logged in)
    const { data: projectData, isLoading, isError } = useGetProject(session ? projectId ?? "" : "");

    // If no session, retrieve from localStorage
    useEffect(() => {
        if (!session) {
            const storedProject = localStorage.getItem("barffi_project");
            if (storedProject) {
                const parsedProject = JSON.parse(storedProject);
                setLocalProject(parsedProject);
            }
        }
    }, [session, projectId]);

    const finalProjectData = session ? projectData : localProject;

    if (isLoading || !finalProjectData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="h-full flex flex-col gap-y-5 items-center justify-center">
                <TriangleAlert className="size-6 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">Failed to fetch project</p>
                <Button asChild variant="secondary">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        );
    }

    return <Editor initialData={finalProjectData} />;
};

export default EditorProjectIdPage;
