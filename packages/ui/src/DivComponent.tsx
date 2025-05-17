import React from "react"

export interface DivComponentProps {
  children?: React.ReactNode
  style?: React.CSSProperties
  backgroundColor?: string
  rounded?: boolean
  shadow?: boolean
  onClick?: () => void
}

export const DivComponent: React.FC<DivComponentProps> = ({
  children,
  style,
  backgroundColor = "#f0f0f0",
  rounded = false,
  shadow = false,
  onClick,
}) => {
  return (
    <div
      style={{
        padding: 16,
        background: backgroundColor,
        borderRadius: rounded ? "8px" : "0",
        boxShadow: shadow ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onClick={onClick}
    >
      {"Sample Div Component"}
    </div>
  )
}
