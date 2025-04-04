import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  canvasJson: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  width: number;
  height: number;
  isPro: boolean | null;
}

export const TemplateCard = ({ canvasJson, title, onClick, disabled, height, width, isPro, }: TemplateCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvasElement = canvasRef.current;
    canvasElement.width = width / 4;
    canvasElement.height = height / 4;

    const canvas = new fabric.Canvas(canvasElement, {
      selection: false,
      interactive: false,
      backgroundColor: '#f8f8f8'
    });

    fabricCanvasRef.current = canvas;

    const loadCanvas = async () => {
      if (!canvasJson || !canvasRef || !fabricCanvasRef) return;

      try {
        await new Promise<void>((resolve) => {
          canvas.loadFromJSON(canvasJson, () => {
            const objects = canvas.getObjects();
            if (objects.length === 0) {
              resolve();
              return;
            }

            const boundingRect = {
              left: Math.min(...objects.map(o => o.left ?? Infinity)),
              top: Math.min(...objects.map(o => o.top ?? Infinity)),
              right: Math.max(...objects.map(o => (o.left ?? 0) + (o.width ?? 0) * (o.scaleX ?? 1))),
              bottom: Math.max(...objects.map(o => (o.top ?? 0) + (o.height ?? 0) * (o.scaleY ?? 1)))
            };

            const contentWidth = boundingRect.right - boundingRect.left;
            const contentHeight = boundingRect.bottom - boundingRect.top;
            const scale = Math.min((width / 4) / contentWidth, (height / 4) / contentHeight);
            const offsetX = ((width / 4) - contentWidth * scale) / 2 - boundingRect.left * scale;
            const offsetY = ((height / 4) - contentHeight * scale) / 2 - boundingRect.top * scale;
            canvas.setViewportTransform([scale, 0, 0, scale, offsetX, offsetY]);
            canvas.renderAll();
            resolve();
          });
        });
      } catch (error) {
        console.error("Error loading canvas JSON:", error);
      }
    };

    loadCanvas();

    return () => {
      if (fabricCanvasRef.current && canvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [canvasJson, width, height]);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all",
        "hover:shadow-md hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "flex flex-col",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      style={{
        width: width / 4,
        height: height / 4
      }}>
      <div
        className="relative flex-1 bg-gray-50"
        style={{
          minHeight: 0 // Important for flex children
        }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full" />
        {isPro && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full shadow-sm">
            <Crown className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Text container - fixed height */}
      <div className="w-full px-3 py-2 bg-white border-t border-gray-200 h-10 flex items-center">
        <h3 className="font-medium text-gray-900 truncate text-left w-full">
          {title}
        </h3>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 pointer-events-none" />
    </button>
  );
};