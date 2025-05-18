import React, { useState, useEffect, useRef } from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { Theme, ThemeColor } from "./types"

interface LoadingImageProps extends HTMLMotionProps<"img"> {
  loaderClassName?: string
  defaultImage?: string
  loadingTimeout?: number
  theme?: Theme
}

const getThemeColor = (theme: Theme): string => {
  switch (theme) {
    case Theme.light:
      return ThemeColor.lightGray
    case Theme.dark:
      return ThemeColor.darkGray
    case Theme.mint:
      return ThemeColor.mint
    case Theme.green:
      return ThemeColor.lightGreen
    case Theme.peach:
      return ThemeColor.peach
    case Theme.lavender:
      return ThemeColor.lavender
    case Theme.blonde:
      return ThemeColor.blonde
    default:
      return ThemeColor.lightGray
  }
}

export const LoadingImage: React.FC<LoadingImageProps> = ({
  loaderClassName = "",
  theme = Theme.default,
  loadingTimeout = 5000, // 5 seconds default timeout
  style,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const image = imageRef.current

    const handleLoad = () => {
      setIsLoaded(true)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    const handleError = (e: Event) => {
      console.error("Image failed to load", e)
    }

    if (image) {
      image.addEventListener("load", handleLoad)
      image.addEventListener("error", handleError)

      // Set a timeout in case the load event doesn't fire
      timeoutRef.current = setTimeout(() => {
        setIsLoaded(true)
      }, loadingTimeout)
    }

    return () => {
      if (image) {
        image.removeEventListener("load", handleLoad)
        image.removeEventListener("error", handleError)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [props.src, loadingTimeout])

  const loaderStyles: React.CSSProperties = {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: getThemeColor(theme),
    ...(loaderClassName ? {} : {}),
  }

  const pulseAnimation = {
    opacity: [0.6, 0.8, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }

  return (
    <div
      style={{
        // @ts-ignore
        position: "relative",
        ...(style || {}),
      }}
    >
      {!isLoaded && (
        <motion.div style={loaderStyles} animate={pulseAnimation} />
      )}
      <motion.img
        {...props}
        ref={imageRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        style={{
          position: "relative" as const,
          zIndex: 10,
          ...(style || {}),
        }}
        loading="eager"
      />
    </div>
  )
}
