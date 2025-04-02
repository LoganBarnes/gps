import { AppOne as App } from "./App";

console.log(`main.ts starting ${App.name}`);
window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    const app = new App(canvas);
    app.run();
});
