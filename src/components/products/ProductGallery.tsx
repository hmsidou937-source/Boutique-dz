"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const list = images.length > 0 ? images : ["/placeholder-product.png"];
  const [active, setActive] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zooming, setZooming] = useState(false);

  return (
    <div>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl border border-black/5 bg-white"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setZoomPos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
        }}
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={list[active]}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-200"
          style={
            zooming
              ? { transform: "scale(1.8)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
              : undefined
          }
        />
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {list.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={cn(
                "h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2",
                i === active ? "border-brand-600" : "border-transparent"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
