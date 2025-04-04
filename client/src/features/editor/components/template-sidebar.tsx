import { AlertTriangle, Loader, Crown } from "lucide-react";
import { fabric } from "fabric";
import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfirm } from "@/hooks/use-confirm";
import { useAdminProjects } from "@/features/projects/hooks/useGetAdminProjects";
import { useEffect, useRef } from "react";

interface TemplateSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

type Project = {
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

  const onClick = async (project: Project) => {
    const ok = await confirm();
    if (ok) {
      editor?.loadJson(project?.json);
    }
  };

  // Store canvas refs for each project
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  const fabricCanvasRefs = useRef<Record<string, fabric.Canvas>>({});

  // Load JSON into each canvas
  useEffect(() => {
    if (!projects) return;

    projects.forEach((project) => {
      const canvasElement = canvasRefs.current[project.id];
      const canvasJson = project.json;
      const width = project.width || 800;
      const height = project.height || 600;

      if (!canvasElement || !canvasJson) return;

      canvasElement.width = width / 6;
      canvasElement.height = height / 6;

      const canvas = new fabric.Canvas(canvasElement, {
        selection: false,
        interactive: false,
        backgroundColor: "#f8f8f8",
      });

      fabricCanvasRefs.current[project.id] = canvas;

      canvas.loadFromJSON(canvasJson, () => {
        if(!canvas) return;
        const objects = canvas.getObjects();
        if (objects.length === 0) return;

        const boundingRect = {
          left: Math.min(...objects.map((o) => o.left ?? Infinity)),
          top: Math.min(...objects.map((o) => o.top ?? Infinity)),
          right: Math.max(
            ...objects.map(
              (o) => (o.left ?? 0) + (o.width ?? 0) * (o.scaleX ?? 1)
            )
          ),
          bottom: Math.max(
            ...objects.map(
              (o) => (o.top ?? 0) + (o.height ?? 0) * (o.scaleY ?? 1)
            )
          ),
        };

        const contentWidth = boundingRect.right - boundingRect.left;
        const contentHeight = boundingRect.bottom - boundingRect.top;
        const scale = Math.min(
          (width / 6) / contentWidth,
          (height / 6) / contentHeight
        );

        const offsetX =
          (width / 6 - contentWidth * scale) / 2 - boundingRect.left * scale;
        const offsetY =
          (height / 6 - contentHeight * scale) / 2 - boundingRect.top * scale;

        canvas.setViewportTransform([scale, 0, 0, scale, offsetX, offsetY]);
        canvas.renderAll();
      });
    });

    return () => {
      if (canvasRefs.current && fabricCanvasRefs.current) {
        Object.values(fabricCanvasRefs.current).forEach((canvas) => {
          canvas.dispose();
          canvas = null;
        });
        fabricCanvasRefs.current = {};
      }
    };
  }, [projects]);

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "templates" ? "visible" : "hidden"
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
            {projects &&
              projects.map((project: Project) => (
                <button
                  key={project.id}
                  style={{
                    aspectRatio: `${project?.width}/${project?.height}`,
                  }}
                  onClick={() => onClick(project)}
                  className="relative w-full group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                >
                  <canvas
                    ref={(ref) => {
                      canvasRefs.current[project.id] = ref;
                    }}
                    className="w-full h-full"
                  />
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
