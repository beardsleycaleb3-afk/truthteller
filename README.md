# truthteller

Truth telling app — created by Caleb Beardsley.

## Module order

js/element.js -> js/token.js -> js/function.js -> js/display.js -> js/parser.js -> js/engine.js -> js/app.js

Each module only depends on modules earlier in the chain. `app.js` is the
single entry point and is the only file `index.html` loads.

## Root files

- index.html
- manifest.json
- sw.js
- icon.png
- README.md
- LICENSE

## Notes

- Touch only.
- Monospace only.
- Browser ES modules — no build step, no bundler.
- No external dependencies (no CDN frameworks).
- Fixed 350x550 viewport.
- 300x200 framed CRT-monitor screen as the primary UI surface; the geometric
  glyph inside it animates on its own and can be dragged with one finger.
