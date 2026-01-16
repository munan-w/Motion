import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { animate } from "motion";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import "./radio.css";

type RadioState = "Rest" | "Hover" | "Focus" | "Error" | "Disabled";

type RadioProps = {
  state?: RadioState;
  checked?: boolean;
  defaultChecked?: boolean;
  label?: string;
  helperText?: string;
  showHelper?: boolean;
  errorText?: string;
  showErrorIcon?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
};

const colors = {
  brand: "#007C89",
  brandHoverGlow: "rgba(0,124,137,0.4)",
  brandHoverBorder: "#007C89",
  focus: "#1D75B2",
  borderDefault: "#768A9B",
  text: "#192838",
  textSubtle: "#4D5F69",
  disabled: "#BAC7CE",
  danger: "#D62B2F",
  white: "#FFFFFF",
};

const ErrorIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden focusable="false">
    <circle cx="10" cy="10" r="9" stroke={color} strokeWidth="2" />
    <path d="M10 5.5v6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="10" cy="14.5" r="1" fill={color} />
  </svg>
);

export default function Radio({
  state = "Rest",
  checked,
  defaultChecked = false,
  label = "Radio label",
  helperText = "Helper message",
  showHelper = false,
  errorText = "Error message",
  showErrorIcon = true,
  onChange,
  className = "",
}: RadioProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const dotProgress = useMotionValue(defaultChecked ? 1 : 0);

  const isDisabled = state === "Disabled";
  const isError = state === "Error";
  const isFocus = state === "Focus" || (state === "Rest" && focused);
  const isHover = state === "Hover" || (state === "Rest" && hovered);

  const currentChecked = checked !== undefined ? checked : internalChecked;

  useEffect(() => {
    animate(dotProgress, currentChecked ? 1 : 0, { duration: 0.2, ease: "easeInOut" });
  }, [currentChecked, dotProgress]);

  const palette = useMemo(() => {
    if (isDisabled) {
      return {
        ring: colors.disabled,
        dot: colors.white,
        label: colors.disabled,
        helper: colors.textSubtle,
        focusRing: undefined,
        hoverRing: undefined,
      };
    }

    if (isError) {
      return {
        ring: colors.danger,
        dot: colors.white,
        label: colors.text,
        helper: colors.danger,
        focusRing: undefined,
        hoverRing: undefined,
      };
    }

    const selected = currentChecked;

    return {
      ring: selected ? colors.brand : isHover ? colors.brandHoverBorder : colors.borderDefault,
      dot: colors.brand,
      label: colors.text,
      helper: colors.textSubtle,
      focusRing: isFocus ? colors.focus : undefined,
      hoverRing: isHover ? colors.brandHoverGlow : undefined,
    };
  }, [currentChecked, isDisabled, isError, isFocus, isHover]);

  const onActivate: React.MouseEventHandler<HTMLLabelElement> = (e) => {
    if (isDisabled) return;
    e.preventDefault();
    const nextValue = !currentChecked;
    if (checked !== undefined) {
      onChange?.(nextValue);
    } else {
      setInternalChecked(nextValue);
      onChange?.(nextValue);
    }
  };

  const computedClass = ["radio", isDisabled ? "is-disabled" : "", className].filter(Boolean).join(" ");

  return (
    <label
      className={computedClass}
      style={{
        ["--rd-ring" as string]: palette.ring,
        ["--rd-dot" as string]: palette.dot,
        ["--rd-label" as string]: palette.label,
        ["--rd-helper" as string]: palette.helper,
        ["--rd-hover" as string]: palette.hoverRing ?? "transparent",
        ["--rd-focus" as string]: palette.focusRing ?? "transparent",
      }}
      onClick={onActivate}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      role="radio"
      aria-checked={currentChecked}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
    >
      <span className="radio__control" aria-hidden>
        {palette.hoverRing && <span className="radio__glow" />}
        <span className="radio__core">
          <AnimatePresence initial={false}>
            {currentChecked ? (
              <motion.span
                key="dot"
                className="radio__dot"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{ scale: dotProgress }}
                transition={{ duration: 0.2 }}
              />
            ) : null}
          </AnimatePresence>
        </span>
        {palette.focusRing && <span className="radio__focus" />}
      </span>
      <span className="radio__content">
        <span className={`radio__label ${isError && showErrorIcon ? "radio__label--with-icon" : ""}`}>
          {isError && showErrorIcon && <ErrorIcon color={colors.danger} />}
          <span>{label}</span>
        </span>
        {showHelper && <span className="radio__helper">{isError ? errorText : helperText}</span>}
      </span>
    </label>
  );
}
