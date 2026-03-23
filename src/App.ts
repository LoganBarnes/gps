import {
    AbstractMesh,
    Axis,
    Color3,
    Color4,
    DirectionalLight,
    Engine,
    MeshBuilder,
    Scene,
    Space,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core";
import { Camera } from "./Camera";
import { Constants } from "./Constants";
import { Gui } from "./Gui";
import { Receiver } from "./Receiver";
import { Satellite } from "./Satellite";

export class AppOne {
    private static readonly initialSatellitePositions = [
        { latitudeDeg: 0.0, longitudeDeg: 0.0 },
        { latitudeDeg: 35.0, longitudeDeg: 45.0 },
        { latitudeDeg: -40.0, longitudeDeg: 110.0 },
        { latitudeDeg: 60.0, longitudeDeg: -75.0 },
        { latitudeDeg: -65.0, longitudeDeg: -150.0 },
        { latitudeDeg: 20.0, longitudeDeg: 170.0 },
    ];

    private engine: Engine;
    private scene: Scene;

    private camera: Camera;
    private gui: Gui;

    private receiver: Receiver;
    private satellites: Satellite[] = [];
    private draggedSatellite: Satellite | null = null;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new Engine(canvas);
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        this.scene = createScene(this.engine);

        this.camera = new Camera(this.scene, this.canvas);
        this.gui = new Gui(this.camera, this.scene);

        this.receiver = new Receiver(this.scene);
        this.satellites = AppOne.initialSatellitePositions.map(
            ({ latitudeDeg, longitudeDeg }) =>
                new Satellite(
                    this.scene,
                    this.receiver,
                    latitudeDeg,
                    longitudeDeg,
                ),
        );

        this.scene.onPointerDown = () => {
            const satellite = this.pickSatellite();
            if (satellite === null) {
                return;
            }

            this.draggedSatellite = satellite;
            this.camera.setControlsEnabled(false);
            this.draggedSatellite.moveToRay(
                this.camera.getMouseRay(this.scene),
                this.camera.is2D,
            );
        };

        this.scene.onPointerMove = () => {
            if (this.draggedSatellite === null) {
                return;
            }

            this.draggedSatellite.moveToRay(
                this.camera.getMouseRay(this.scene),
                this.camera.is2D,
            );
        };

        this.scene.onPointerUp = () => {
            if (this.draggedSatellite === null) {
                return;
            }

            this.draggedSatellite.moveToRay(
                this.camera.getMouseRay(this.scene),
                this.camera.is2D,
            );
            this.draggedSatellite = null;
            this.camera.setControlsEnabled(true);
        };
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

    private pickSatellite(): Satellite | null {
        const ray = this.camera.getMouseRay(this.scene);
        const hit = this.scene.pickWithRay(
            ray,
            (mesh: AbstractMesh) =>
                this.satellites.some((satellite) => satellite.isPickMesh(mesh)),
            true,
        );

        if (!hit?.pickedMesh) {
            return null;
        }

        return (
            this.satellites.find((satellite) =>
                satellite.isPickMesh(hit.pickedMesh),
            ) ?? null
        );
    }
}

function createScene(engine: Engine) {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);
    scene.useRightHandedSystem = true;
    scene.clearColor = new Color4(0, 0, 0, 1);

    // This creates a light, aiming 1,-1,-3
    new DirectionalLight("sun", new Vector3(1, -1, -3), scene);

    // Our built-in 'sphere' shape.
    const earth = MeshBuilder.CreateSphere(
        "earth",
        { diameter: Constants.earthDiameterMm, segments: 32 },
        scene,
    );
    earth.rotate(Axis.Y, Math.PI * 0.75, Space.LOCAL);

    const earthMaterial = new StandardMaterial("earthMaterial", scene);
    earthMaterial.specularColor = Color3.Black();
    earthMaterial.diffuseTexture = new Texture("./small-earth.jpg", scene, {
        invertY: false,
    });
    earth.material = earthMaterial;

    return scene;
}
