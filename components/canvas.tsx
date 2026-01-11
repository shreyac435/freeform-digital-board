"use client";

import { Stage, Layer, Rect, Text, Group,Image  } from "react-konva";
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
const [images, setImages] = useState<{ [key: number]: HTMLImageElement }>({});


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

  useEffect(() => {
  pins.forEach((pin) => {
    if (pin.imageSrc && !images[pin.id]) {
      const img = new window.Image();
      img.src = pin.imageSrc;

      img.onload = () => {
        setImages((prev) => ({
          ...prev,
          [pin.id]: img,
        }));
      };
    }
  });
}, [pins, images]);

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
function ungroupSelectedPins() {
  if (selectedPins.length === 0) return;

  saveToHistory(pins);

  setPins(
    pins.map((pin) =>
      selectedPins.includes(pin.id)
        ? { ...pin, groupId: undefined }
        : pin
    )
  );

  setSelectedPins([]);
}
function deleteSelectedPins() {
  if (selectedPins.length === 0) return;

  saveToHistory(pins);

  setPins(pins.filter((pin) => !selectedPins.includes(pin.id)));
  setSelectedPins([]);
}
function addImagePin(file: File) {
  const reader = new FileReader();

  reader.onload = () => {
    saveToHistory(pins);

    setPins([
      ...pins,
      {
        id: Date.now(),
        x: 100,
        y: 100,
        imageSrc: reader.result,
        width: 150,
        height: 150,
      },
    ]);
  };

  reader.readAsDataURL(file);
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
    <label
  style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #4f7cc4",
    background: "white",
    color: "#4f7cc4",
    cursor: "pointer",
    textAlign: "center",
  }}
>
  Add Image
  <input
    type="file"
    accept="image/*"
    hidden
    onChange={(e) => {
      if (e.target.files?.[0]) {
        addImagePin(e.target.files[0]);
      }
    }}
  />
</label>

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
     disabled={selectedPins.length < 2}
     style={{ padding: "8px",
    borderRadius: "6px",
    border: "1px solid #4f7cc4",
    background: selectedPins.length < 2 ? "#f2f2f2" : "white",
    color: "#4f7cc4",
    cursor: selectedPins.length < 2 ? "not-allowed" : "pointer",
    textAlign: "center",
  }}
    >
    Group
    </button>
<button
   onClick={ungroupSelectedPins}
   style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #4f7cc4",
    background: selectedPins.length === 0 ? "#f2f2f2" : "white",
    color: "#4f7cc4",
    cursor: selectedPins.length === 0 ? "not-allowed" : "pointer",
    textAlign: "center",
  }}
>
  Ungroup
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
    <button
    onClick={deleteSelectedPins}
    disabled={selectedPins.length === 0}
    style={{
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #4f7cc4",
    background: selectedPins.length === 0 ? "#f2f2f2" : "white",
    color: "#4f7cc4",
    cursor: selectedPins.length === 0 ? "not-allowed" : "pointer",
    textAlign: "center",
  }}
>
  Delete
</button>

      </div>

      {/* Board */}
    <Stage width={size.width} 
    height={size.height-50} 
    style={{ background: "#fcfcfc"}}>
      <Layer>
        {pins.map((pin) => (
        <Group key={pin.id} 
        x={pin.x}
        y={pin.y}
        draggable
        onMouseEnter={(e) => {
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "grab";
        }}
        onMouseDown={(e) => {
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "grabbing";
        }}
        onMouseLeave={(e) => {
        const container = e.target.getStage()?.container();
        if (container) container.style.cursor = "default";
        }}
        onDblClick={() => editPinText(pin.id)}

        onClick={(e) => {
        setSelectedPins((prev) => {
        if (e.evt.shiftKey) {
        return prev.includes(pin.id)
        ? prev.filter((id) => id !== pin.id)
        : [...prev, pin.id]
    } 
  return prev.includes(pin.id) ? [] : [pin.id];
  });
}}

        onDragEnd={(e) =>
        updatePinPosition(
        pin.id,
        e.target.x(),
        e.target.y()
    )
  }
        >
    {pin.imageSrc && images[pin.id] ? (

    <Image
      image={images[pin.id]}
      width={pin.width}
      height={pin.height}
    />
  ) : (
    <>
      <Rect
        x={0}
        y={0}
        width={120}
        height={80}
        fill={pin.color}
        cornerRadius={5}
        shadowBlur={selectedPins.includes(pin.id) ? 12 : 4}
  shadowColor={
    selectedPins.includes(pin.id) ? "#6373a3ff" : "rgba(0,0,0,0.25)"
  }
  stroke={selectedPins.includes(pin.id) ? "#4a4a4eff" : undefined}
  strokeWidth={selectedPins.includes(pin.id) ? 2 : 0}
/>
      <Text
        x={10}
        y={10}
        text={pin.text}
        fontSize={16}
        fill="black"
        width={140}
        onMouseEnter={(e) => {
    const container = e.target.getStage()?.container();
    if (container) container.style.cursor = "text";
  }}
  onMouseLeave={(e) => {
    const container = e.target.getStage()?.container();
    if (container) container.style.cursor = "default";
  }}
      />
    </>
  )}
        </Group>
        ))}
      </Layer>
    </Stage>
    </div>
    </>
  );
}
