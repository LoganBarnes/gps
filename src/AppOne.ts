import * as BABYLON from "babylonjs";
import { Camera } from "./Camera";
import { Constants } from "./Constants";
import { Gui } from "./Gui";
import { Receiver } from "./Receiver";
import { Satellite } from "./Satellite";

export class AppOne {
    private engine: BABYLON.Engine;
    private scene: BABYLON.Scene;

    private camera: Camera;
    private gui: Gui;

    private receiver: Receiver;
    private satellites: Satellite[] = [];

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas);
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        this.scene = createScene(this.engine, this.canvas);

        this.camera = new Camera(this.scene, this.canvas);
        this.gui = new Gui(this.camera, this.scene);

        this.receiver = new Receiver(this.scene);
        this.satellites.push(new Satellite(this.scene));
    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.scene.debugLayer.show({ overlay: true });
        } else {
            this.scene.debugLayer.hide();
        }
    }

    run() {
        this.debug(false);
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}

let prevCamRadius = 0.0;

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
    const cameraAlpha = Math.PI * 0.5;
    const cameraBeta = Math.PI * 0.5;

    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new BABYLON.Scene(engine);
    scene.useRightHandedSystem = true;
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // This creates a light, aiming 1,-1,-3
    new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(1, -1, -3), scene);

    // Our built-in 'sphere' shape.
    const earth = BABYLON.MeshBuilder.CreateSphere(
        "earth",
        { diameter: Constants.earthDiameterMm, segments: 32 },
        scene,
    );
    earth.rotate(BABYLON.Axis.Y, Math.PI * 0.75, BABYLON.Space.LOCAL);

    const earthMaterial = new BABYLON.StandardMaterial("earthMaterial", scene);
    earthMaterial.specularColor = BABYLON.Color3.Black();
    earthMaterial.diffuseTexture = new BABYLON.Texture("./earth.jpg", scene, {
        invertY: false,
    });
    earth.material = earthMaterial;

    return scene;
}
