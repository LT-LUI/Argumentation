import type { Element, Root, ElementContent } from "hast"
import type { VFile } from "vfile"

// Boundary markers are independent so an evidence passage can cross an argument boundary.
export function argumentAnnotations() {
  return (tree: Root, file: VFile) => {
    if (!file.data.frontmatter?.cssclasses?.includes("annotated-transcript")) return
    const active = new Map<string, { kind: string; id?: string }>()
    const marker = /\{(\/?)(argument|evidence|definition|important)(?::([\w.-]+))?\}/gi
    const warn = (message: string) => console.warn(`[annotated-transcript] ${file.path}: ${message}`)

    function passage(value: string): ElementContent {
      const text = { type: "text" as const, value }
      if (!active.size) return text
      const labels = [...active.values()]
      return {
        type: "element",
        tagName: "span",
        properties: {
          "data-kinds": [...new Set(labels.map((label) => label.kind))].join(" "),
          "data-arguments": labels
            .filter((label) => label.kind === "argument" && label.id)
            .map((label) => label.id)
            .join(" "),
        },
        children: [text],
      }
    }

    function annotate(node: Element | Root) {
      const children = []
      for (const child of node.children) {
        if (child.type === "text") {
          let start = 0
          for (const match of child.value.matchAll(marker)) {
            if (match.index > start) children.push(passage(child.value.slice(start, match.index)))
            const [, close, type, id] = match
            const kind = type.toLowerCase()
            const key = kind + ":" + (id ?? "")
            if (close) {
              if (!active.delete(key)) warn("Unmatched closing marker " + match[0])
            } else {
              if (active.has(key)) warn("Repeated open marker " + match[0])
              active.set(key, { kind, id })
            }
            start = match.index + match[0].length
          }
          if (start < child.value.length) children.push(passage(child.value.slice(start)))
          continue
        }
        if (
          child.type === "element" &&
          !["code", "pre", "script", "style", "svg", "math", "comment", "note"].includes(
            child.tagName,
          ) &&
          !Object.hasOwn(child.properties, "dataCallout") &&
          !Object.hasOwn(child.properties, "data-callout")
        ) {
          annotate(child)
        }
        children.push(child)
      }
      node.children = children as typeof node.children
    }
    annotate(tree)
    if (active.size) warn("Unclosed markers: " + [...active.keys()].join(", "))
  }
}
