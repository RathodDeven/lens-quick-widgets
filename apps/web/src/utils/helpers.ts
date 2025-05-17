/**
 * Shortens a string to a specified length, appending an ellipsis if truncated.
 *
 * @param str - The input string to shorten. If null or undefined, returns an empty string.
 * @param length - The desired maximum length of the shortened string. If not provided, returns the original string.
 * @returns The shortened string with an ellipsis if truncated, or the original string if shorter than or equal to the specified length.
 */
export const shortenString = (str?: string | null, length?: number) => {
  if (!str) {
    return ''
  }
  if (!length) {
    return str
  }
  if (str.length <= length) {
    return str
  }
  return `${str.slice(0, length - 3)}...`
}

/**
 * Pauses execution for a specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to wait before resolving the promise.
 * @returns A promise that resolves after the specified delay.
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const isValidURL = (text: string): boolean => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-zA-Z\\d_]*)?$',
    'i' // fragment locator
  )
  return !!urlPattern.test(text)
}

export const shortFormOfLink = (link?: string) => {
  if (!link) {
    return ''
  }
  return link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
}

export const randomNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Formats a number in a human-readable way by adding a 'k' for thousands or an 'm' for millions
 * @param num The number to format
 * @returns A string representation of the number with a 'k' or 'm' suffix
 */
export const humanReadableNumber = (num?: number) => {
  if (!num) {
    return '0'
  }
  if (num < 1000) {
    return num
  }
  if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return `${(num / 1000000).toFixed(1)}m`
}

/**
 * Formats a given date and time in a human-readable format string.
 *
 * @param date - The date and time to format. Can be a string (in ISO format) or a number (in milliseconds since the Unix Epoch).
 * @returns A string representing the given date and time in "Month Day, Year hh:mm:ss AM/PM" format.
 */
export const humanReadableDateTime = (date: string | number) => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date)
  const month = d.toLocaleString('default', { month: 'short' })
  const day = d.getDate()
  const year = d.getFullYear()
  const time = d.toLocaleString('default', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
  return `${month} ${day}, ${year} ${time}`
}

/**
 * Formats a number with commas as thousands separators.
 *
 * @param num - The number to format. If not provided or zero, returns '0'.
 * @returns A string representation of the number with commas as thousands separators.
 */
export const numberWithCommas = (num?: number) => {
  if (!num) {
    return '0'
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Converts a given time in milliseconds to a 12-hour format time string.
 *
 * @param time - The time in milliseconds since the Unix Epoch.
 * @returns A string representing the time in "hh:mm:ss AM/PM" format.
 */
export const simpleTime = (time: number) => {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  const minutes12 = minutes < 10 ? `0${minutes}` : minutes
  const seconds12 = seconds < 10 ? `0${seconds}` : seconds
  return `${hours12}:${minutes12}:${seconds12} ${ampm}`
}

/**
 * Calculates the remaining time from the current moment to a specified future time.
 *
 * @param futureTime - The future time in milliseconds since the Unix Epoch.
 * @returns A string representing the time remaining formatted as "xd xh xm xs",
 *          or null if the future time is in the past.
 */
export const timeToGo = (futureTime: number): string | null => {
  const now = new Date().getTime()
  const futureTimeDate = new Date(futureTime).getTime()

  const timeDifference = futureTimeDate - now

  if (timeDifference <= 0) {
    return null
  }

  const seconds = Math.floor((timeDifference / 1000) % 60)
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60)
  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24)
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

  const daysStr = days > 0 ? `${days}d ` : ''
  const hoursStr = hours > 0 ? `${hours}h ` : ''
  const minutesStr = minutes > 0 ? `${minutes}m ` : ''
  const secondsStr = seconds > 0 ? `${seconds}s` : ''

  return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`.trim()
}

/**
 * Converts a given date string into a human-readable format string
 * @param dateString - The date string to format
 * @returns A string representing the date in "dd Mmm yyyy" format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)

  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

/**
 * Returns a string representing the time since the given time in a relative format (e.g. "1 day ago", "2 hours ago", "3 minutes ago", "4 seconds ago", "just now")
 * @param time - The time to compare to the current time. Can be a number (in milliseconds) or a string (in ISO format). If not given, returns "just now"
 * @returns A string representing the time since the given time in a relative format
 */
export const timeAgo = (time?: number | string) => {
  if (!time) return 'just now'
  const now = new Date().getTime()

  if (typeof time === 'string') {
    time = new Date(time).getTime()
  }
  const diff = now - time
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }
  if (seconds > 0) {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`
  }
  return 'just now'
}

/**
 * Returns a string representing the time since the given time in a short, relative format (e.g. 1h, 2m, 3s, 4d).
 * If the given time is in the past, returns 'now'.
 * @param time - The time to compare to the current time. Can be a number (in milliseconds) or a string (in ISO format).
 * @returns A string representing the time since the given time in a short, relative format.
 */
export const timeAgoShort = (time: number | string) => {
  const now = new Date().getTime()

  if (typeof time === 'string') {
    time = new Date(time).getTime()
  }
  const diff = now - time
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d`
  }
  if (hours > 0) {
    return `${hours}h`
  }
  if (minutes > 0) {
    return `${minutes}m`
  }
  if (seconds > 0) {
    return `${seconds}s`
  }
  return 'now'
}

/**
 * Converts a given date string into a human-readable format.
 *
 * @param dataTime - The date and time to format as a string.
 * @returns A string representing the date in "Day Month Year hh:mm AM/PM" format.
 */
export const localDateAndTime = (dataTime: string) => {
  const date = new Date(dataTime)
  const year = date.getFullYear()
  const month = date.toLocaleString('default', { month: 'short' }) // Get short month name
  const day = date.getDate()
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return `${day} ${month} ${year} ${time}`
}

/**
 * Returns a string representing the given date in the format 'Month Day, Year'
 * @param dateTime - The date and time to format. Can be a string (in ISO format) or a number (in milliseconds).
 * @returns A string representing the given date in the format 'Month Day, Year'.
 */
export const localDate = (dateTime: string) => {
  const date = new Date(dateTime)
  const year = date.getFullYear()
  const month = date.toLocaleString('default', { month: 'short' }) // Get short month name
  const day = date.getDate()

  return `${month} ${day}, ${year}`
}

/**
 * Converts given seconds into a time string in the format 'HH:MM:SS' if hours > 0, 'MM:SS' if minutes > 0, or 'SS' if minutes = 0.
 * @param seconds - The number of seconds to convert to a time string. If not given, returns '00:00'.
 * @returns A string representing the given seconds in the format 'HH:MM:SS', 'MM:SS', or 'SS'.
 */
export const secondsToTime = (seconds?: number) => {
  if (!seconds) {
    return '00:00'
  }
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds - hours * 3600) / 60)
  const secondsLeft = Math.floor(seconds - hours * 3600 - minutes * 60)

  return `${hours ? `${hours}:` : ''}${
    minutes ? `${minutes < 10 ? `0${minutes}` : minutes}:` : '00:'
  }${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}`
}

/**
 * Returns a string representing the remaining time from the current moment to
 * the given time in a short format (e.g. 1d, 2h, 3m). If the given time is in the
 * past, returns null.
 *
 * @param endsAt - The time to compare to the current time. Can be a Date object or a
 *                 string (in ISO format). If not given, returns null.
 * @returns A string representing the remaining time from the current moment to the
 *          given time in a short format, or null if the given time is in the past.
 */
export const getRemainingTime = (
  endsAt: Date | null | string
): string | null => {
  if (!endsAt) {
    return null
  }

  if (typeof endsAt === 'string') {
    endsAt = new Date(endsAt)
  }

  const now = new Date()
  const diffInMilliseconds = endsAt.getTime() - now.getTime()

  if (diffInMilliseconds <= 0) {
    return null
  }

  const diffInMinutes = Math.round(diffInMilliseconds / 60000)
  const diffInHours = Math.round(diffInMinutes / 60)
  const diffInDays = Math.round(diffInHours / 24)

  if (diffInDays > 0) {
    return `${diffInDays}d`
  } else if (diffInHours > 0) {
    return `${diffInHours}h`
  } else {
    return `${diffInMinutes}m`
  }
}
