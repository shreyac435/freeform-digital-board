"use client";

import { Stage, Layer, Rect, Text, Group  } from "react-konva";
import { useEffect, useState } from "react";

export default function Canvas() {
const [size, setSize] = useState({
    width: 800,
    height: 600,
  });

const [pinColor, setPinColor] = useState("#fcda68");

  useEffect(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);
  return (
    <>
      {/* Top controls */}
      <div style={{ padding: "8px", background: "#f0f0f0" }}>
        <label style={{ marginRight: "8px" }}>Pin color:</label>
        <input
          type="color"
          value={pinColor}
          onChange={(e) => setPinColor(e.target.value)}
        />
      </div>

      {/* Board */}
    <Stage width={size.width} height={size.height} style={{ background: "white"}}>
      <Layer>
        <Group draggable>
            <Rect
            x={50}
            y={50}
            width={120}
            height={80}
            fill={pinColor}
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
    </>
  );
}
