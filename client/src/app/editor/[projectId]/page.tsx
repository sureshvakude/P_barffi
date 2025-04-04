"use client";

import Link from "next/link";
import { Loader, TriangleAlert } from "lucide-react";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useCreateProject } from "@/features/projects/api/use-create-project";
import { Editor } from "@/features/editor/components/editor";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type project = {
  id: string;
  name?: string;
  json?: string;
  width?: number;
  height?: number;
  isPro?: boolean;
  prize?: number | null;
  isTemplate?: boolean;
  updatedAt?: string;
  createdAt?: string;
};

const EditorProjectIdPage = ({ params }: { params: Promise<{ projectId: string }> }) => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [localProject, setLocalProject] = useState<project>(null);
  const [newProjectData, setNewProjectData] = useState<project>(null);
  const { data: session } = useSession();

  useEffect(() => {
    params.then(({ projectId }) => setProjectId(projectId)).catch(console.error);
  }, [params]);

  const { data, isLoading, isError } = useGetProject(projectId ?? "");
  const createProjectMutation = useCreateProject();

  useEffect(() => {
    const createProject = async () => {
      if (!data) return; // Ensure `data` exists

      if (session) {
        try {
          const newProject = await createProjectMutation.mutateAsync(data);
          setNewProjectData({ ...data, id: newProject?.projectId }); // Store new project in state
        } catch (error) {
          console.error("Project creation error:", error);
        }
      } else {
        localStorage.setItem("barffi_project", JSON.stringify(data)); // Store only one project
        setLocalProject(data);
      }
    };

    createProject();
  }, [session, data, projectId]);

  const projectData = session ? newProjectData || data : localProject;

  if (isLoading || !projectData) {
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

  return <Editor initialData={projectData} />;
};

export default EditorProjectIdPage;