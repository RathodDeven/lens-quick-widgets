import React from "react"

export interface CardProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  title?: string
  footer?: React.ReactNode
  elevation?: "low" | "medium" | "high"
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  title,
  footer,
  elevation = "medium",
  onClick,
}) => {
  // Define shadow based on elevation
  const getShadowStyle = () => {
    switch (elevation) {
      case "low":
        return "0 2px 4px rgba(0,0,0,0.1)"
      case "medium":
        return "0 4px 8px rgba(0,0,0,0.1)"
      case "high":
        return "0 8px 16px rgba(0,0,0,0.1)"
    }
  }

  return (
    <div
      style={{
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: getShadowStyle(),
        backgroundColor: "#ffffff",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onClick={onClick}
    >
      {title && (
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #eaeaea",
            fontWeight: 600,
          }}
        >
          {title}
        </div>
      )}
      <div style={{ padding: "16px" }}>{children}</div>
      {footer && (
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #eaeaea",
            backgroundColor: "#f9f9f9",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  )
}
