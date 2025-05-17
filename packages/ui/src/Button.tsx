import React from "react"

export interface ButtonProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  variant?: "primary" | "secondary" | "outline"
  size?: "small" | "medium" | "large"
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  style,
  variant = "primary",
  size = "medium",
  onClick,
  disabled = false,
  fullWidth = false,
}) => {
  // Define styles based on variant and size
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: disabled ? "#a0c4ff" : "#4361ee",
          color: "#ffffff",
          border: "none",
        }
      case "secondary":
        return {
          backgroundColor: disabled ? "#d8e2dc" : "#2a9d8f",
          color: "#ffffff",
          border: "none",
        }
      case "outline":
        return {
          backgroundColor: "transparent",
          color: disabled ? "#a0a0a0" : "#4361ee",
          border: `2px solid ${disabled ? "#d0d0d0" : "#4361ee"}`,
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          padding: "6px 12px",
          fontSize: "14px",
        }
      case "medium":
        return {
          padding: "8px 16px",
          fontSize: "16px",
        }
      case "large":
        return {
          padding: "12px 24px",
          fontSize: "18px",
        }
    }
  }

  return (
    <button
      style={{
        borderRadius: "4px",
        fontWeight: 500,
        cursor: disabled ? "not-allowed" : "pointer",
        width: fullWidth ? "100%" : "auto",
        transition: "all 0.2s ease",
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children || "Button"}
    </button>
  )
}
