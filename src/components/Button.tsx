import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, press } from "motion";
import "./button.css";

type Variant = "Primary" | "Secondary" | "Tertiary" | "Neutral" | "Dark";
type VisualState = "Rest" | "Hover" | "Pressed" | "Focus" | "Loading" | "Disabled";

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style" | "children"> & {
  label?: string;
  variant?: Variant;
  state?: VisualState;
  onColor?: boolean;
  iconOnly?: boolean;
  /**
   * Shows the default left icon when true. Provide leftIconSlot to override.
   */
  leftIcon?: boolean;
  /**
   * Overrides the left icon content when leftIcon is true.
   */
  leftIconSlot?: React.ReactNode;
  /**
   * Adds a right-side dropdown chevron.
   */
  dropdown?: boolean;
  /**
   * Icon content. Used automatically when iconOnly is true; otherwise use for right-side placement.
   */
  icon?: React.ReactNode;
  /**
   * Removes horizontal padding (for tight icon-only layouts).
   */
  noPadding?: boolean;
  /**
   * Convenience flag. Equivalent to state="Loading".
   */
  loading?: boolean;
  /**
   * Scale to apply on press (Motion). Default 0.96.
   */
  pressScale?: number;
};

type Token = {
  background: string;
  border: string;
  text: string;
  focusRing?: string;
  spinner?: string;
  iconLeft?: string;
  iconRight?: string;
};

type TokenMap = Record<Variant, { default: Record<Lowercase<VisualState>, Token>; onColor: Record<Lowercase<VisualState>, Token> }>;

const palette = {
  brand: "#007C89",
  brandHover: "#004651",
  brandPressed: "#0D1723",
  neutral: "#cbd4d9",
  neutralHover: "#b6c2c9",
  neutralPressed: "#a4b1ba",
  neutralBorder: "#d6dde3",
  neutralText: "#192838",
  ghostHover: "#445b72",
  ghostPressed: "#0d1723",
  darkSurface: "#0d1723",
  inverse: "#ffffff",
  disabledBg: "#BAC7CE",
  disabledText: "#e5edf2",
  focus: "#1d75b2",
};

const tokens: TokenMap = {
  Primary: {
    default: {
      rest: { background: palette.brand, border: palette.brand, text: palette.inverse, iconLeft: "#4d5f69", iconRight: "#192838" },
      hover: { background: palette.brandHover, border: palette.brandHover, text: palette.inverse, iconLeft: "#4d5f69", iconRight: "#192838" },
      pressed: { background: palette.brandPressed, border: palette.brandPressed, text: palette.inverse, iconLeft: "#4d5f69", iconRight: "#192838" },
      focus: { background: palette.brand, border: palette.brand, text: palette.inverse, focusRing: palette.focus, iconLeft: "#4d5f69", iconRight: "#192838" },
      loading: { background: palette.brandPressed, border: palette.brandPressed, text: palette.inverse, spinner: palette.inverse, iconLeft: "#4d5f69", iconRight: "#192838" },
      disabled: { background: palette.disabledBg, border: palette.disabledBg, text: palette.inverse, iconLeft: palette.inverse, iconRight: palette.inverse },
    },
    onColor: {
      rest: { background: palette.brand, border: palette.inverse, text: palette.inverse, iconLeft: palette.inverse, iconRight: palette.inverse },
      hover: { background: palette.brandHover, border: palette.inverse, text: palette.inverse, iconLeft: palette.inverse, iconRight: palette.inverse },
      pressed: { background: palette.brandPressed, border: palette.inverse, text: palette.inverse, iconLeft: palette.inverse, iconRight: palette.inverse },
      focus: { background: palette.brand, border: palette.inverse, text: palette.inverse, focusRing: palette.focus, iconLeft: palette.inverse, iconRight: palette.inverse },
      loading: { background: palette.brandPressed, border: palette.inverse, text: palette.inverse, spinner: palette.inverse, iconLeft: palette.inverse, iconRight: palette.inverse },
      disabled: { background: "rgba(255,255,255,0.12)", border: "rgba(255,255,255,0.3)", text: "rgba(255,255,255,0.5)", iconLeft: "rgba(255,255,255,0.5)", iconRight: "rgba(255,255,255,0.5)" },
    },
  },
  Secondary: {
    default: {
      rest: { background: "transparent", border: palette.brand, text: palette.brand },
      hover: { background: "#e6f2f5", border: palette.brand, text: palette.brand },
      pressed: { background: "#d6e8ec", border: palette.brandHover, text: palette.brandHover },
      focus: { background: "transparent", border: palette.brand, text: palette.brand, focusRing: palette.focus },
      loading: { background: "#d6e8ec", border: palette.brandHover, text: palette.brandHover, spinner: palette.brandHover },
      disabled: { background: "transparent", border: palette.neutralBorder, text: palette.disabledText },
    },
    onColor: {
      rest: { background: "transparent", border: palette.inverse, text: palette.inverse },
      hover: { background: palette.ghostHover, border: palette.inverse, text: palette.inverse },
      pressed: { background: palette.ghostPressed, border: palette.inverse, text: palette.inverse },
      focus: { background: "transparent", border: palette.inverse, text: palette.inverse, focusRing: palette.focus },
      loading: { background: palette.ghostPressed, border: palette.inverse, text: palette.inverse, spinner: palette.inverse },
      disabled: { background: "transparent", border: "rgba(255,255,255,0.4)", text: "rgba(255,255,255,0.5)" },
    },
  },
  Tertiary: {
    default: {
      rest: { background: "transparent", border: "transparent", text: palette.brand },
      hover: { background: "#f1f5f7", border: "transparent", text: palette.brandHover },
      pressed: { background: "#e3eaed", border: "transparent", text: palette.brandHover },
      focus: { background: "transparent", border: "transparent", text: palette.brand, focusRing: palette.focus },
      loading: { background: "#e3eaed", border: "transparent", text: palette.brandHover, spinner: palette.brandHover },
      disabled: { background: "transparent", border: "transparent", text: palette.disabledText },
    },
    onColor: {
      rest: { background: "transparent", border: "transparent", text: palette.inverse },
      hover: { background: palette.ghostHover, border: "transparent", text: palette.inverse },
      pressed: { background: palette.ghostPressed, border: "transparent", text: palette.inverse },
      focus: { background: "transparent", border: "transparent", text: palette.inverse, focusRing: palette.focus },
      loading: { background: palette.ghostPressed, border: "transparent", text: palette.inverse, spinner: palette.inverse },
      disabled: { background: "transparent", border: "transparent", text: "rgba(255,255,255,0.55)" },
    },
  },
  Neutral: {
    default: {
      rest: { background: palette.neutral, border: palette.neutral, text: palette.neutralText },
      hover: { background: palette.neutralHover, border: palette.neutralHover, text: palette.neutralText },
      pressed: { background: palette.neutralPressed, border: palette.neutralPressed, text: palette.neutralText },
      focus: { background: palette.neutral, border: palette.neutral, text: palette.neutralText, focusRing: palette.focus },
      loading: { background: palette.neutralPressed, border: palette.neutralPressed, text: palette.neutralText, spinner: palette.neutralText },
      disabled: { background: palette.disabledBg, border: palette.disabledBg, text: palette.disabledText },
    },
    onColor: {
      rest: { background: "rgba(255,255,255,0.12)", border: "rgba(255,255,255,0.55)", text: palette.inverse },
      hover: { background: palette.ghostHover, border: "rgba(255,255,255,0.55)", text: palette.inverse },
      pressed: { background: palette.ghostPressed, border: "rgba(255,255,255,0.55)", text: palette.inverse },
      focus: { background: "rgba(255,255,255,0.12)", border: "rgba(255,255,255,0.55)", text: palette.inverse, focusRing: palette.focus },
      loading: { background: palette.ghostPressed, border: "rgba(255,255,255,0.55)", text: palette.inverse, spinner: palette.inverse },
      disabled: { background: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.25)", text: "rgba(255,255,255,0.45)" },
    },
  },
  Dark: {
    default: {
      rest: { background: "#1c2c38", border: "#1c2c38", text: palette.inverse },
      hover: { background: palette.brandHover, border: palette.brandHover, text: palette.inverse },
      pressed: { background: palette.brandPressed, border: palette.brandPressed, text: palette.inverse },
      focus: { background: "#1c2c38", border: "#1c2c38", text: palette.inverse, focusRing: palette.focus },
      loading: { background: palette.brandPressed, border: palette.brandPressed, text: palette.inverse, spinner: palette.inverse },
      disabled: { background: palette.disabledBg, border: palette.disabledBg, text: palette.disabledText },
    },
    onColor: {
      rest: { background: palette.darkSurface, border: palette.inverse, text: palette.inverse },
      hover: { background: palette.ghostHover, border: palette.inverse, text: palette.inverse },
      pressed: { background: palette.ghostPressed, border: palette.inverse, text: palette.inverse },
      focus: { background: palette.darkSurface, border: palette.inverse, text: palette.inverse, focusRing: palette.focus },
      loading: { background: palette.ghostPressed, border: palette.inverse, text: palette.inverse, spinner: palette.inverse },
      disabled: { background: "rgba(255,255,255,0.12)", border: "rgba(255,255,255,0.3)", text: "rgba(255,255,255,0.5)" },
    },
  },
};

const toKey = (value?: VisualState): Lowercase<VisualState> => (value ? value.toLowerCase() as Lowercase<VisualState> : "rest");

const AddIcon = () => (
  <svg aria-hidden focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MoreIcon = () => (
  <svg aria-hidden focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="6.5" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="17.5" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

const ChevronDown = () => (
  <svg aria-hidden focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Spinner = ({ color }: { color?: string }) => (
  <span className="ds-button__spinner" style={{ borderTopColor: color, borderLeftColor: color }} aria-hidden />
);

export function Button({
  label = "Button",
  variant = "Primary",
  state = "Rest",
  onColor = false,
  iconOnly = false,
  leftIcon = false,
  leftIconSlot,
  dropdown = false,
  icon,
  noPadding = false,
  loading,
  disabled,
  pressScale = 0.96,
  className = "",
  ...rest
}: ButtonProps) {
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

  const isLoading = loading || state === "Loading";
  const isDisabled = disabled || state === "Disabled";
  const effectiveState: VisualState = isDisabled ? "Disabled" : isLoading ? "Loading" : state || "Rest";
  const lockedState = effectiveState !== "Rest";

  const paletteTokens = tokens[variant][onColor ? "onColor" : "default"];
  const resolved = paletteTokens[toKey(effectiveState)] ?? paletteTokens.rest;

  const interactiveVars = useMemo(
    () => ({
      ["--btn-bg-rest" as string]: paletteTokens.rest.background,
      ["--btn-border-rest" as string]: paletteTokens.rest.border,
      ["--btn-text-rest" as string]: paletteTokens.rest.text,
      ["--btn-bg-hover" as string]: paletteTokens.hover.background,
      ["--btn-border-hover" as string]: paletteTokens.hover.border,
      ["--btn-text-hover" as string]: paletteTokens.hover.text,
      ["--btn-bg-pressed" as string]: paletteTokens.pressed.background,
      ["--btn-border-pressed" as string]: paletteTokens.pressed.border,
      ["--btn-text-pressed" as string]: paletteTokens.pressed.text,
      ["--btn-focus-ring" as string]: resolved.focusRing ?? paletteTokens.rest.focusRing ?? palette.focus,
      ["--btn-spinner" as string]: resolved.spinner ?? resolved.text,
      ["--btn-icon-left" as string]: resolved.iconLeft ?? resolved.text,
      ["--btn-icon-right" as string]: resolved.iconRight ?? resolved.text,
    }),
    [paletteTokens, resolved]
  );

  useEffect(() => {
    if (!buttonRef.current || isDisabled || isLoading) return;
    const el = buttonRef.current;
    const detach = press(el, (element) => {
      animate(element, { scale: pressScale }, { type: "spring", stiffness: 800, damping: 40 });
      return () => animate(element, { scale: 1 }, { type: "spring", stiffness: 600, damping: 35 });
    });
    return () => {
      detach?.();
    };
  }, [isDisabled, isLoading, pressScale]);

  const finalClassName = [
    "ds-button",
    `ds-button--${variant.toLowerCase()}`,
    iconOnly ? "ds-button--icon-only" : "",
    noPadding ? "ds-button--no-padding" : "",
    onColor ? "ds-button--on-color" : "",
    isDisabled ? "is-disabled" : "",
    isLoading ? "is-loading" : "",
    lockedState ? "is-static" : "is-interactive",
    hovered ? "is-hovered" : "",
    focused ? "is-focused" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const contentColor = resolved.text;

  const showLeftIcon = leftIcon;
  const showDropdown = dropdown && !iconOnly;

  const left = useMemo(
    () => (showLeftIcon ? leftIconSlot || <AddIcon /> : null),
    [leftIconSlot, showLeftIcon]
  );

  const middle = useMemo(() => {
    if (isLoading) return <Spinner color={resolved.spinner ?? contentColor} />;
    if (iconOnly) return icon || <MoreIcon />;
    return null;
  }, [contentColor, icon, iconOnly, isLoading, resolved.spinner]);

  const right = useMemo(() => {
    if (iconOnly) return null;
    if (showDropdown) return icon || <ChevronDown />;
    return icon;
  }, [icon, iconOnly, showDropdown]);

  return (
    <button
      ref={buttonRef}
      className={finalClassName}
      style={interactiveVars}
      type={incomingType ?? "button"}
      aria-label={iconOnly ? label : undefined}
      aria-busy={isLoading}
      disabled={isDisabled || isLoading}
      tabIndex={isDisabled || isLoading ? -1 : restTabIndex ?? 0}
      onPointerEnter={(e) => {
        setHovered(true);
        restOnPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        setHovered(false);
        restOnPointerLeave?.(e);
      }}
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
      {iconOnly ? (
        middle
      ) : (
        <>
          {left && <span className="ds-button__icon">{left}</span>}
          <span className="ds-button__label">{label}</span>
          {right && <span className="ds-button__icon ds-button__icon--right">{right}</span>}
        </>
      )}
    </button>
  );
}

export default Button;
