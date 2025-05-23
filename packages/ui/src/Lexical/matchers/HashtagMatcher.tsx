import { Matcher } from "interweave"
// import Link from 'next/link'
import { createElement } from "react"

export const Hashtag = ({ ...props }: any) => {
  // todo make own hastag page
  return (
    <span
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      style={{
        display: "inline-flex",
        color: "#60a5fa",
        alignItems: "center",
        gap: "0.25rem",
      }}
    >
      <a
        href={`https://hey.xyz/search?q=${props.display.slice(1)}&type=POSTS`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.display}
      </a>
    </span>
  )
}

export class HashtagMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return createElement(Hashtag, props, match)
  }

  asTag(): string {
    return "a"
  }

  match(value: string) {
    return this.doMatch(value, /\B(#\w*[A-Za-z]+\w*\b)(?!;)/, (matches) => {
      return {
        display: matches[0],
      }
    })
  }
}
