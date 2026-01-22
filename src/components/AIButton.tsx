import type React from "react";
import { useRef, useState, useEffect } from "react";
import { animate, press } from "motion";
import "./ai-button.css";

type AIButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style" | "children"> & {
  label?: string;
  /**
   * Scale to apply on press (Motion). Default 0.96.
   */
  pressScale?: number;
};

export function AIButton({
  label = "Join BECU",
  pressScale = 0.96,
  className = "",
  disabled,
  ...rest
}: AIButtonProps) {
  const {
    type: incomingType,
    onFocus: restOnFocus,
    onBlur: restOnBlur,
    onPointerEnter: restOnPointerEnter,
    onPointerLeave: restOnPointerLeave,
    tabIndex: restTabIndex,
    ...restProps
  } = rest;

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Press animation using Motion
  useEffect(() => {
    if (!buttonRef.current || disabled) return;
    const el = buttonRef.current;
    const detach = press(el, (element) => {
      animate(element, { scale: pressScale }, { type: "spring", stiffness: 800, damping: 40 });
      return () => animate(element, { scale: 1 }, { type: "spring", stiffness: 600, damping: 35 });
    });
    return () => {
      detach?.();
    };
  }, [disabled, pressScale]);

  const handlePointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
    setHovered(true);
    // Trigger animation restart by incrementing key
    setAnimationKey((k) => k + 1);
    restOnPointerEnter?.(e);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    setHovered(false);
    restOnPointerLeave?.(e);
  };

  const finalClassName = [
    "ai-button",
    disabled ? "is-disabled" : "",
    hovered ? "is-hovered" : "",
    focused ? "is-focused" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={buttonRef}
      className={finalClassName}
      type={incomingType ?? "button"}
      disabled={disabled}
      tabIndex={disabled ? -1 : restTabIndex ?? 0}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={(e) => {
        setFocused(true);
        restOnFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        restOnBlur?.(e);
      }}
      {...restProps}
    >
      <span className="ai-button__border" key={`border-${animationKey}`} />
      <span className="ai-button__content">
        <span className="ai-button__label">{label}</span>
      </span>
    </button>
  );
}

export default AIButton;
