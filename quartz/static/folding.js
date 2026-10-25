/* Obsidian-style folding for Quartz 5: headings, nested lists, expand/collapse all.
 * v2: detect headings inside nested Quartz content containers too.
 */
(() => {
  const isHeading = (element) => /^H[1-6]$/.test(element.tagName);

  function setupFolding() {
    const article = document.querySelector('.center article') || document.querySelector('article.popover-hint');
    if (!article || article.querySelector(':scope > .fold-controls')) return;

    const setters = [];

    function addToggle(container, host, label, type) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `fold-toggle fold-${type}-toggle`;

      function setExpanded(expanded) {
        container.classList.toggle('fold-collapsed', !expanded);
        button.textContent = expanded ? '▾' : '▸';
        button.setAttribute('aria-expanded', String(expanded));
        button.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} ${label}`);
      }

      setExpanded(true);
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setExpanded(button.getAttribute('aria-expanded') !== 'true');
      });
      host.prepend(button);
      setters.push(setExpanded);
    }

    function groupHeadingChildren(parent) {
      const originalNodes = [...parent.children];
      if (!originalNodes.some(isHeading)) return;

      const output = document.createDocumentFragment();
      const stack = [];
      for (const element of originalNodes) {
        if (isHeading(element)) {
          const level = Number(element.tagName.slice(1));
          while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
          const section = document.createElement('section');
          section.className = 'fold-section';
          const body = document.createElement('div');
          body.className = 'fold-body';
          section.append(element, body);
          (stack.length ? stack[stack.length - 1].body : output).append(section);
          addToggle(section, element, element.textContent.trim() || 'section', 'heading');
          stack.push({ level, body });
        } else {
          (stack.length ? stack[stack.length - 1].body : output).append(element);
        }
      }
      parent.append(output);
    }

    // Most Quartz 5 themes nest the Markdown content within a wrapper inside
    // <article>. Process the deepest containers first, then their ancestors.
    // Only containers with a *direct* heading child get wrapped.
    const containers = [article, ...article.querySelectorAll('*')]
      .filter((element) => [...element.children].some(isHeading))
      .reverse();
    containers.forEach(groupHeadingChildren);

    // A list item is foldable only when it contains a direct nested list.
    for (const item of article.querySelectorAll('li')) {
      if (![...item.children].some((node) => node.matches('ul, ol'))) continue;
      item.classList.add('fold-list-item');
      const label = item.textContent.trim().slice(0, 80) || 'list item';
      addToggle(item, item, label, 'list');
    }

    const controls = document.createElement('div');
    controls.className = 'fold-controls';
    for (const [name, expanded] of [['Expand all', true], ['Collapse all', false]]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = name;
      button.addEventListener('click', () => setters.forEach((setter) => setter(expanded)));
      controls.append(button);
    }
    article.prepend(controls);
  }

  // Quartz can navigate between pages without a full browser reload.
  document.addEventListener('nav', setupFolding);
  document.addEventListener('render', setupFolding);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFolding);
  } else {
    setupFolding();
  }
})();
