import type { ChildrenNode } from "interweave"
import { Matcher } from "interweave"

const createHyperlink = (
  href: string | undefined,
  title: string | undefined
) => {
  const keyId = href
  return (
    <a
      key={keyId}
      style={{ color: "#3b82f6" }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {title}
    </a>
  )
}

export class MDLinkMatcher extends Matcher {
  replaceWith(children: ChildrenNode, props: any) {
    return createHyperlink(props.href, props.title)
  }

  asTag(): string {
    return "a"
  }

  match(value: string) {
    return this.doMatch(value, /\[(.*?)\]\((.*?)\)/, (matches) => ({
      href: matches[2],
      title: matches[1],
    }))
  }
}
