# Neon Drift Build Log

## Project Summary

Neon Drift is a dependency-free browser arcade survival game. The player pilots a luminous ship, avoids falling coral hazards, collects cyan energy shards, and tries to beat the saved high score.

The project is intentionally a static web app. It has no package manager, build tool, framework, server, external asset, or runtime dependency.

## Build Record

### 2026-08-27: Initial Game Build

- Initialized the project as a plain HTML, CSS, and JavaScript browser game.
- Created the semantic single-page game shell.
- Added the top information bar with the Neon Drift brand, live score, and best score.
- Added the framed canvas playfield and system status indicator.
- Added the start screen with the game title, objective, launch action, and control hint.
- Added the game-over screen with the final score, run message, and restart action.
- Added the footer mission label, energy meter, and touch movement controls.
- Added the responsive visual system with a dark ink base, neon cyan and lime accents, coral hazards, atmospheric gradients, grid lines, scanlines, borders, shadows, focus states, and motion.
- Added mobile layout rules and reduced-motion support.

### 2026-08-27: Gameplay Systems

- Added a canvas rendering loop driven by `requestAnimationFrame`.
- Added device-pixel-ratio-aware canvas resizing, capped at 2x for rendering quality and performance.
- Added player ship positioning, movement speed, steering tilt, and screen-boundary clamping.
- Added keyboard movement with Left Arrow, Right Arrow, A, and D.
- Added press-and-hold touch buttons for left and right movement.
- Added swipe steering across the game field.
- Added timed falling hazard spawning with increasing difficulty as the run continues.
- Added energy shard spawning, collection detection, and a visible energy counter and meter.
- Added score progression based on survival time and collected energy.
- Added collision detection between the ship and hazards.
- Added particle effects for ship movement, shard collection, and collisions.
- Added game reset, start, active-run, and game-over state transitions.
- Added persistent best-score storage through `localStorage` using the `neon-drift-best` key.
- Added score formatting with six-digit zero padding for the HUD.
- Added run-end messages that reflect the player’s result.
- Added energy spending: every 15 collected cyan shards automatically activates one power-up.
- Added three self-explanatory power-ups: BOOST increases movement speed, SHIELD absorbs one hazard hit, and MAGNET pulls nearby shards toward the ship.
- Added a visible power-up label and countdown; every effect lasts exactly five seconds.
- Added power-up reset behavior when a new run begins.
- Added a bottom `current / 15` energy tracker and plain-language explanation that cyan energy charges the next five-second ability.

### 2026-08-27: Narrative and UX Pass

- Clarified the opening objective: survive, dodge hazards, collect energy, and maximize score.
- Added a first-ten-seconds story sequence introducing the lost city signal, the last moving ship, and the approaching storm.
- Added timed narrative beats at the start of each run and hid the story panel after the opening sequence.
- Added live-region semantics for status, score, and story updates.
- Added accessible labels for the canvas, game frame, energy meter, and touch controls.
- Added visible keyboard focus styling and explicit button types.
- Added a clear opening objective legend for hazards and energy shards.

### 2026-08-27: Documentation and Verification

- Added `README.md` with the run command and complete control list.
- Verified that the page loads successfully in the integrated browser from the local file URL.
- Verified that the updated start screen appears in the browser after the objective and story changes.
- Confirmed that the project requires no install or build step.
- Checked publishing availability: no git remote or installed hosting/tunnel CLI is available in the workspace, so a public URL requires a GitHub repository or another hosting destination.

## File Inventory

### `index.html`

- Defines the document metadata and page title.
- Loads `styles.css`, `game.js`, and `story.js`.
- Provides the game shell, score HUD, canvas, start screen, story overlay, game-over screen, energy meter, and touch buttons.

### `styles.css`

- Defines the color variables and base typography.
- Styles the responsive desktop and mobile layouts.
- Provides the neon visual treatment, canvas frame, HUD, overlays, controls, meter, animations, focus states, and reduced-motion behavior.

### `game.js`

- Owns gameplay state and the animation loop.
- Handles rendering, spawning, movement, input, scoring, collisions, particles, HUD updates, persistence, and run transitions.

### `story.js`

- Defines the opening narrative moments.
- Synchronizes the story overlay with the active game timer.
- Resets and hides the story state between runs.

### `README.md`

- Documents the project purpose, local run instructions, and controls.

### `visuals.js`

- Adds varied hazard silhouettes and the energy-powered BOOST, SHIELD, and MAGNET effects.

### `BUILD_LOG.md`

- Records the implementation history, systems, file ownership, verification, and current publishing status.

## Run Instructions

1. Open `index.html` in any modern browser.
2. Select **Launch run**.
3. Use Left/Right Arrow or A/D on desktop.
4. On touch devices, use the on-screen left and right buttons or swipe across the game field.

No server, dependency installation, compilation, or asset download is required.

## Current Verification Status

- Local file load: verified.
- Start screen and objective presentation: verified.
- Story overlay integration: verified.
- Desktop controls: implemented; manual play verification is recommended after browser changes.
- Touch controls and swipe steering: implemented; device verification is recommended on a physical touch screen.
- Persistent best score: implemented through browser `localStorage`.
- Public deployment: not configured.

## Known Constraints

- The game is currently distributed as local static files.
- Best score is stored per browser/device and is not synchronized between players or browsers.
- There is no automated test suite or CI pipeline.
- A public playable URL still requires a hosting destination, such as GitHub Pages or another static host.
