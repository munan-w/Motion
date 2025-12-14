import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate } from "motion";
import { motion, useMotionValue, AnimatePresence } from "motion/react";
import "./checkbox.css";

type CheckboxState = "Rest" | "Hover" | "Focus" | "Error" | "Disabled";
type CheckboxStatus = "Unselected" | "Selected" | "Indeterminate";

type CheckboxProps = {
  state?: CheckboxState;
  status?: CheckboxStatus;
  label?: string;
  helperText?: string;
  showHelper?: boolean;
  errorText?: string;
  /** Adds the leading error icon in error state. */
  showErrorIcon?: boolean;
  className?: string;
  onChange?: (checked: boolean) => void;
  checked?: boolean;
};

const colors = {
  brand: "#007C89",
  brandHoverGlow: "rgba(0,124,137,0.4)",
  brandHoverBorder: "#007C89",
  borderDefault: "#768A9B",
  focus: "#1D75B2",
  selectedBg: "#2D4157",
  text: "#192838",
  textSubtle: "#4D5F69",
  disabled: "#BAC7CE",
  danger: "#D62B2F",
  white: "#FFFFFF",
};

const CheckIcon = ({ color, progress }: { color: string; progress: any }) => (
  <motion.svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden focusable="false">
    <motion.path
      d="M3 8.2 6.5 11.5 13 4.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="1 1"
      style={{ pathLength: progress }}
    />
  </motion.svg>
);

const MinusIcon = ({ color, progress }: { color: string; progress: any }) => (
  <motion.svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden focusable="false">
    <motion.path d="M4 8h8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="1 1" style={{ pathLength: progress }} />
  </motion.svg>
);

const ErrorIcon = ({ color }: { color: string }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden focusable="false">
    <circle cx="10" cy="10" r="9" stroke={color} strokeWidth="2" />
    <path d="M10 5.5v6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="10" cy="14.5" r="1" fill={color} />
  </svg>
);

export function Checkbox({
  state = "Rest",
  status = "Unselected",
  label = "Label",
  helperText = "Helper message",
  showHelper = false,
  errorText = "Error message",
  showErrorIcon = true,
  className = "",
  onChange,
  checked,
}: CheckboxProps) {
  const ref = useRef<HTMLLabelElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [internalStatus, setInternalStatus] = useState<CheckboxStatus>(status);
  const checkProgress = useMotionValue(status === "Selected" ? 1 : 0);
  const indeterminateProgress = useMotionValue(status === "Indeterminate" ? 1 : 0);

  // Sync internal with controlled status prop
  useEffect(() => {
    setInternalStatus(status);
  }, [status]);

  const currentStatus: CheckboxStatus =
    checked !== undefined ? (checked ? "Selected" : "Unselected") : internalStatus;

  const disabled = state === "Disabled";
  const isError = state === "Error";
  const isFocus = state === "Focus" || (state === "Rest" && focused);
  const isHover = state === "Hover" || (state === "Rest" && hovered);

  useEffect(() => {
    animate(checkProgress, currentStatus === "Selected" ? 1 : 0, { duration: 0.2, ease: "easeInOut" });
    animate(indeterminateProgress, currentStatus === "Indeterminate" ? 1 : 0, { duration: 0.2, ease: "easeInOut" });
  }, [checkProgress, indeterminateProgress, currentStatus]);

  const palette = useMemo(() => {
    if (disabled) {
      return {
        boxBg: currentStatus === "Unselected" ? colors.white : colors.disabled,
        boxBorder: colors.disabled,
        icon: colors.white,
        text: colors.disabled,
        helper: colors.textSubtle,
        focusRing: undefined,
        hoverRing: undefined,
      };
    }

    if (isError) {
      return {
        boxBg: colors.danger,
        boxBorder: colors.danger,
        icon: colors.white,
        text: colors.text,
        helper: colors.danger,
        focusRing: undefined,
        hoverRing: undefined,
      };
    }

    const baseSelected = {
      boxBg: colors.selectedBg,
      boxBorder: isHover ? colors.brand : colors.selectedBg,
      icon: colors.white,
      text: colors.text,
      helper: colors.textSubtle,
      focusRing: isFocus ? colors.focus : undefined,
      hoverRing: isHover ? colors.brandHoverGlow : undefined,
    };

    if (currentStatus === "Selected" || currentStatus === "Indeterminate") {
      return baseSelected;
    }

    // Unselected
    return {
      boxBg: colors.white,
      boxBorder: isHover ? colors.brandHoverBorder : colors.borderDefault,
      icon: colors.white,
      text: colors.text,
      helper: colors.textSubtle,
      focusRing: isFocus ? colors.focus : undefined,
      hoverRing: isHover ? colors.brandHoverGlow : undefined,
    };
  }, [currentStatus, disabled, isError, isFocus, isHover]);

  const iconNode =
    currentStatus === "Indeterminate" ? (
      <MinusIcon color={palette.icon} progress={indeterminateProgress} />
    ) : (
      <CheckIcon color={palette.icon} progress={checkProgress} />
    );

  const showIcon = currentStatus === "Selected" || currentStatus === "Indeterminate";

  const handleClick: React.MouseEventHandler<HTMLLabelElement> = (e) => {
    if (disabled || !onChange) return;
    e.preventDefault();
    if (checked !== undefined) {
      onChange(!checked);
    } else {
      setInternalStatus((prev) =>
        prev === "Selected" ? "Unselected" : "Selected"
      );
    }
  };

  const computedClass = ["checkbox", disabled ? "is-disabled" : "", className].filter(Boolean).join(" ");

  const ariaChecked = currentStatus === "Unselected" ? false : currentStatus === "Selected" ? true : "mixed";

  return (
    <label
      ref={ref}
      className={computedClass}
      style={{
        ["--cb-bg" as string]: palette.boxBg,
        ["--cb-border" as string]: palette.boxBorder,
        ["--cb-border-width" as string]: palette.hoverRing ? "2px" : "1px",
        ["--cb-icon" as string]: palette.icon,
        ["--cb-text" as string]: palette.text,
        ["--cb-helper" as string]: palette.helper,
        ["--cb-hover" as string]: palette.hoverRing ?? "transparent",
        ["--cb-focus" as string]: palette.focusRing ?? "transparent",
      }}
      onClick={handleClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-checked={ariaChecked as boolean | "mixed"}
      role="checkbox"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      <span className="checkbox__box" aria-hidden>
        {palette.hoverRing && <span className="checkbox__glow" />}
        <span className="checkbox__core">
          <AnimatePresence initial={false} mode="wait">
            {showIcon ? (
              <motion.span
                key={currentStatus}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                {iconNode}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </span>
        {palette.focusRing && <span className="checkbox__focus" />}
      </span>
      <span className="checkbox__content">
        <span className={`checkbox__label ${isError && showErrorIcon ? "checkbox__label--with-icon" : ""}`}>
          {isError && showErrorIcon && <ErrorIcon color={colors.danger} />}
          <span>{label}</span>
        </span>
        {showHelper && <span className="checkbox__helper">{isError ? errorText : helperText}</span>}
      </span>
    </label>
  );
}

export default Checkbox;
