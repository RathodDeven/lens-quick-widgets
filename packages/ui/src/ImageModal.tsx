import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes } from "react-icons/fa"

/**
 * Props for the ImageModal component
 *
 * @interface ImageModalProps
 * @property {string} imageSrc - Source URL of the image to display
 * @property {string} [imageAlt] - Alt text for the image
 * @property {React.ReactNode} [trigger] - Custom trigger element (will receive onClick handler)
 * @property {React.CSSProperties} [overlayStyle] - Custom styles for the overlay
 * @property {React.CSSProperties} [contentStyle] - Custom styles for the content container
 * @property {React.CSSProperties} [imageStyle] - Custom styles for the image
 * @property {React.CSSProperties} [closeButtonStyle] - Custom styles for the close button
 * @property {React.ReactNode} [closeButtonContent] - Custom content for the close button
 * @property {boolean} [defaultOpen=false] - Whether the modal should be open by default
 * @property {Function} [onOpen] - Callback when the modal opens
 * @property {Function} [onClose] - Callback when the modal closes
 */
export interface ImageModalProps {
  imageSrc: string
  imageAlt?: string
  trigger?: React.ReactNode
  overlayStyle?: React.CSSProperties
  contentStyle?: React.CSSProperties
  imageStyle?: React.CSSProperties
  closeButtonStyle?: React.CSSProperties
  closeButtonContent?: React.ReactNode
  defaultOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
  // For backward compatibility
  isOpen?: boolean
}

/**
 * A modal component for displaying images with animations
 *
 * @component
 * @example
 * ```tsx
 * <ImageModal
 *   imageSrc="https://example.com/image.jpg"
 *   imageAlt="Example image"
 *   trigger={<button>View Image</button>}
 * />
 * ```
 */
export const ImageModal: React.FC<ImageModalProps> = ({
  imageSrc,
  imageAlt = "Image",
  trigger,
  overlayStyle,
  contentStyle,
  imageStyle,
  closeButtonStyle,
  closeButtonContent,
  defaultOpen = false,
  onOpen,
  onClose,
  isOpen: externalIsOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen)

  // Determine if controlled or uncontrolled
  const isControlled = externalIsOpen !== undefined
  const isOpen = isControlled ? externalIsOpen : internalIsOpen

  const handleOpen = () => {
    if (!isControlled) {
      setInternalIsOpen(true)
    }
    onOpen?.()
  }

  const handleClose = () => {
    if (!isControlled) {
      setInternalIsOpen(false)
    }
    onClose?.()
  }

  // Clone the trigger element and add the onClick handler
  const triggerElement = trigger
    ? React.cloneElement(trigger as React.ReactElement, {
        onClick: (e: React.MouseEvent) => {
          // Preserve original onClick if it exists
          const originalOnClick = (trigger as React.ReactElement).props.onClick
          if (originalOnClick) originalOnClick(e)

          // Call our open handler
          handleOpen()
        },
      })
    : null

  const defaultOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const defaultContentStyle: React.CSSProperties = {
    position: "relative",
    maxWidth: "90%",
    maxHeight: "90%",
  }

  const defaultImageStyle: React.CSSProperties = {
    maxWidth: "100%",
    maxHeight: "80vh",
    borderRadius: "8px",
  }

  const defaultCloseButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "-40px",
    right: "-40px",
    background: "none",
    border: "none",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
  }

  return (
    <>
      {triggerElement}

      {isOpen && (
        <AnimatePresence>
          <motion.div
            style={{ ...defaultOverlayStyle, ...overlayStyle }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              style={{ ...defaultContentStyle, ...contentStyle }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                style={{ ...defaultCloseButtonStyle, ...closeButtonStyle }}
                onClick={handleClose}
              >
                {closeButtonContent || <FaTimes />}
              </button>
              <motion.img
                src={imageSrc}
                alt={imageAlt}
                style={{ ...defaultImageStyle, ...imageStyle }}
                whileHover={{ scale: 1.02 }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  )
}

export default ImageModal
