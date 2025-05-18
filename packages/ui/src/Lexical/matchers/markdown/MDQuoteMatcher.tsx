import type { ChildrenNode } from "interweave"
import { Matcher } from "interweave"

export class MDQuoteMatcher extends Matcher {
  replaceWith(children: ChildrenNode) {
    return (
      <span
        style={{
          paddingTop: "0.375rem",
          paddingBottom: "0.375rem",
          paddingLeft: "0.5rem",
          color: "#4b5563",
          borderLeftWidth: "4px",
          borderLeftStyle: "solid",
          borderLeftColor: "#e5e7eb",
        }}
      >
        {children}
      </span>
    )
  }

  asTag(): string {
    return "span"
  }

  match(value: string) {
    return this.doMatch(value, /^> (.*$)/, (matches) => ({
      match: matches[1],
    }))
  }
}
