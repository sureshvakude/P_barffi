import Image from "next/image";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { fabric } from "fabric";

interface TemplateCardProps {
  canvasJson: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  description: string;
  width: number;
  height: number;
  isPro: boolean | null;
};

export const TemplateCard = ({ canvasJson, title, onClick, disabled, description, height, width, isPro }: TemplateCardProps) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = React.useRef<fabric.Canvas | null>(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      // Initialize Fabric.js canvas
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        selection: false,
        interactive: false // Ensures it's non-editable
      });

      // Load JSON into Fabric.js
      if (canvasJson) {
        fabricCanvasRef.current.loadFromJSON(canvasJson, () => {
          fabricCanvasRef.current?.renderAll();
        });
      }
    }

    return () => {
      fabricCanvasRef.current?.dispose(); // Cleanup on unmount
    };
  }, [canvasJson]);

  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width: width / 5, height: height / 5 }}
      className={`bg-slate-100 cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out relative overflow-hidden`}>
      <canvas ref={canvasRef} width={width / 5} height={height / 5} />
    </button>
  )
}