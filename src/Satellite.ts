import * as BABYLON from "babylonjs";
import { Constants } from "./Constants";

export class Satellite {
    private mesh: BABYLON.Mesh;
    private material: BABYLON.StandardMaterial;
    private latitudeRads: number;
    private longitudeRads: number;

    constructor(readonly scene: BABYLON.Scene) {
        // Our built-in 'sphere' shape.
        this.mesh = BABYLON.MeshBuilder.CreateSphere(
            "earth",
            { diameter: Constants.satelliteDiameterMm, segments: 16 },
            scene,
        );

        this.material = new BABYLON.StandardMaterial("receiverMaterial", scene);
        this.material.specularColor = BABYLON.Color3.Black();
        this.material.diffuseColor = BABYLON.Color3.Black();
        this.material.emissiveColor = BABYLON.Color3.White();
        this.mesh.material = this.material;

        this.latitudeRads = 0.0;
        this.longitudeRads = 0.0;
        this.updatePosition();
    }

    get latitudeDeg(): number {
        return BABYLON.Tools.ToDegrees(this.latitudeRads);
    }
    get longitudeDeg(): number {
        return BABYLON.Tools.ToDegrees(this.longitudeRads);
    }

    set latitudeDeg(value: number) {
        this.latitudeRads = BABYLON.Tools.ToRadians(value);
        this.updatePosition();
    }
    set longitudeDeg(value: number) {
        this.longitudeRads = BABYLON.Tools.ToRadians(value);
        this.updatePosition();
    }

    private updatePosition() {
        const radius = Constants.satelliteOrbitRadiusMm;

        const cosLat = Math.cos(this.latitudeRads);
        const sinLat = Math.sin(this.latitudeRads);
        const cosLon = Math.cos(this.longitudeRads);
        const sinLon = Math.sin(this.longitudeRads);

        const x = radius * cosLon * sinLat;
        const y = radius * cosLon * cosLat;
        const z = radius * sinLon;

        this.mesh.position.set(x, y, z);
    }
}
