"use client";

import { Stage, Layer, Rect, Text, Group  } from "react-konva";
import { useEffect, useState } from "react";

export default function Canvas() {
const [size, setSize] = useState({
    width: 800,
    height: 600,
  });
const [history, setHistory] = useState<any[][]>([]);
const [future, setFuture] = useState<any[][]>([]);
const [pinColor, setPinColor] = useState("#fcda68");
const [pins, setPins] = useState<any[]>([]);
const [selectedPins, setSelectedPins] = useState<number[]>([]); 


  useEffect(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const savedPins = localStorage.getItem("pins");
  if (savedPins) {
    setPins(JSON.parse(savedPins));
  } else {
    setPins([
      {
        id: 1,
        x: 50,
        y: 50,
        color: "#fcda68",
        text: "first pin",
      },
    ]);
  }
  }, []);
  useEffect(() => {
    localStorage.setItem("pins", JSON.stringify(pins));
  }, [pins]);

  function saveToHistory(currentPins: any[]) {
    setHistory([...history, currentPins]);
    setFuture([]);
  }

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

  function editPinText(id: number) {
  const newText = prompt("Edit pin text:");
  if (!newText) return;

  saveToHistory(pins);

  setPins(
    pins.map((pin) =>
      pin.id === id ? { ...pin, text: newText } : pin
    )
  );
}
 function updatePinPosition(id: number, x: number, y: number) {
    saveToHistory(pins);
  setPins(
    pins.map((pin) =>
      pin.id === id ? { ...pin, x, y } : pin
    )
  );
}
function undo() {
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    setHistory(history.slice(0, history.length - 1));
    setFuture([pins, ...future]);
    setPins(previous);
  }

  function redo() {
    if (future.length === 0) return;

    const next = future[0];
    setFuture(future.slice(1));
    setHistory([...history, pins]);
    setPins(next);
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
        <label style={{ marginRight: "10px", color:"black" }}> Pin colour:</label>
        <input
          type="color"
          value={pinColor}
          onChange={(e) => setPinColor(e.target.value)}
        />
    <button onClick={undo} style={{ marginRight: "8px", marginLeft:"30px", color: "black" }}>
          Undo
        </button>
        <button onClick={redo} style={{ marginRight: "24px", color: "black" }}>
          Redo
        </button>
      </div>

      {/* Board */}
    <Stage width={size.width} 
    height={size.height-50} 
    style={{ background: "white"}}>
      <Layer>
        {pins.map((pin) => (
        <Group key={pin.id} 
        x={pin.x}
        y={pin.y}
        draggable
        onDblClick={() => editPinText(pin.id)}
        onDragEnd={(e) =>
        updatePinPosition(
        pin.id,
        e.target.x(),
        e.target.y()
    )
  }
        >
            <Rect
            x={0}
            y={0}
            width={120}
            height={80}
            fill={pin.color}
            cornerRadius={5}
            shadowBlur={4}           
          />
          <Text
            x={10}
            y={10}
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
