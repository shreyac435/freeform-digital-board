"use client";

import { Stage, Layer, Rect, Text, Group  } from "react-konva";
import { useEffect, useState } from "react";

export default function Canvas() {
const [size, setSize] = useState({
    width: 800,
    height: 600,
  });

const [pinColor, setPinColor] = useState("#fcda68");
const [pins, setPins] = useState([
    {
      id: 1,
      x: 50,
      y: 50,
      color: "#fcda68",
      text: "first pin",
    },
  ]);

  useEffect(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  function addPin() {
    setPins([
      ...pins,
      {
        id: Date.now(),
        x: 100,
        y: 100,
        color: pinColor,
        text: "New pin",
      },
    ]);
  }

  return (
    <>
      {/* Top controls */}
      <div style={{ padding: "8px", background: "#f0f0f0" }}>
        <button
    onClick={addPin}
    style={{ marginRight: "12px", color:"black" }}
  >Add Pin
  </button>
        <label style={{ marginRight: "7px", color:"black" }}>Pin colour:</label>
        <input
          type="color"
          value={pinColor}
          onChange={(e) => setPinColor(e.target.value)}
        />
      </div>

      {/* Board */}
    <Stage width={size.width} 
    height={size.height-50} 
    style={{ background: "white"}}>
      <Layer>
        {pins.map((pin) => (
        <Group key={pin.id} draggable>
            <Rect
            x={pin.x}
            y={pin.y}
            width={120}
            height={80}
            fill={pin.color}
            cornerRadius={5}
            shadowBlur={4}           
          />
          <Text
            x={pin.x+10}
            y={pin.y+10}
            text={pin.text}
            fontSize={16}
            fill="black"
            width={140}
          />
        </Group>
        ))}
      </Layer>
    </Stage>
    </>
  );
}
