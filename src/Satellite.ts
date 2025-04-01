import {
    Mesh,
    StandardMaterial,
    Scene,
    MeshBuilder,
    Color3,
    Tools,
} from "@babylonjs/core";
import { Constants } from "./Constants";

export class Satellite {
    private mesh: Mesh;
    private material: StandardMaterial;
    private latitudeRads: number;
    private longitudeRads: number;

    constructor(readonly scene: Scene) {
        // Our built-in 'sphere' shape.
        this.mesh = MeshBuilder.CreateSphere(
            "earth",
            { diameter: Constants.satelliteDiameterMm, segments: 16 },
            scene,
        );

        this.material = new StandardMaterial("receiverMaterial", scene);
        this.material.specularColor = Color3.Black();
        this.material.diffuseColor = Color3.Black();
        this.material.emissiveColor = Color3.White();
        this.mesh.material = this.material;

        this.latitudeRads = 0.0;
        this.longitudeRads = 0.0;
        this.updatePosition();
    }

    get latitudeDeg(): number {
        return Tools.ToDegrees(this.latitudeRads);
    }
    get longitudeDeg(): number {
        return Tools.ToDegrees(this.longitudeRads);
    }

    set latitudeDeg(value: number) {
        this.latitudeRads = Tools.ToRadians(value);
        this.updatePosition();
    }
    set longitudeDeg(value: number) {
        this.longitudeRads = Tools.ToRadians(value);
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
