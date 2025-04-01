import {
    Color3,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Tools,
    Vector3,
} from "@babylonjs/core";
import { Constants } from "./Constants";

export class Receiver {
    private mesh: Mesh;
    private material: StandardMaterial;
    private latitudeRads: number;
    private longitudeRads: number;
    private altitudeMm: number;

    constructor(readonly scene: Scene) {
        // Our built-in 'sphere' shape.
        this.mesh = MeshBuilder.CreateSphere(
            "earth",
            { diameter: Constants.receiverDiameterMm, segments: 16 },
            scene,
        );

        this.material = new StandardMaterial("receiverMaterial", scene);
        this.material.specularColor = Color3.Black();
        this.material.diffuseColor = Color3.Black();
        this.material.emissiveColor = Color3.Red();
        this.mesh.material = this.material;

        this.latitudeRads = 0.0;
        this.longitudeRads = 0.0;
        this.altitudeMm = 0.0;
        this.updatePosition();
    }

    get latitudeDeg(): number {
        return Tools.ToDegrees(this.latitudeRads);
    }
    get longitudeDeg(): number {
        return Tools.ToDegrees(this.longitudeRads);
    }
    get altitudeKm(): number {
        return Constants.kiloFromMega(this.altitudeMm);
    }
    get position(): Vector3 {
        return this.mesh.position;
    }

    set latitudeDeg(value: number) {
        this.latitudeRads = Tools.ToRadians(value);
        this.updatePosition();
    }
    set longitudeDeg(value: number) {
        this.longitudeRads = Tools.ToRadians(value);
        this.updatePosition();
    }
    set altitudeKm(value: number) {
        this.altitudeMm = Constants.megaFromKilo(value);
        this.updatePosition();
    }

    private updatePosition() {
        const radius = Constants.earthRadiusMm + this.altitudeMm;

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
