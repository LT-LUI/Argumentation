Quartz 5 folding extension - version 2
======================================

Your console showed headingToggles: 0, listToggles: 41, sections: 0.
Version 2 finds headings inside the nested content containers of the article.

1. In your LOCAL Quartz project, REPLACE:
      quartz/static/folding.js
   with the folding.js supplied in this ZIP.

2. Leave your existing additions in quartz/styles/custom.scss
   and quartz/components/Head.tsx UNCHANGED.

3. Stop the local Quartz server (Ctrl+C), then restart:
      npx quartz build --serve

4. Refresh your article at http://localhost:8080 with Ctrl+Shift+R.

5. In browser console, verify:
      ({headings: document.querySelectorAll('.center article .fold-heading-toggle').length,
        sections: document.querySelectorAll('.center article .fold-section').length,
        lists: document.querySelectorAll('.center article .fold-list-toggle').length})
   headings and sections should be nonzero for an article with headings.

6. Test heading arrows and nested-list arrows, Expand all / Collapse all.
   Then publish with:
      npx quartz sync

This is a custom extension, not an official Quartz plugin. If headings
remain zero, inspect the parent HTML structure of one heading to determine
whether the Markdown renderer places each heading in a separate wrapper.
