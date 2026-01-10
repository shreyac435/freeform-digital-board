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
  const movedPin = pins.find((p) => p.id === id);
  if (!movedPin) return;

  setPins(
    pins.map((pin) => {
      if (pin.groupId && pin.groupId === movedPin.groupId) {
        return {
          ...pin,
          x: pin.x + (x - movedPin.x),
          y: pin.y + (y - movedPin.y),
        };
      }
      return pin.id === id ? { ...pin, x, y } : pin;
    })
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
  function groupSelectedPins() {
  if (selectedPins.length < 2) return;

  saveToHistory(pins); 

  const newGroupId = Date.now();

  setPins(
    pins.map((pin) =>
      selectedPins.includes(pin.id)
        ? { ...pin, groupId: newGroupId }
        : pin
    )
  );

  setSelectedPins([]);
}

  return (
    <>
    <div
  style={{
    height: "48px",
    background: "#4f7cc4",
    color: "white",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  }}
>
  PinDump
</div>
<div style={{ display: "flex", height: "calc(100vh - 48px)" }}>

      <div
  style={{
    position: "absolute",
    top: "60px",
    left:"12px",
    width: "180px",
    background: "#f7f7f7",
    padding: "12px",
    borderRight: "1px solid #ddd",
    boxShadow: "0 8px 24px #0000001f", 
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    zIndex: 10,
  }}
>
    <button
    onClick={addPin}
    style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #4f7cc4",
    background: "white",
    cursor: "pointer",
    color: "#4f7cc4"
  }}
    >Add Pin
    </button>
        <div
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #4f7cc4",
    background: "white",
    color: "#4f7cc4",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }}
>
  <span>Pin colour</span>

  <input
    type="color"
    value={pinColor}
    onChange={(e) => setPinColor(e.target.value)}
    style={{
      border: "none",
      background: "none",
      width: "50px",
      height: "28px",
      padding: "0",
      cursor: "pointer",
    }}
  />
</div>

    <button
     onClick={groupSelectedPins}
     style={{ padding: "8px",
    borderRadius: "6px",
    border: "1px solid #4f7cc4",
    background: "white",
    color: "#4f7cc4",
    cursor: "pointer",
    textAlign: "center",
  }}
    >
    Group
    </button>

    <button onClick={undo} style={{ padding: "8px",
    borderRadius: "6px",
    border: "1px solid #4f7cc4",
    background: "white",
    color: "#4f7cc4",
    cursor: "pointer",
    textAlign: "center",
  }}> Undo
        </button>
        <button onClick={redo} style={{ padding: "8px",
    borderRadius: "6px",
    border: "1px solid #4f7cc4",
    background: "white",
    color: "#4f7cc4",
    cursor: "pointer",
    textAlign: "center",
  }}>
          Redo
        </button>
      </div>

      {/* Board */}
    <Stage width={size.width-180} 
    height={size.height-50} 
    style={{ background: "#fcfcfc"}}>
      <Layer>
        {pins.map((pin) => (
        <Group key={pin.id} 
        x={pin.x}
        y={pin.y}
        draggable
        onDblClick={() => editPinText(pin.id)}
        onClick={(e) => {                 
    if (e.evt.shiftKey) {
      setSelectedPins((prev) =>
        prev.includes(pin.id)
          ? prev.filter((id) => id !== pin.id)
          : [...prev, pin.id]
      );
    }
  }}
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
             stroke={selectedPins.includes(pin.id) ? "black" : undefined} 
  strokeWidth={selectedPins.includes(pin.id) ? 2 : 0}         
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
    </div>
    </>
  );
}
