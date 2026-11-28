// The Markdown remains the source of truth. Each visit starts in transcript-only mode.
(() => {
  if (window.argumentReaderInstalled) return
  window.argumentReaderInstalled = true
  const categories = {
    argument: "Arguments", evidence: "Evidence", definition: "Definitions", important: "Important",
  }

  function setup() {
    const article = document.querySelector(".center article.annotated-transcript")
    if (!article || article.querySelector(".ar-controls")) return
    const parts = [...article.querySelectorAll("[data-kinds]")]
    const notes = [...article.querySelectorAll("comment, note")]
    const cards = [...article.querySelectorAll(".callout")].filter(card => !card.parentElement.closest(".callout"))
    const controls = document.createElement("details")
    controls.className = "ar-controls"
    const summary = document.createElement("summary")
    summary.textContent = "Show annotations"
    controls.append(summary)
    article.prepend(controls)

    const panel = document.createElement("aside")
    panel.className = "ar-panel"
    panel.setAttribute("aria-label", "Contributor’s analysis")
    panel.hidden = true
    const desktop = window.matchMedia("(min-width: 1200px)")
    function placePanel() {
      const right = document.querySelector("#quartz-body .sidebar.right")
      if (desktop.matches && right) right.prepend(panel)
      else article.after(panel)
    }
    placePanel()
    // Listen only for the lifetime of this page under Quartz SPA navigation.
    const onResize = () => {
      if (article.isConnected) placePanel()
      else desktop.removeEventListener("change", onResize)
    }
    desktop.addEventListener("change", onResize)
    window.addCleanup?.(() => desktop.removeEventListener("change", onResize))

    const argumentsById = new Map()
    const others = []
    const ids = part => (part.dataset.arguments || "").split(" ").filter(Boolean)
    for (const part of parts) {
      for (const id of ids(part)) argumentsById.set(id, [])
    }
    for (const card of cards) {
      const [, id, framework] = (card.dataset.calloutMetadata || "").match(/^([\w.-]+):([\w.-]+)$/) || []
      const entry = document.createElement("details")
      const title = document.createElement("summary")
      title.textContent = card.querySelector(".callout-title-inner")?.textContent.trim() || card.dataset.callout
      entry.append(title)
      // Move the rendered Markdown, including tables, links and nested callouts.
      for (const child of [...card.childNodes]) {
        if (!child.classList?.contains("callout-title")) entry.append(child)
      }
      card.remove()
      if (card.dataset.callout === "argument" && id) {
        if (!argumentsById.has(id)) argumentsById.set(id, [])
        argumentsById.get(id).push({ entry, framework })
      } else others.push(entry)
    }
    const filters = new Map()
    function checkbox(key, name) {
      const label = document.createElement("label")
      const field = document.createElement("input")
      field.type = "checkbox"
      label.append(field, document.createTextNode(" " + name))
      controls.append(label)
      filters.set(key, field)
      field.addEventListener("change", update)
    }
    for (const [key, title] of Object.entries(categories)) {
      if (parts.some(part => part.dataset.kinds.split(" ").includes(key)) ||
        (key === "argument" && argumentsById.size)) checkbox(key, title)
    }
    if (notes.length) checkbox("comments", "Notes and comments")
    if (others.length) checkbox("callouts", "Other callouts")
    const chooser = document.createElement("select")
    chooser.setAttribute("aria-label", "Select an argument")
    chooser.add(new Option("Select an argument", ""))
    for (const id of argumentsById.keys()) chooser.add(new Option(id, id))
    controls.append(chooser)
    chooser.addEventListener("change", () => selectArgument(chooser.value))

    for (const note of notes) {
      const marker = document.createElement("button")
      marker.type = "button"
      marker.className = "ar-note"
      marker.textContent = note.localName === "note" ? "Note" : "Comment"
      marker.setAttribute("aria-expanded", "false")
      note.before(marker)
      marker.addEventListener("click", () => {
        marker.setAttribute("aria-expanded", String(note.classList.toggle("ar-open")))
      })
    }
    for (const part of parts.filter(part => ids(part).length)) {
      const activate = () => {
        if (enabled("argument")) selectArgument(ids(part)[0])
      }
      part.addEventListener("click", activate)
      part.addEventListener("keydown", event => {
        if (event.target === part && ["Enter", " "].includes(event.key)) {
          event.preventDefault()
          activate()
        }
      })
    }
    function enabled(key) { return controls.open && filters.get(key)?.checked }
    function selectArgument(id) {
      chooser.value = id
      update()
      if (!desktop.matches && !panel.hidden) panel.scrollIntoView({ block: "start" })
    }
    function update() {
      for (const key of filters.keys()) article.classList.toggle("ar-" + key, !!enabled(key))
      chooser.hidden = !enabled("argument")
      if (chooser.hidden) chooser.value = ""
      for (const part of parts) {
        const argumentIds = ids(part)
        part.classList.toggle("ar-selected", !!chooser.value && argumentIds.includes(chooser.value))
        if (enabled("argument") && argumentIds.length) {
          part.tabIndex = 0
          part.setAttribute("role", "button")
          part.title = argumentIds.join(", ")
        } else {
          part.removeAttribute("role")
          part.removeAttribute("tabindex")
          part.removeAttribute("title")
        }
      }
      if (!enabled("comments")) {
        for (const note of notes) {
          note.classList.remove("ar-open")
          note.previousElementSibling.setAttribute("aria-expanded", "false")
        }
      }
      const cards = argumentsById.get(chooser.value) || []
      const entries = cards.map(card => card.entry)
      if (enabled("callouts")) entries.push(...others)
      if (panel.dataset.argument !== chooser.value) {
        const first = cards.find(card => card.framework.toLowerCase() === "standard_form") || cards[0]
        for (const card of cards) card.entry.open = card === first
        panel.dataset.argument = chooser.value
      }
      panel.replaceChildren(...entries)
      panel.hidden = !entries.length
    }
    controls.addEventListener("toggle", update)
    update()
  }
  document.addEventListener("nav", setup)
  document.addEventListener("render", setup)
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup)
  else setup()
})()
