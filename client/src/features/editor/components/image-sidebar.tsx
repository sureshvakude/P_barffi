import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Loader, Upload, Trash2 } from "lucide-react";

import { ActiveTool, Editor } from "@/features/editor/types";
import { ToolSidebarClose } from "@/features/editor/components/tool-sidebar-close";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

interface ImageSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const ImageSidebar = ({ editor, activeTool, onChangeActiveTool }: ImageSidebarProps) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const storedImages = JSON.parse(sessionStorage.getItem("uploadedImages") || "[]");
    setImages(storedImages);
  }, []);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result as string;
        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        sessionStorage.setItem("uploadedImages", JSON.stringify(updatedImages));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    sessionStorage.setItem("uploadedImages", JSON.stringify(updatedImages));
  };

  const onClose = () => {
    onChangeActiveTool("select");
  };

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "images" ? "visible" : "hidden"
      )}
    >
      <ToolSidebarHeader title="Images" description="Add images to your canvas" />
      <div className="p-4 border-b">
        <label className="w-full flex items-center gap-2 text-sm font-medium cursor-pointer">
          <Upload className="size-4" />
          Upload Image
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>
      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <button
                  onClick={() => editor?.addImage(image)}
                  className="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
                >
                  <img src={image} alt="Uploaded" className="object-cover w-full h-full" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};