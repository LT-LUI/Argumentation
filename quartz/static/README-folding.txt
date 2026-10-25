Quartz 5 Obsidian-like Folding Extension
======================================

1. Copy folding.js to your local Quartz project at quartz/static/folding.js

2. APPEND the entire contents of folding.scss to quartz/styles/custom.scss
   (Do not replace existing custom.scss contents.)

3. Open quartz/components/Head.tsx and find:

   <meta charSet="utf-8" />

   Directly below it add:

   <script defer src={joinSegments(baseDir, "static/folding.js")} />

   Head.tsx already imports joinSegments and declares baseDir in Quartz 5.

4. In the project root run:

   npx quartz build --serve

   Open http://localhost:8080 and test a page with headings and nested lists.

5. If everything works, publish using:

   npx quartz sync

Notes:
- Source Markdown is unchanged.
- This is an optional, custom client-side enhancement, not an official Quartz plugin.
- Heading folding applies to headings that are direct children of the article; this covers ordinary Markdown notes.
- It does not preserve folding state on page reload, and does not automatically expand collapsed sections for deep-linked anchors.
- As with any DOM modification, test your custom layout, callouts, search results, and navigation after making the change.
