// Reader pages use one source callout followed by one or more view callouts.
(() => {
  function selector(labelText, options) {
    const label = document.createElement("label");
    label.append(labelText + " ");
    const select = document.createElement("select");
    select.setAttribute("aria-label", labelText);
    for (const [value, name] of options) select.add(new Option(name, value));
    label.append(select);
    return { label, select };
  }

  function setup() {
    const article = document.querySelector(".center article");
    const source = article?.querySelector('[data-callout="reader-source"]');
    if (!source || source.closest(".argument-reader")) return;

    const views = [];
    let next = source.nextElementSibling;
    while (next?.matches('[data-callout="reader-view"]')) {
      views.push(next);
      next = next.nextElementSibling;
    }
    if (!views.length) return;

    const passages = [...source.querySelectorAll("[id][data-layers]")];
    const layers = passage => passage.dataset.layers.trim().split(/\s+/).filter(Boolean);
    const names = [...new Set(passages.flatMap(layers))];
    const titles = views.map(view => view.querySelector(".callout-title-inner")?.textContent.trim()
      || view.querySelector(".callout-title")?.textContent.trim() || "Analysis");
    const framework = selector("View", titles.map((title, i) => [String(i), title]));
    const layer = selector("Highlight", [["", "No layer"], ...names.map(name => [name, name])]);
    const wrapper = document.createElement("section");
    wrapper.className = "argument-reader";
    wrapper.setAttribute("aria-label", "Interactive argument reader");
    const analysis = document.createElement("div");
    const transcript = document.createElement("div");
    source.before(wrapper);
    wrapper.append(transcript, analysis);
    transcript.append(layer.label, source);
    analysis.append(framework.label, ...views);

    const links = views.map(view => [...view.querySelectorAll("a[href]")].filter(link =>
      passages.some(passage => link.hash === "#" + passage.id)));
    const targetsByRow = new Map();
    for (const link of links.flat()) {
      const row = link.closest("li, p") || link;
      if (!targetsByRow.has(row)) targetsByRow.set(row, new Set());
      targetsByRow.get(row).add(link.hash.slice(1));
    }
    let selected = null;

    function refresh() {
      views.forEach((view, i) => { view.hidden = i !== framework.select.selectedIndex; });
      wrapper.dataset.layer = layer.select.value;
      passages.forEach(passage => {
        passage.classList.toggle("reader-layer", layers(passage).includes(layer.select.value));
        passage.setAttribute("aria-pressed", String(passage === selected));
      });
      for (const [element, targets] of targetsByRow) {
        element.classList.toggle("reader-match", !!selected && targets.has(selected.id));
      }
    }

    const currentView = () => views[framework.select.selectedIndex];
    const reveal = element => {
      element.tabIndex = -1;
      element.focus({ preventScroll: true });
      element.scrollIntoView({ block: "nearest" });
    };
    function inspect(passage) {
      selected = passage;
      const matches = links.map(group => group.some(link => link.hash === "#" + passage.id));
      if (!matches[framework.select.selectedIndex] && matches.includes(true))
        framework.select.selectedIndex = matches.indexOf(true);
      refresh();
      const row = currentView().querySelector(".reader-match");
      if (row) reveal(row);
    }
    for (const passage of passages) {
      passage.setAttribute("role", "button");
      passage.tabIndex = 0;
      passage.addEventListener("click", () => inspect(passage));
      passage.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        inspect(passage);
      });
    }
    links.flat().forEach(link => link.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      event.stopPropagation();
      selected = passages.find(passage => link.hash === "#" + passage.id);
      refresh();
      selected.focus();
    }));
    layer.select.addEventListener("change", refresh);
    framework.select.addEventListener("change", refresh);
    refresh();
  }

  document.addEventListener("nav", setup);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
  else setup();
})();
