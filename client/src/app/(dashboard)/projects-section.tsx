"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Loader, MoreHorizontal, Search, Trash } from "lucide-react";
// import { CopyIcon, FileIcon } from "lucide-react";
import { useUserProjects } from "@/features/projects/hooks/useGetUserProjects";
import { DropdownMenuContent, DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useDeleteProject } from "@/features/projects/api/use-delete-project";

export const ProjectsSection = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [localProjects, setLocalProjects] = useState<any[]>([]);
  const { deleteProject } = useDeleteProject();

  // Fetch projects from database if logged in
  const { data: projects, isLoading, isError, refetch } = useUserProjects({ enabled: !!session });

  // If no session, get projects from localStorage
  useEffect(() => {
    if (!session) {
      const storedProject = localStorage.getItem("barffi_project");
      if (storedProject) {
        setLocalProjects([JSON.parse(storedProject)]);
      }
    }
  }, [session]);

  const finalProjects = session ? projects : localProjects;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <AlertTriangle className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Failed to load projects</p>
        </div>
      </div>
    );
  }

  if (!finalProjects || finalProjects.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Search className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">No projects found</p>
        </div>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    const result = await deleteProject(id);
    if (result.success && session) {
      refetch();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Recent projects</h3>
      <Table>
        <TableBody>
          {finalProjects.map((project: any, index: any) => (
            <TableRow key={project.id || index}>
              <TableCell
                onClick={() => router.push(`/project-editor/${project.id}`)}
                className="font-medium flex items-center gap-x-2 cursor-pointer"
              >
                <Image
                  src={project.thumbnail || "/uploads/placeholder.jpg"}
                  alt="Project thumbnail"
                  width={40}
                  height={40}
                  className="rounded-md"
                />
                {project.name}
              </TableCell>
              <TableCell
                onClick={() => router.push(`/project-editor/${project.id}`)}
                className="hidden md:table-cell cursor-pointer"
              >
                {project.width} x {project.height} px
              </TableCell>
              <TableCell
                onClick={() => router.push(`/project-editor/${project.id}`)}
                className="hidden md:table-cell cursor-pointer"
              >
                {project.updatedAt && getTimeAgo(project?.updatedAt)}

              </TableCell>
              <TableCell className="flex items-center justify-end">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button disabled={false} size="icon" variant="ghost">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    {/* <DropdownMenuItem className="h-10 cursor-pointer" onClick={() => console.log("Copy project", project.id)}>
                      <CopyIcon className="size-4 mr-2" />
                      Make a copy
                    </DropdownMenuItem> */}
                    <DropdownMenuItem className="h-10 cursor-pointer" onClick={() => handleDelete(project.id)}>
                      <Trash className="size-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper function to format "time ago"
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}