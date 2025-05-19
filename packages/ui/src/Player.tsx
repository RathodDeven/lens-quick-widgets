import React, { memo } from "react"
import {
  EnterFullscreenIcon,
  ExitFullscreenIcon,
  LoadingIcon,
  MuteIcon,
  PauseIcon,
  PictureInPictureIcon,
  PlayIcon,
  UnmuteIcon,
} from "@livepeer/react/assets"
import * as Player from "@livepeer/react/player"
import { FaBan } from "react-icons/fa"

/**
 * A simplified video player component based on Livepeer's Player
 *
 * This component renders a video/livestream player with custom controls and error states.
 * It supports various features like play/pause, volume control, seek functionality,
 * fullscreen toggle, and picture-in-picture mode.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string|null} props.src - The video source URL or stream ID
 * @param {string|null} [props.poster] - URL for the poster/thumbnail image shown before playback
 * @param {string} [props.title] - Title of the video (used for accessibility)
 * @param {boolean} [props.autoPlay=false] - Whether the video should start playing automatically
 * @param {boolean} [props.muted=false] - Whether the video should be muted initially
 * @param {boolean} [props.loop=false] - Whether the video should loop after completion
 * @param {React.ReactNode} [props.streamOfflineErrorComponent=null] - Custom component to show when stream is offline
 * @param {number} [props.autoHide=0] - Time in milliseconds before controls auto-hide (0 disables auto-hide)
 * @param {boolean} [props.showPipButton=true] - Whether to show the picture-in-picture button
 * @returns {JSX.Element} The rendered video player component
 */
const PlayerComponent = ({
  src,
  poster,
  title,
  autoPlay = false,
  muted = false,
  loop = false,
  streamOfflineErrorComponent = null,
  autoHide = 0,
  showPipButton = true,
}: {
  title?: string
  src: string | null
  poster?: string | null | undefined
  muted?: boolean
  autoPlay?: boolean
  loop?: boolean
  autoHide?: number
  streamOfflineErrorComponent?: React.ReactNode
  showPipButton?: boolean
}) => {
  const [hidden, setHidden] = React.useState(false)
  const timerRef = React.useRef(null)

  React.useEffect(() => {
    if (!autoHide) return

    const resetTimer = () => {
      setHidden(false)
      // @ts-ignore
      clearTimeout(timerRef.current)
      // @ts-ignore
      timerRef.current = setTimeout(() => setHidden(true), autoHide)
    }

    window.addEventListener("mousemove", resetTimer)
    window.addEventListener("mousedown", resetTimer)

    resetTimer() // Initialize the timer

    return () => {
      // Clean up when the component is unmounted
      // @ts-ignore
      clearTimeout(timerRef.current)
      window.removeEventListener("mousemove", resetTimer)
      window.removeEventListener("mousedown", resetTimer)
    }
  }, [])

  if (!src) {
    return (
      <PlayerLoading
        title="Invalid source"
        description="We could not fetch valid playback information for the playback ID you provided. Please check and try again."
      />
    )
  }

  const containerStyles = {
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#000",
    outline: "none",
    transition: "all 0.3s ease",
    color: "#fff",
  }

  const videoStyles = {
    height: "100%",
    width: "100%",
    transition: "all 0.3s ease",
  }

  const loadingIndicatorStyles = {
    width: "100%",
    position: "relative" as const,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
  }

  const loadingIconContainerStyles = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  }

  const errorIndicatorStyles = {
    position: "absolute" as const,
    inset: 0,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    textAlign: "center" as const,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(16px)",
    duration: "1000ms",
  }

  const offlineErrorStyles = {
    ...errorIndicatorStyles,
    animation: "fadeIn 0.3s",
  }

  const controlsStyles = {
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0.6) 100%)",
    gap: "4px",
    padding: "8px 12px",
    flexDirection: "column-reverse" as const,
    display: "flex",
    duration: "1000ms",
  }

  const controlRowStyles = {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
  }

  const controlLeftGroupStyles = {
    display: "flex",
    flex: 1,
    alignItems: "center",
    gap: "12px",
  }

  const controlRightGroupStyles = {
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
  }

  const buttonStyles = {
    backgroundColor: "transparent",
    padding: 0,
    border: "none",
    cursor: "pointer",
  }

  const playButtonStyles = {
    ...buttonStyles,
    color: "#fff",
  }

  const timeDisplayStyles = {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    fontSize: "0.875rem",
    fontVariantNumeric: "tabular-nums",
    userSelect: "none" as const,
  }

  const muteButtonStyles = {
    ...buttonStyles,
    color: "#fff",
  }

  const volumeContainerStyles = {
    position: "relative" as const,
    marginRight: "4px",
    flex: 1,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none" as const,
    touchAction: "none" as const,
    maxWidth: "120px",
    height: "20px",
  }

  const volumeTrackStyles = {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    position: "relative" as const,
    flexGrow: 1,
    borderRadius: "9999px",
    transition: "all 0.3s",
    height: "3px", // Increased from 2px to 3px for better visibility
  }

  const volumeRangeStyles = {
    position: "absolute" as const,
    backgroundColor: "#fff",
    borderRadius: "9999px",
    height: "100%",
  }

  const volumeThumbStyles = {
    display: "block",
    transition: "all 0.3s",
    width: "10px", // Increased from 8px to 10px
    height: "10px", // Increased from 8px to 10px
    backgroundColor: "#fff",
    borderRadius: "9999px",
  }

  const seekContainerStyles = {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none" as const,
    touchAction: "none" as const,
    width: "100%",
    height: "20px",
  }

  const seekTrackStyles = {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    position: "relative" as const,
    flexGrow: 1,
    borderRadius: "9999px",
    transition: "all 0.3s",
    height: "2px",
  }

  const seekBufferStyles = {
    position: "absolute" as const,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    transition: "all 1s",
    borderRadius: "9999px",
    height: "100%",
  }

  const seekRangeStyles = {
    position: "absolute" as const,
    backgroundColor: "#fff",
    borderRadius: "9999px",
    height: "100%",
  }

  const seekThumbStyles = {
    display: "block",
    scale: 1, // Changed from 0 to 1 to make it visible by default
    width: "12px",
    height: "12px",
    backgroundColor: "#fff",
    duration: "150ms",
    transition: "all 0.15s",
    borderRadius: "9999px",
  }

  const errorMessageContainerStyles = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "20px",
  }

  const errorTitleContainerStyles = {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  }

  const errorTitleStyles = {
    fontSize: "1.125rem",
    lineHeight: "1.75rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  }

  const errorDescriptionStyles = {
    fontSize: "0.75rem",
    lineHeight: "1rem",
    color: "#f1f1f1",
  }

  return (
    <Player.Root
      // @ts-ignore
      src={src}
      autoPlay={autoPlay}
      key={src.toString()}
    >
      <Player.Container style={containerStyles}>
        <Player.Video
          autoFocus
          loop={loop}
          title={title}
          style={videoStyles}
          poster={poster}
          muted={muted}
        />

        <Player.LoadingIndicator style={loadingIndicatorStyles}>
          <div style={loadingIconContainerStyles}>
            <LoadingIcon
              style={{
                width: "32px",
                height: "32px",
                animation: "spin 1s linear infinite",
                color: "#7a7a81",
              }}
            />
          </div>
          <PlayerLoading />
          <Player.Poster
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Player.LoadingIndicator>

        <Player.ErrorIndicator matcher="all" style={errorIndicatorStyles}>
          <div style={loadingIconContainerStyles}>
            <LoadingIcon
              style={{
                width: "32px",
                height: "32px",
                animation: "spin 1s linear infinite",
                color: "#7a7a81",
              }}
            />
          </div>
          <PlayerLoading />
        </Player.ErrorIndicator>

        <Player.ErrorIndicator matcher="offline" style={offlineErrorStyles}>
          {streamOfflineErrorComponent ? (
            streamOfflineErrorComponent
          ) : (
            <>
              <div style={errorMessageContainerStyles}>
                <div style={errorTitleContainerStyles}>
                  <div style={errorTitleStyles}>
                    <FaBan size={24} />
                    Stream is offline
                  </div>
                  <div style={errorDescriptionStyles}>
                    Playback will start automatically once the stream has
                    started
                  </div>
                </div>
                <LoadingIcon
                  style={{
                    width: "32px",
                    height: "32px",
                    margin: "0 auto",
                    animation: "spin 1s linear infinite",
                    color: "#7a7a81",
                  }}
                />
              </div>
            </>
          )}
        </Player.ErrorIndicator>

        <Player.ErrorIndicator
          matcher="access-control"
          style={errorIndicatorStyles}
        >
          <div style={errorMessageContainerStyles}>
            <div style={errorTitleContainerStyles}>
              <div style={errorTitleStyles}>Stream is private</div>
              <div style={errorDescriptionStyles}>
                It looks like you don't have permission to view this content
              </div>
            </div>
            <LoadingIcon
              style={{
                width: "32px",
                height: "32px",
                margin: "0 auto",
                animation: "spin 1s linear infinite",
                color: "#7a7a81",
              }}
            />
          </div>
        </Player.ErrorIndicator>

        {!hidden && (
          <Player.Controls autoHide={0} style={controlsStyles}>
            <div style={controlRowStyles}>
              <div style={controlLeftGroupStyles}>
                <Player.PlayPauseTrigger style={playButtonStyles}>
                  <Player.PlayingIndicator asChild matcher={false}>
                    <PlayIcon
                      style={{ color: "white", width: "24px", height: "24px" }}
                    />
                  </Player.PlayingIndicator>
                  <Player.PlayingIndicator asChild>
                    <PauseIcon
                      style={{ width: "24px", height: "24px", color: "white" }}
                    />
                  </Player.PlayingIndicator>
                </Player.PlayPauseTrigger>

                <Player.LiveIndicator matcher={false} style={timeDisplayStyles}>
                  <Player.Time
                    style={{
                      fontSize: "14px",
                      fontVariantNumeric: "tabular-nums",
                      userSelect: "none",
                    }}
                  />
                </Player.LiveIndicator>

                <Player.MuteTrigger style={muteButtonStyles}>
                  <Player.VolumeIndicator asChild matcher={false}>
                    <MuteIcon
                      style={{ color: "white", width: "20px", height: "20px" }}
                    />
                  </Player.VolumeIndicator>
                  <Player.VolumeIndicator asChild matcher={true}>
                    <UnmuteIcon
                      style={{ color: "white", width: "20px", height: "20px" }}
                    />
                  </Player.VolumeIndicator>
                </Player.MuteTrigger>
                <Player.Volume style={volumeContainerStyles}>
                  <Player.Track style={volumeTrackStyles}>
                    <Player.Range style={volumeRangeStyles} />
                  </Player.Track>
                  <Player.Thumb style={volumeThumbStyles} />
                </Player.Volume>
              </div>
              <div style={controlRightGroupStyles}>
                {showPipButton && (
                  <Player.PictureInPictureTrigger style={buttonStyles}>
                    <PictureInPictureIcon
                      style={{ color: "white", width: "20px", height: "20px" }}
                    />
                  </Player.PictureInPictureTrigger>
                )}

                <Player.FullscreenTrigger style={buttonStyles}>
                  <Player.FullscreenIndicator asChild>
                    <ExitFullscreenIcon
                      style={{ color: "white", width: "20px", height: "20px" }}
                    />
                  </Player.FullscreenIndicator>

                  <Player.FullscreenIndicator matcher={false} asChild>
                    <EnterFullscreenIcon
                      style={{ color: "white", width: "20px", height: "20px" }}
                    />
                  </Player.FullscreenIndicator>
                </Player.FullscreenTrigger>
              </div>
            </div>
            <Player.Seek style={seekContainerStyles}>
              <Player.Track style={seekTrackStyles}>
                <Player.SeekBuffer style={seekBufferStyles} />
                <Player.Range style={seekRangeStyles} />
              </Player.Track>
              <Player.Thumb style={seekThumbStyles} />
            </Player.Seek>
          </Player.Controls>
        )}
      </Player.Container>
    </Player.Root>
  )
}

const PlayerLoading = ({
  title,
  description,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
}) => {
  const containerStyles = {
    position: "relative" as const,
    width: "100%",
    padding: "8px 12px",
    gap: "12px",
    display: "flex",
    flexDirection: "column-reverse" as const,
    aspectRatio: "16/9",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    borderRadius: "4px",
  }

  const rowStyles = {
    display: "flex",
    justifyContent: "space-between",
  }

  const buttonGroupStyles = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }

  const pulseBoxStyles = {
    width: "24px",
    height: "24px",
    animation: "pulse 2s infinite",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    borderRadius: "8px",
  }

  const pulseBoxLongStyles = {
    width: "80px",
    height: "28px",
    animation: "pulse 2s infinite",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    borderRadius: "8px",
  }

  const progressBarStyles = {
    width: "100%",
    height: "8px",
    animation: "pulse 2s infinite",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    borderRadius: "8px",
  }

  const messageContainerStyles = {
    position: "absolute" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
    inset: "40px",
    textAlign: "center" as const,
    justifyContent: "center",
    alignItems: "center",
  }

  const titleStyles = {
    color: "white",
    fontSize: "1.125rem",
    fontWeight: 500,
  }

  const descriptionStyles = {
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.8)",
  }

  return (
    <div style={containerStyles}>
      <div style={rowStyles}>
        <div style={buttonGroupStyles}>
          <div style={pulseBoxStyles}></div>
          <div style={pulseBoxLongStyles}></div>
        </div>

        <div style={buttonGroupStyles}>
          <div style={pulseBoxStyles}></div>
          <div style={pulseBoxStyles}></div>
        </div>
      </div>
      <div style={progressBarStyles}></div>

      {title && (
        <div style={messageContainerStyles}>
          <span style={titleStyles}>{title}</span>
          {description && <span style={descriptionStyles}>{description}</span>}
        </div>
      )}
    </div>
  )
}

// Animation styles
const styles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.3; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
`

// Add animation styles to document
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style")
  styleElement.innerHTML = styles
  document.head.appendChild(styleElement)
}

// Export the player component
export const VideoPlayer = memo(PlayerComponent)
