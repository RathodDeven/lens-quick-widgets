import { Theme, Size, ThemeColor } from "./types"

export const backgroundColorMap: Record<Theme, ThemeColor> = {
  default: ThemeColor.darkGray,
  light: ThemeColor.lightGray,
  dark: ThemeColor.lightBlack,
  green: ThemeColor.green,
  mint: ThemeColor.mint,
  peach: ThemeColor.peach,
  lavender: ThemeColor.lavender,
  blonde: ThemeColor.blonde,
}

export const foregroundColorMap: Record<Theme, ThemeColor> = {
  default: ThemeColor.lightGray,
  light: ThemeColor.darkGray,
  dark: ThemeColor.lightGray,
  green: ThemeColor.mint,
  mint: ThemeColor.darkGray,
  peach: ThemeColor.darkGray,
  lavender: ThemeColor.darkGray,
  blonde: ThemeColor.darkGray,
}

export const textColorMap: Record<Theme, ThemeColor> = {
  default: ThemeColor.lightGray,
  light: ThemeColor.darkGray,
  dark: ThemeColor.lightGray,
  green: ThemeColor.mint,
  mint: ThemeColor.darkGray,
  peach: ThemeColor.darkGray,
  lavender: ThemeColor.darkGray,
  blonde: ThemeColor.darkGray,
}

const sizeMap: Record<Size, string> = {
  compact: "11px",
  small: "12px",
  medium: "16px",
  large: "18px",
}

export const dimensionsMap: Record<Size, Record<string, number>> = {
  compact: { width: 180, height: 40 },
  small: { width: 25.5, height: 16.5 },
  medium: { width: 34, height: 22 },
  large: { width: 51, height: 33 },
}

/**
 *
 * @param address - The address to get the cdn.stamp.fyi url for
 * @returns cdn.stamp.fyi url
 */
export const getStampFyiURL = (address: string) => {
  let currentAddress = address
  if (!address) {
    currentAddress = "0x0000000000000000000000000000000000000000"
  }
  return `https://cdn.stamp.fyi/avatar/eth:${currentAddress.toLowerCase()}?s=250`
}

/**
 * Determines if a color is dark based on its luminance
 * @param color Hex color string
 * @returns boolean indicating if the color is dark
 */
export function isDarkColor(color: string): boolean {
  // Convert hex to RGB
  let hex = color.replace("#", "")
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  // Calculate luminance (perceived brightness)
  // Using the formula: 0.299*R + 0.587*G + 0.114*B
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  // Consider colors with luminance < 0.5 as dark
  return luminance < 0.5
}

/**
 * Gets appropriate text color based on background color for contrast
 * @param backgroundColor Background color
 * @returns ThemeColor for text with good contrast
 */
export function getContrastColor(backgroundColor: string): ThemeColor {
  return isDarkColor(backgroundColor) ? ThemeColor.white : ThemeColor.darkGray
}

export function getContainerStyle(theme: Theme, size: Size) {
  let appendedStyles = {
    backgroundColor: backgroundColorMap[theme],
    padding: "6px 13px 6px 9px",
  }
  if (size === Size.large) {
    appendedStyles.padding = "8px 18px 8px 13px"
  }
  if (size === Size.small) {
    appendedStyles.padding = "6px 13px 6px 9px"
  }
  return {
    ...styles.buttonContainer,
    ...appendedStyles,
  }
}

export function getTextStyle(theme: Theme, size: Size) {
  let appendedStyles = {
    color: foregroundColorMap[theme],
    fontSize: sizeMap[size],
  }
  return {
    ...styles.text,
    ...appendedStyles,
  }
}

const styles = {
  buttonContainer: {
    outline: "none",
    border: "none",
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  text: {
    margin: "0px 0px 0px 6px",
    padding: 0,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
}
