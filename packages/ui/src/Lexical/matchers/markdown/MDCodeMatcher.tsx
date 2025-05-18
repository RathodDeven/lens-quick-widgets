import type { ChildrenNode } from "interweave"
import { Matcher } from "interweave"

export class MDCodeMatcher extends Matcher {
  replaceWith(children: ChildrenNode) {
    return (
      <code
        style={{
          fontSize: "0.875rem",
          color: "var(--text-color, #333)",
          backgroundColor: "var(--hover-bg, #f5f5f5)",
          borderRadius: "0.5rem",
          padding: "2px 5px",
        }}
      >
        {children}
      </code>
    )
  }

  asTag(): string {
    return "code"
  }

  match(value: string) {
    return this.doMatch(
      value,
      /`(.*?)`/,
      (matches) => ({
        match: matches[1],
      }),
      true
    )
  }
}
