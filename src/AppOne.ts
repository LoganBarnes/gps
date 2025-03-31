import * as BABYLON from "babylonjs";
import { Constants } from "./Constants";
import { Receiver } from "./Receiver";
import { Satellite } from "./Satellite";

export class AppOne {
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;
    receiver: Receiver;
    satellites: Satellite[] = [];

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas);
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        this.scene = createScene(this.engine, this.canvas);
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

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
    const cameraAlpha = Math.PI * 0.5;
    const cameraBeta = Math.PI * 0.5;

    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new BABYLON.Scene(engine);
    scene.useRightHandedSystem = true;
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // This creates and positions a free camera (non-mesh)
    const camera = new BABYLON.ArcRotateCamera(
        "Camera",
        cameraAlpha,
        cameraBeta,
        100.0,
        new BABYLON.Vector3(0, 0, 0),
        scene,
    );

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

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

    scene.registerBeforeRender(() => {
        camera.alpha = cameraAlpha;
        camera.beta = cameraBeta;
    });

    return scene;
}
