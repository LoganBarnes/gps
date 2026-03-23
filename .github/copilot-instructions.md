# Copilot Instructions

## Commands

- Install dependencies with `npm install`.
- Start local development with `npm run dev`. This runs Vite and opens the app in a browser.
- Build for production with `npm run build`. This runs `tsc && vite build` and writes output to `dist/`.
- Preview the production build with `npm run preview`. This rebuilds, then serves the app with Vite preview on the network.
- Lint with `npm run lint`. This runs `eslint --fix src/`, so it mutates files under `src/`.
- If you only need a read-only lint check, use `npx eslint src/`.
- There is currently no automated test runner or test script configured in this repository, so there is no supported single-test command.

## Architecture

- This is a Vite + TypeScript + BabylonJS app, not a component-framework app. `index.html` owns the full-window `<canvas id="renderCanvas">` and loads `/src/main.ts`.
- `src/main.ts` is the browser entry point. On `DOMContentLoaded`, it finds the canvas, instantiates `AppOne` from `src/App.ts`, and calls `run()`.
- `src/App.ts` is the composition root for the interactive scene. It creates the Babylon `Engine` and `Scene`, registers resize handling, builds the Earth scene in `createScene()`, and wires together `Camera`, `Gui`, `Receiver`, and `Satellite`.
- `createScene()` in `src/App.ts` is where global scene setup lives: right-handed coordinate system, black clear color, directional light, Earth mesh, and the Earth texture from `public/small-earth.jpg`.
- `src/Camera.ts` wraps Babylon's `ArcRotateCamera`. It owns the 2D/3D mode behavior, enforces zoom bounds each frame, and exposes `getMouseRay()` for picking.
- `src/Gui.ts` builds a Babylon GUI fullscreen overlay. The top-left button toggles `camera.is2D` and updates its own label between `2D` and `3D`.
- `src/Receiver.ts` and `src/Satellite.ts` hold the domain positioning logic. Both convert latitude/longitude into Cartesian coordinates, and `Satellite` also draws the dashed line from the satellite to the receiver.
- `vite.config.js` is important for deployment behavior: it sets `base: "/gps/"` for GitHub Pages and aliases `babylonjs` to `babylonjs/babylon.max` in development mode for easier debugging.
- `server.js` is a separate Express static server for built assets in `dist/`; it is not part of the normal Vite development loop.

## Conventions

- Keep scene orchestration in `AppOne` and keep feature logic in small Babylon-focused classes like `Camera`, `Gui`, `Receiver`, and `Satellite`.
- Preserve the unit convention in `src/Constants.ts`: Earth/orbit dimensions and internal altitude are stored in `Mm`-named values, while the receiver API surface exposes altitude in kilometers and converts through `Constants.megaFromKilo()` and `Constants.kiloFromMega()`.
- If you change coordinate math, update `Receiver` and `Satellite` together. They use matching spherical-to-Cartesian formulas, and `Satellite`'s dashed line rendering depends on the receiver position staying in the same coordinate system.
- Asset paths are tied to the current Vite/public setup. Earth textures are loaded from the public root, and deployment assumes the `/gps/` base path.
- ESLint enforces sorted imports via `sort-imports`. Keep imports ordered instead of relying on later cleanup.
- `.editorconfig` uses 4-space indentation for `*.js` and `*.ts`, while other file types default to 2 spaces.
- `tsconfig.json` is strict and enables `noImplicitReturns`, but it does not fail on unused locals or parameters.
- The current production build succeeds but emits a large-chunk warning from Vite because BabylonJS bundles are large. Treat that as existing behavior unless you are intentionally changing bundling strategy.
