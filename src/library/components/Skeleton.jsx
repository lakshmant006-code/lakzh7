import React from "react";

/* Skeleton: placeholder lines with a soft shimmer that sweeps across while content loads. */
export default function Skeleton({ rows = 3, speed = 5 }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
      <style>{"@keyframes sk{from{background-position:200% 0}to{background-position:-200% 0}}"}</style>
      <div style={{ width: "80%", maxWidth: 300, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={bar(40, 40, 99, speed)} /><div style={{ flex: 1, display: "grid", gap: 6 }}><div style={bar("60%", 10, 5, speed)} /><div style={bar("38%", 8, 5, speed)} /></div>
        </div>
        {Array.from({ length: rows }, (_, i) => <div key={i} style={bar(i === rows - 1 ? "70%" : "100%", 10, 5, speed)} />)}
      </div>
    </div>
  );
}
const bar = (w, h, r, speed) => ({ width: w, height: h, borderRadius: r, background: "linear-gradient(100deg, #26262a 30%, #3a3a40 50%, #26262a 70%) 0 0 / 200% 100%", animation: `sk ${3.2 - speed * 0.25}s linear infinite` });
