import { Mesh, StandardMaterial, Tools, Vector3 } from "@babylonjs/core";

export class OrbitalMesh {
    private readonly internalMesh: Mesh;
    private readonly internalMaterial: StandardMaterial;
    private internalLatitudeRads: number;
    private internalLongitudeRads: number;
    private internalRadiusKm: number;

    constructor(
        mesh: Mesh,
        material: StandardMaterial,
        latitudeRads: number,
        longitudeRads: number,
        radiusKm: number,
    ) {
        this.internalMesh = mesh;
        this.internalMaterial = material;
        this.internalLatitudeRads = latitudeRads;
        this.internalLongitudeRads = longitudeRads;
        this.internalRadiusKm = radiusKm;

        this.mesh.material = this.material;
        this.updatePosition();
    }

    get mesh(): Mesh {
        return this.internalMesh;
    }

    get material(): StandardMaterial {
        return this.internalMaterial;
    }

    get latitudeRads(): number {
        return this.internalLatitudeRads;
    }

    get longitudeRads(): number {
        return this.internalLongitudeRads;
    }

    get latitudeDeg(): number {
        return Tools.ToDegrees(this.internalLatitudeRads);
    }

    get longitudeDeg(): number {
        return Tools.ToDegrees(this.internalLongitudeRads);
    }

    get altitudeKm(): number {
        return this.internalRadiusKm;
    }

    get position(): Vector3 {
        return this.mesh.position;
    }

    set latitudeRads(value: number) {
        this.internalLatitudeRads = value;
        this.updatePosition();
    }

    set longitudeRads(value: number) {
        this.internalLongitudeRads = value;
        this.updatePosition();
    }

    set latitudeDeg(value: number) {
        this.internalLatitudeRads = Tools.ToRadians(value);
        this.updatePosition();
    }
    set longitudeDeg(value: number) {
        this.internalLongitudeRads = Tools.ToRadians(value);
        this.updatePosition();
    }

    set altitudeKm(value: number) {
        this.internalRadiusKm = value;
        this.updatePosition();
    }

    private updatePosition(): void {
        const cosLat = Math.cos(this.internalLatitudeRads);
        const sinLat = Math.sin(this.internalLatitudeRads);
        const cosLon = Math.cos(this.internalLongitudeRads);
        const sinLon = Math.sin(this.internalLongitudeRads);

        const x = this.internalRadiusKm * cosLon * sinLat;
        const y = this.internalRadiusKm * cosLon * cosLat;
        const z = this.internalRadiusKm * sinLon;

        this.internalMesh.position.set(x, y, z);
    }
}
