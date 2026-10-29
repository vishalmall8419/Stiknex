import React, { useRef, useEffect, useCallback } from "react";

const NotebookDrawingCanvas = ({
  isActive,
  tool, // "pen" | "eraser" | "highlighter"
  color,
  strokeWidth = 3,
  canvasRef,
  onStrokeEnd,
}) => {
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const lastMidPointRef = useRef({ x: 0, y: 0 });
  const localCanvasRef = useRef(null);

  const activeCanvasRef = canvasRef || localCanvasRef;

  // Sync canvas dimensions with parent element taking Device Pixel Ratio into account
  const syncDimensions = useCallback(() => {
    const canvas = activeCanvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const parent = canvas.parentElement;
    const width = parent.clientWidth;
    const height = Math.max(parent.scrollHeight, window.innerHeight);
    const dpr = window.devicePixelRatio || 1;

    if (width <= 0 || height <= 0) return;

    const newPixelWidth = Math.floor(width * dpr);
    const newPixelHeight = Math.floor(height * dpr);

    if (canvas.width !== newPixelWidth || canvas.height !== newPixelHeight) {
      // Preserve existing drawing before resizing
      let tempCanvas = null;
      if (canvas.width > 0 && canvas.height > 0) {
        tempCanvas = document.createElement("canvas");
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) tempCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = newPixelWidth;
      canvas.height = newPixelHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        if (tempCanvas) {
          ctx.drawImage(tempCanvas, 0, 0, width, height);
        }
      }
    }
  }, [activeCanvasRef]);

  useEffect(() => {
    syncDimensions();
    window.addEventListener("resize", syncDimensions);
    const observer = new ResizeObserver(syncDimensions);
    if (activeCanvasRef.current?.parentElement) {
      observer.observe(activeCanvasRef.current.parentElement);
    }

    return () => {
      window.removeEventListener("resize", syncDimensions);
      observer.disconnect();
    };
  }, [syncDimensions, activeCanvasRef]);

  const getCanvasPoint = (e) => {
    const canvas = activeCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const setupContextStyle = (ctx) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = strokeWidth * 6;
    } else if (tool === "highlighter") {
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = 0.22;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = strokeWidth * 4.5;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = strokeWidth;
    }
  };

  const handlePointerDown = (e) => {
    if (!isActive) return;
    e.preventDefault();
    e.stopPropagation();

    const canvas = activeCanvasRef.current;
    if (!canvas) return;

    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {}

    isDrawingRef.current = true;
    const pt = getCanvasPoint(e);
    lastPointRef.current = pt;
    lastMidPointRef.current = pt;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setupContextStyle(ctx);

    // Initial dot for instant visual feedback on click/tap
    ctx.beginPath();
    const radius = tool === "eraser" ? strokeWidth * 3 : Math.max(1, strokeWidth / 2);
    ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerMove = (e) => {
    if (!isActive || !isDrawingRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const canvas = activeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setupContextStyle(ctx);

    // Extract all hardware coalesced points if available (for smooth stylus/touch tracking)
    const events =
      typeof e.getCoalescedEvents === "function" ? e.getCoalescedEvents() : [e];

    for (const ev of events) {
      const currentPoint = getCanvasPoint(ev);
      const prev = lastPointRef.current;
      const midPoint = {
        x: (prev.x + currentPoint.x) / 2,
        y: (prev.y + currentPoint.y) / 2,
      };

      ctx.beginPath();
      ctx.moveTo(lastMidPointRef.current.x, lastMidPointRef.current.y);
      ctx.quadraticCurveTo(prev.x, prev.y, midPoint.x, midPoint.y);
      ctx.stroke();

      lastMidPointRef.current = midPoint;
      lastPointRef.current = currentPoint;
    }
  };

  const handlePointerUp = (e) => {
    const canvas = activeCanvasRef.current;
    if (canvas) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
    }

    if (isDrawingRef.current && canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Connect the final segment
        setupContextStyle(ctx);
        ctx.beginPath();
        ctx.moveTo(lastMidPointRef.current.x, lastMidPointRef.current.y);
        ctx.lineTo(lastPointRef.current.x, lastPointRef.current.y);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }
      isDrawingRef.current = false;
      if (onStrokeEnd) onStrokeEnd();
    }
  };

  return (
    <canvas
      ref={activeCanvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
        pointerEvents: isActive ? "auto" : "none",
        touchAction: "none",
        cursor:
          !isActive
            ? "default"
            : tool === "eraser"
            ? "cell"
            : "crosshair",
      }}
    />
  );
};

export default NotebookDrawingCanvas;
