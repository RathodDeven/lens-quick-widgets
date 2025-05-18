import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeColor } from "./types"
import ReactDOM from "react-dom"

/**
 * Tooltip Component - Displays informational content on hover
 *
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.content - Content to display in the tooltip
 * @param {React.ReactNode} props.children - Trigger element that activates the tooltip on hover
 * @param {string} [props.position="top"] - Position of the tooltip relative to its trigger
 * @param {boolean} [props.isDarkTheme=false] - Whether to use dark theme styling
 * @param {React.CSSProperties} [props.style] - Additional custom styles
 * @returns {JSX.Element} The rendered Tooltip component with children
 */
const Tooltip = ({
  content,
  children,
  position = "top",
  isDarkTheme = false,
  style,
}: {
  content: React.ReactNode
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  isDarkTheme?: boolean
  style?: React.CSSProperties
}) => {
  const [visible, setVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)

  // Update tooltip position based on trigger element position
  useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      let top = 0
      let left = 0

      switch (position) {
        case "bottom":
          top = rect.bottom + scrollTop
          left = rect.left + scrollLeft + rect.width / 2
          break
        case "left":
          top = rect.top + scrollTop + rect.height / 2
          left = rect.left + scrollLeft
          break
        case "right":
          top = rect.top + scrollTop + rect.height / 2
          left = rect.right + scrollLeft
          break
        case "top":
        default:
          // Set position to be above the element (at the top edge)
          // We'll adjust with transform in the styles
          top = rect.top + scrollTop - 10 // Add some space above
          left = rect.left + scrollLeft
          break
      }

      setTooltipPosition({ top, left })
    }
  }, [visible, position])

  // Animation configuration based on position
  const getAnimationProps = () => {
    switch (position) {
      case "bottom":
        return {
          initial: { opacity: 0, y: -5 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -5 },
        }
      case "left":
        return {
          initial: { opacity: 0, x: 5 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 5 },
        }
      case "right":
        return {
          initial: { opacity: 0, x: -5 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -5 },
        }
      case "top":
      default:
        return {
          initial: { opacity: 0, y: 5 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 5 },
        }
    }
  }

  // Calculate styles for the tooltip element including positioning
  const getTooltipStyles = () => {
    // Basic styles for all tooltips
    const baseStyles = {
      position: "absolute" as const,
      zIndex: 9999,
      backgroundColor: isDarkTheme ? ThemeColor.darkGray : ThemeColor.white,
      color: isDarkTheme ? ThemeColor.white : ThemeColor.darkGray,
      padding: "5px 10px",
      borderRadius: "5px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      whiteSpace: "nowrap" as const,
      fontSize: "12px",
      ...style,
    }

    // Position-specific styles when using a portal
    const positionStyles = {
      top: 0,
      left: 0,
    }

    switch (position) {
      case "bottom":
        return {
          ...baseStyles,
          ...positionStyles,
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: "translate(-50%, 5px)",
          marginTop: "5px",
        }
      case "left":
        return {
          ...baseStyles,
          ...positionStyles,
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: "translate(calc(-100% - 5px), -50%)",
          marginRight: "5px",
        }
      case "right":
        return {
          ...baseStyles,
          ...positionStyles,
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: "translate(5px, -50%)",
          marginLeft: "5px",
        }
      case "top":
      default:
        return {
          ...baseStyles,
          ...positionStyles,
          top: "auto", // Use auto to allow bottom positioning to take effect
          bottom: `calc(100vh - ${tooltipPosition.top}px)`, // Position from bottom of viewport
          left: tooltipPosition.left,
          transform: "none", // Remove transform as we're using bottom positioning
        }
    }
  }

  const animationProps = getAnimationProps()

  // Render the tooltip in a portal to avoid container clipping
  const tooltipElement = (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={getTooltipStyles()}
          {...animationProps}
          transition={{ duration: 0.2 }}
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Container with hover events that wraps the children
  return (
    <div
      ref={triggerRef}
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible &&
        typeof document !== "undefined" &&
        ReactDOM.createPortal(tooltipElement, document.body)}
    </div>
  )
}

export default Tooltip
