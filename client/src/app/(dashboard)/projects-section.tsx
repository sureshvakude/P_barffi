"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, CopyIcon, FileIcon, Loader, MoreHorizontal, Search, Trash } from "lucide-react";
import { useUserProjects } from "@/features/projects/hooks/useGetUserProjects";

import { DropdownMenuContent, DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Table, TableRow, TableBody, TableCell, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export const ProjectsSection = () => {
  const router = useRouter();
  const { data: session } = useSession();

  // ✅ Always call the hook, but only enable fetching when user is logged in
  const { data: projects, isLoading, isError } = useUserProjects({ enabled: !!session });

  if (!session) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <AlertTriangle className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Login to store projects
          </p>
        </div>
      </div>
    );
  }

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
          <p className="text-muted-foreground text-sm">
            Failed to load projects
          </p>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Search className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            No projects found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Recent projects</h3>
      <Table>
        <TableBody>
          {projects.map((project: any) => (
            <TableRow key={project.id}>
              <TableCell
                onClick={() => router.push(`/editor/${project.id}`)}
                className="font-medium flex items-center gap-x-2 cursor-pointer"
              >
                <FileIcon className="size-6" />
                {project.name}
              </TableCell>
              <TableCell
                onClick={() => router.push(`/editor/${project.id}`)}
                className="hidden md:table-cell cursor-pointer"
              >
                {project.width} x {project.height} px
              </TableCell>
              <TableCell
                onClick={() => router.push(`/editor/${project.id}`)}
                className="hidden md:table-cell cursor-pointer"
              >
                {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
              </TableCell>
              <TableCell className="flex items-center justify-end">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      disabled={false}
                      size="icon"
                      variant="ghost"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-60">
                    <DropdownMenuItem
                      className="h-10 cursor-pointer"
                      onClick={() => console.log("Copy project", project.id)}
                    >
                      <CopyIcon className="size-4 mr-2" />
                      Make a copy
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="h-10 cursor-pointer"
                      onClick={() => console.log("Delete project", project.id)}
                    >
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
