"use client";

import { Stage, Layer, Rect } from "react-konva";
import { useEffect, useState } from "react";

export default function Canvas() {
const [size, setSize] = useState({
    width: 800,
    height: 600,
  });

  useEffect(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);
  return (
    <Stage width={size.width} height={size.height} style={{ background: "white"}}>
      <Layer>
        <Rect
          x={50}
          y={50}
          width={120}
          height={80}
          fill="black"
          draggable
        />
      </Layer>
    </Stage>
  );
}
