import {
    Color3,
    LinesMesh,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Tools,
    Vector3,
} from "@babylonjs/core";
import { Constants } from "./Constants";
import { Receiver } from "./Receiver";

export class Satellite {
    private receiver: Receiver;

    private mesh: Mesh;
    private material: StandardMaterial;
    private latitudeRads: number;
    private longitudeRads: number;

    private lines: LinesMesh;
    private static readonly lineDashSize = 0.5;
    private static readonly lineGapSize = 0.5;

    constructor(
        readonly scene: Scene,
        receiver: Receiver,
    ) {
        this.receiver = receiver;

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

        this.lines = MeshBuilder.CreateDashedLines("lines", {
            points: [this.mesh.position, this.receiver.position],
            updatable: true,
        });

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

    public updatePosition(): void {
        const radius = Constants.satelliteOrbitRadiusMm;

        const cosLat = Math.cos(this.latitudeRads);
        const sinLat = Math.sin(this.latitudeRads);
        const cosLon = Math.cos(this.longitudeRads);
        const sinLon = Math.sin(this.longitudeRads);

        const x = radius * cosLon * sinLat;
        const y = radius * cosLon * cosLat;
        const z = radius * sinLon;

        this.mesh.position.set(x, y, z);

        const length = Vector3.Distance(
            this.mesh.position,
            this.receiver.position,
        );
        const numDashes =
            length / (Satellite.lineDashSize + Satellite.lineGapSize);

        console.log(`length: ${length}, numDashes: ${numDashes}`);

        this.lines = MeshBuilder.CreateDashedLines("lines", {
            points: [this.mesh.position, this.receiver.position],
            dashSize: Satellite.lineDashSize,
            gapSize: Satellite.lineGapSize,
            dashNb: Math.floor(numDashes),
            updatable: true,
        });
    }
}
