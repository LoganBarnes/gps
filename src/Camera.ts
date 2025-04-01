import { ArcRotateCamera, Scene, Vector3 } from "@babylonjs/core";
import { Constants } from "./Constants";

export class Camera {
    private readonly defaultCameraAlpha = Math.PI * 0.5;
    private readonly defaultCameraBeta = Math.PI * 0.5;
    private readonly defaultCameraRadius = 100.0;

    private threeDCameraAlpha = this.defaultCameraAlpha;
    private threeDCameraBeta = this.defaultCameraBeta;

    private camera: ArcRotateCamera;
    private previousCameraRadius = 0.0;

    private twoD: boolean = true;

    constructor(scene: Scene, canvas: HTMLCanvasElement) {
        // This creates and positions a free camera (non-mesh)
        this.camera = new ArcRotateCamera(
            "Camera",
            this.defaultCameraAlpha,
            this.defaultCameraBeta,
            this.defaultCameraRadius,
            new Vector3(0, 0, 0),
            scene,
        );
        this.camera.panningSensibility = this.camera.radius * 2.0;
        this.camera.wheelPrecision = 5.0;
        this.previousCameraRadius = this.camera.radius;

        // This attaches the camera to the canvas
        this.camera.attachControl(canvas, true);

        scene.registerBeforeRender(() => {
            if (this.twoD) {
                this.camera.alpha = this.defaultCameraAlpha;
                this.camera.beta = this.defaultCameraBeta;
                this.camera.target.z = 0.0;
            }

            this.camera.radius = Math.max(
                this.camera.radius,
                Constants.earthRadiusMm * 1.35,
            );
            this.camera.radius = Math.min(this.camera.radius, 500.0);

            if (this.previousCameraRadius != this.camera.radius) {
                const ratio = this.previousCameraRadius / this.camera.radius;
                this.previousCameraRadius = this.camera.radius;

                this.camera.panningSensibility *= ratio;
                this.camera.wheelPrecision *= ratio;
            }
        });
    }

    get is2D(): boolean {
        return this.twoD;
    }

    set is2D(twoD: boolean) {
        this.twoD = twoD;
    }
}
