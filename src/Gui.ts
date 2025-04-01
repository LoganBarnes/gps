import * as BABYLON from "babylonjs";
import * as GUI from "@babylonjs/gui";
import { Camera } from "./Camera";

export class Gui {
    private advancedTexture: GUI.AdvancedDynamicTexture;
    private twoDThreeDButton: GUI.Button;

    private camera: Camera;

    constructor(camera: Camera, scene: BABYLON.Scene) {
        this.camera = camera;

        // GUI
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
            "UI",
            true,
            scene,
        );
        this.advancedTexture.isForeground = true;

        this.twoDThreeDButton = GUI.Button.CreateSimpleButton(
            "2d3dButton",
            "2D",
        );
        this.twoDThreeDButton.width = "40px";
        this.twoDThreeDButton.height = "40px";
        this.twoDThreeDButton.color = "white";
        this.twoDThreeDButton.cornerRadius = 5;
        this.twoDThreeDButton.background = "green";
        this.twoDThreeDButton.paddingLeft = 5;
        this.twoDThreeDButton.paddingTop = 5;
        this.twoDThreeDButton.horizontalAlignment =
            GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.twoDThreeDButton.verticalAlignment =
            GUI.Control.VERTICAL_ALIGNMENT_TOP;

        this.twoDThreeDButton.onPointerUpObservable.add(() => {
            this.camera.is2D = !this.camera.is2D;
            if (this.twoDThreeDButton.textBlock) {
                this.twoDThreeDButton.textBlock.text = this.camera.is2D
                    ? "2D"
                    : "3D";
            }
        });
        this.advancedTexture.addControl(this.twoDThreeDButton);
    }
}
