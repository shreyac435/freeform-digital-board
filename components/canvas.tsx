"use client";

import { Stage, Layer, Rect, Text, Group  } from "react-konva";
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
        <Group draggable>
            <Rect
            x={50}
            y={50}
            width={120}
            height={80}
            fill="#fcda68"
            cornerRadius={5}
            shadowBlur={4}           
          />
          <Text
           x={60}
            y={60}
            text="first pin"
            fontSize={16}
            fill="black"
            width={140}
          />
        </Group>
      </Layer>
    </Stage>
  );
}
