import React, { useRef, useEffect, useState } from 'react';
import { BoundingBox } from '../types';

interface BoundingBoxOverlayProps {
  imageUrl: string;
  items: BoundingBox[];
}

export const BoundingBoxOverlay: React.FC<BoundingBoxOverlayProps> = ({ imageUrl, items }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions on window resize or image load
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    // Initial check
    const img = new Image();
    img.src = imageUrl;
    img.onload = updateDimensions;

    return () => window.removeEventListener('resize', updateDimensions);
  }, [imageUrl]);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      <img 
        src={imageUrl} 
        alt="Audit Subject" 
        className="w-full h-auto object-contain max-h-[600px] rounded-lg shadow-md block"
        style={{ maxHeight: '600px' }}
      />
      {items.map((item, index) => {
        // box_2d is [ymin, xmin, ymax, xmax] in 0-1000 scale
        const [ymin, xmin, ymax, xmax] = item.box_2d;
        
        const top = (ymin / 1000) * 100 + '%';
        const left = (xmin / 1000) * 100 + '%';
        const height = ((ymax - ymin) / 1000) * 100 + '%';
        const width = ((xmax - xmin) / 1000) * 100 + '%';

        return (
          <div
            key={index}
            className="absolute border-2 border-red-500 bg-red-500/10 group hover:bg-red-500/20 transition-colors cursor-pointer"
            style={{ top, left, height, width }}
            title={item.label}
          >
            <span className="absolute -top-7 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};