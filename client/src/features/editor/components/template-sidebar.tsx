import { AlertTriangle, Loader, Crown } from "lucide-react";

import {
  ActiveTool,
  Editor,
} from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfirm } from "@/hooks/use-confirm";
import { useAdminProjects } from "@/features/projects/hooks/useGetAdminProjects";

interface TemplateSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

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

export const TemplateSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: TemplateSidebarProps) => {

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to replace the current project with this template."
  );

  const { data: projects, isLoading, isError } = useAdminProjects();

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const onClick = async (project: project) => {
    const ok = await confirm();

    if (ok) {
      editor?.loadJson(project?.json);
    }
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "templates" ? "visible" : "hidden",
      )}
    >
      <ConfirmDialog />
      <ToolSidebarHeader
        title="Templates"
        description="Choose from a variety of templates to get started"
      />
      {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            Failed to fetch projects
          </p>
        </div>
      )}
      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {projects && projects.map((project: project) => (
              <button
                key={project?.id}
                style={{ aspectRatio: `${project?.width}/${project?.height}` }}
                onClick={() => onClick(project)}
                className="relative w-full group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
              >
                {project?.isPro && (
                  <div className="absolute top-2 right-2 size-8 items-center flex justify-center bg-black/50 rounded-full">
                    <Crown className="size-4 fill-yellow-500 text-yellow-500" />
                  </div>
                )}
                <div className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white p-1 bg-black/50 text-left">
                  {project?.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};