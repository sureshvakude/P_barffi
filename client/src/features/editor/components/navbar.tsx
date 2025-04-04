"use client";

import { CiFileOn } from "react-icons/ci";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";
import { useFilePicker } from "use-file-picker";
import { useMutationState } from "@tanstack/react-query";
import { ChevronDown, Download, Loader, MousePointerClick, Redo2, Undo2 } from "lucide-react";
// import { UserButton } from "@/features/auth/components/user-button";
import { ActiveTool, Editor } from "@/features/editor/types";
import { Logo } from "@/features/editor/components/logo";
import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateProject } from "@/features/projects/api/use-update-project";

interface NavbarProps {
  id: string;
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

type formdata = {
  name?: string;
  isPro?: boolean;
  price?: string;
  isTemplate?: boolean;
};

export const Navbar = ({ id, editor, activeTool, onChangeActiveTool, }: NavbarProps) => {
  const data = useMutationState({
    filters: { mutationKey: ["project", { id }], exact: true, },
    select: (mutation) => mutation.state.status,
  });
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<formdata>({
    name: "",
    isPro: false,
    price: "", // Corrected here
    isTemplate: false,
  });

  const updateProject = useUpdateProject(id);

  const currentStatus = data[data.length - 1];
  const isError = currentStatus === "error";
  const isPending = currentStatus === "pending";

  const { openFilePicker } = useFilePicker({
    accept: ".json",
    onFilesSuccessfullySelected: ({ plainFiles }) => {
      if (plainFiles && plainFiles.length > 0) {
        const file = plainFiles[0];
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = () => {
          editor?.loadJson(reader.result as string);
        };
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: formdata) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) || "" : value,
    }));
  };

  const handleSave = () => {
    updateProject.mutate({
      name: formData.name,
      isPro: formData.isPro,
      prize: formData.price ? parseInt(formData.price) : undefined,
      isTemplate: formData.isTemplate,
    });
    setIsModalOpen(false);
  };

  const handleDownload = (type: string) => {
    switch (type) {
      case "json":
        editor?.saveJson();
        break;
      case "png":
        editor?.savePng();
        break;
      case "jpg":
        editor?.saveJpg();
        break;
      case "svg":
        editor?.saveSvg();
        break;
      default:
        break;
    }
  }

  return (
    <nav className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]">
      <Logo />
      <div className="w-full flex items-center gap-x-1 h-full">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              File
              <ChevronDown className="size-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-60">
            <DropdownMenuItem
              onClick={() => openFilePicker()}
              className="flex items-center gap-x-2"
            >
              <CiFileOn className="size-8" />
              <div>
                <p>Open</p>
                <p className="text-xs text-muted-foreground">
                  Open a JSON file
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="mx-2" />
        <Hint label="Select" side="bottom" sideOffset={10}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChangeActiveTool("select")}
            className={cn(activeTool === "select" && "bg-gray-100")}
          >
            <MousePointerClick className="size-4" />
          </Button>
        </Hint>
        <Hint label="Undo" side="bottom" sideOffset={10}>
          <Button
            disabled={!editor?.canUndo()}
            variant="ghost"
            size="icon"
            onClick={() => editor?.onUndo()}
          >
            <Undo2 className="size-4" />
          </Button>
        </Hint>
        <Hint label="Redo" side="bottom" sideOffset={10}>
          <Button
            disabled={!editor?.canRedo()}
            variant="ghost"
            size="icon"
            onClick={() => editor?.onRedo()}
          >
            <Redo2 className="size-4" />
          </Button>
        </Hint>
        <Separator orientation="vertical" className="mx-2" />
        {isPending && (
          <div className="flex items-center gap-x-2">
            <Loader className="size-4 animate-spin text-muted-foreground" />
            <div className="text-xs text-muted-foreground">
              Saving...
            </div>
          </div>
        )}
        {!isPending && isError && (
          <div className="flex items-center gap-x-2">
            <BsCloudSlash className="size-[20px] text-muted-foreground" />
            <div className="text-xs text-muted-foreground">
              Failed to save
            </div>
          </div>
        )}
        {!isPending && !isError && (
          <div className="flex items-center gap-x-2">
            <BsCloudCheck className="size-[20px] text-muted-foreground" />
            <div className="text-xs text-muted-foreground">
              Saved
            </div>
          </div>
        )}
        <div className="ml-auto flex items-center gap-x-4">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                Export
                <Download className="size-4 ml-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-60">
              {/* <DropdownMenuItem
                className="flex items-center gap-x-2"
                onClick={() => editor?.saveJson()}
              >
                <CiFileOn className="size-8" />
                <div>
                  <p>JSON</p>
                  <p className="text-xs text-muted-foreground">
                    Save for later editing
                  </p>
                </div>
              </DropdownMenuItem> */}
              <DropdownMenuItem
                className="flex items-center gap-x-2"
                onClick={() => handleDownload("png")}
              >
                <CiFileOn className="size-8" />
                <div>
                  <p>PNG</p>
                  <p className="text-xs text-muted-foreground">
                    Best for sharing on the web
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-x-2"
                onClick={() => handleDownload("jpg")}
              >
                <CiFileOn className="size-8" />
                <div>
                  <p>JPG</p>
                  <p className="text-xs text-muted-foreground">
                    Best for printing
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-x-2"
                onClick={() => handleDownload("svg")}
              >
                <CiFileOn className="size-8" />
                <div>
                  <p>SVG</p>
                  <p className="text-xs text-muted-foreground">
                    Best for editing in vector software
                  </p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* <UserButton /> */}
          <div className="ml-auto flex items-center gap-x-4">
            {session && session.user.userType === "admin" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-2xl shadow-lg hover:bg-blue-600 transition-all"
              >
                Add
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
            <div className="flex items-center gap-2">
              <Checkbox name="isPro" checked={formData.isPro} onCheckedChange={(checked) => setFormData({ ...formData, isPro: Boolean(checked) })} />
              <label>Is Pro</label>
            </div>
            <Input
              name="price"
              placeholder="Price"
              type="number"
              value={formData.price || ""}
              onChange={handleChange}
            />
            <div className="flex items-center gap-2">
              <Checkbox name="isTemplate" checked={formData.isTemplate} onCheckedChange={(checked) => setFormData({ ...formData, isTemplate: Boolean(checked) })} />
              <label>Is Template</label>
            </div>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};