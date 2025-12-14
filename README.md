Cube Timer

Refactored small Rubik's Cube timer demo.

Files

- index.html — main page
- style.css — styling
- script.js — loader that imports `src/app.js`
- src/app.js — modular app logic (Timer class, UI)

How to run
Open `index.html` in a browser that supports ES modules (Chrome/Firefox/Edge). No build step required.

Notes

- Key controls: Hold Space to arm (red → green at 0.55s), release to start timer, press Space again to stop and record.
- This refactor keeps times in centiseconds and preserves Ao5 calculation logic.
