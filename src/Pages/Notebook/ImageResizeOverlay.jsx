import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Style from "./ImageResizeOverlay.module.css";

const ImageResizeOverlay = ({
  targetImg,
  paperAreaRef,
  darkMode,
  onImageChanged,
  onDeleteImage,
  onDeselect,
}) => {
  const [rect, setRect] = useState(null);
  const isDraggingRef = useRef(false);
  const dragHandleRef = useRef(null);
  const startDragRef = useRef({
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
    aspectRatio: 1,
  });

  const updateRect = useCallback(() => {
    if (!targetImg || !targetImg.isConnected) {
      setRect(null);
      return;
    }
    const imgRect = targetImg.getBoundingClientRect();
    if (imgRect.width === 0 && imgRect.height === 0) {
      setRect(null);
      return;
    }

    const toolbarOnTop = imgRect.bottom + 65 > window.innerHeight;

    setRect({
      top: imgRect.top,
      left: imgRect.left,
      width: imgRect.width,
      height: imgRect.height,
      toolbarOnTop,
    });
  }, [targetImg]);

  useEffect(() => {
    updateRect();
    const scrollContainer = paperAreaRef?.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateRect, { passive: true });
    }
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect, { passive: true });

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", updateRect);
      }
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
    };
  }, [updateRect, paperAreaRef]);

  // Pointer drag logic for resizing
  const handlePointerDown = (e, handle) => {
    e.preventDefault();
    e.stopPropagation();

    isDraggingRef.current = true;
    dragHandleRef.current = handle;

    const currentW = targetImg.offsetWidth || targetImg.naturalWidth || 300;
    const currentH = targetImg.offsetHeight || targetImg.naturalHeight || 200;
    const aspectRatio = currentW / (currentH || 1);

    startDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: currentW,
      startH: currentH,
      aspectRatio,
    };

    const handlePointerMove = (moveEv) => {
      if (!isDraggingRef.current || !targetImg) return;

      const deltaX = moveEv.clientX - startDragRef.current.startX;
      let newW = startDragRef.current.startW;

      if (handle === "se" || handle === "ne") {
        newW = startDragRef.current.startW + deltaX;
      } else if (handle === "sw" || handle === "nw") {
        newW = startDragRef.current.startW - deltaX;
      }

      const maxWidth = paperAreaRef?.current
        ? paperAreaRef.current.clientWidth - 40
        : window.innerWidth - 60;
      newW = Math.max(60, Math.min(newW, maxWidth));

      targetImg.style.width = `${Math.round(newW)}px`;
      targetImg.style.height = "auto";
      updateRect();
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      dragHandleRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      if (onImageChanged) onImageChanged();
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleAlignment = (align) => {
    if (!targetImg) return;
    targetImg.classList.remove(
      "align-left",
      "align-center",
      "align-right",
      "align-full"
    );
    targetImg.classList.add(`align-${align}`);

    if (align === "left") {
      targetImg.style.display = "block";
      targetImg.style.margin = "12px auto 12px 0";
    } else if (align === "center") {
      targetImg.style.display = "block";
      targetImg.style.margin = "12px auto";
    } else if (align === "right") {
      targetImg.style.display = "block";
      targetImg.style.margin = "12px 0 12px auto";
    } else if (align === "full") {
      targetImg.style.display = "block";
      targetImg.style.width = "100%";
      targetImg.style.margin = "12px 0";
    }

    updateRect();
    if (onImageChanged) onImageChanged();
  };

  const handlePresetWidth = (pct) => {
    if (!targetImg) return;
    targetImg.style.width = `${pct}%`;
    targetImg.style.height = "auto";
    updateRect();
    if (onImageChanged) onImageChanged();
  };

  const handleResetSize = () => {
    if (!targetImg) return;
    targetImg.style.width = "";
    targetImg.style.height = "auto";
    updateRect();
    if (onImageChanged) onImageChanged();
  };

  const handleDelete = () => {
    if (!targetImg) return;
    const imgId = targetImg.getAttribute("data-img-id");
    targetImg.remove();
    if (onDeleteImage) onDeleteImage(imgId);
  };

  if (!rect || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={Style.overlayContainer}
      style={{
        position: "fixed",
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
      }}
      role="region"
      aria-label="Image resizing and alignment"
    >
      {/* Active outline boundary */}
      <div className={Style.selectionBorder} />

      {/* 4 Corner Resize Handles */}
      <div
        className={`${Style.handle} ${Style.nw}`}
        onPointerDown={(e) => handlePointerDown(e, "nw")}
        title="Resize"
      />
      <div
        className={`${Style.handle} ${Style.ne}`}
        onPointerDown={(e) => handlePointerDown(e, "ne")}
        title="Resize"
      />
      <div
        className={`${Style.handle} ${Style.se}`}
        onPointerDown={(e) => handlePointerDown(e, "se")}
        title="Resize"
      />
      <div
        className={`${Style.handle} ${Style.sw}`}
        onPointerDown={(e) => handlePointerDown(e, "sw")}
        title="Resize"
      />

      {/* Floating Image Control Bar */}
      <div
        className={`${Style.actionToolbar} ${
          rect.toolbarOnTop ? Style.actionToolbarTop : ""
        } ${darkMode ? Style.darkActionToolbar : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Alignment */}
        <div className={Style.toolGroup}>
          <button
            type="button"
            className={Style.pillBtn}
            onClick={() => handleAlignment("left")}
            title="Align Left"
          >
            <i className="fa-solid fa-align-left"></i>
          </button>
          <button
            type="button"
            className={Style.pillBtn}
            onClick={() => handleAlignment("center")}
            title="Align Center"
          >
            <i className="fa-solid fa-align-center"></i>
          </button>
          <button
            type="button"
            className={Style.pillBtn}
            onClick={() => handleAlignment("right")}
            title="Align Right"
          >
            <i className="fa-solid fa-align-right"></i>
          </button>
        </div>

        <div className={Style.pillDivider} />

        {/* Width Presets */}
        <div className={Style.toolGroup}>
          <button
            type="button"
            className={Style.pillBtnText}
            onClick={() => handlePresetWidth(25)}
            title="25% Width"
          >
            25%
          </button>
          <button
            type="button"
            className={Style.pillBtnText}
            onClick={() => handlePresetWidth(50)}
            title="50% Width"
          >
            50%
          </button>
          <button
            type="button"
            className={Style.pillBtnText}
            onClick={() => handlePresetWidth(100)}
            title="100% Width"
          >
            100%
          </button>
        </div>

        <div className={Style.pillDivider} />

        {/* Reset & Delete */}
        <div className={Style.toolGroup}>
          <button
            type="button"
            className={Style.pillBtn}
            onClick={handleResetSize}
            title="Reset to Original Dimensions"
          >
            <i className="fa-solid fa-arrows-rotate"></i>
          </button>
          <button
            type="button"
            className={`${Style.pillBtn} ${Style.deleteBtn}`}
            onClick={handleDelete}
            title="Delete Image"
          >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          <button
            type="button"
            className={Style.pillBtn}
            onClick={onDeselect}
            title="Deselect"
          >
            <i className="fa-solid fa-check"></i>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImageResizeOverlay;
