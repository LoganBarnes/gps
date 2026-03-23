import {
    AbstractMesh,
    Color3,
    LinesMesh,
    Mesh,
    MeshBuilder,
    Ray,
    Scene,
    StandardMaterial,
    Tools,
    Vector3,
} from "@babylonjs/core";
import { Constants } from "./Constants";
import { Receiver } from "./Receiver";

export class Satellite {
    private static nextId = 0;
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
        latitudeDeg: number = 0.0,
        longitudeDeg: number = 0.0,
    ) {
        this.receiver = receiver;
        const satelliteId = Satellite.nextId++;

        // Our built-in 'sphere' shape.
        this.mesh = MeshBuilder.CreateSphere(
            `satellite-${satelliteId}`,
            { diameter: Constants.satelliteDiameterMm, segments: 16 },
            scene,
        );
        this.mesh.isPickable = true;

        this.material = new StandardMaterial(
            `satelliteMaterial-${satelliteId}`,
            scene,
        );
        this.material.specularColor = Color3.Black();
        this.material.diffuseColor = Color3.Black();
        this.material.emissiveColor = Color3.White();
        this.mesh.material = this.material;

        this.latitudeRads = Tools.ToRadians(latitudeDeg);
        this.longitudeRads = Tools.ToRadians(longitudeDeg);

        this.lines = MeshBuilder.CreateDashedLines(
            `satellite-lines-${satelliteId}`,
            {
                points: [this.mesh.position, this.receiver.position],
                dashSize: Satellite.lineDashSize,
                gapSize: Satellite.lineGapSize,
                dashNb: 1,
                updatable: true,
            },
        );

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

    public isPickMesh(mesh: AbstractMesh | null): boolean {
        return mesh === this.mesh;
    }

    public moveToRay(ray: Ray, constrainToXY: boolean = false): boolean {
        const nextPosition = constrainToXY
            ? Satellite.intersectXYPlane(ray)
            : Satellite.intersectOrbit(ray);
        if (nextPosition === null) {
            return false;
        }

        return this.setPosition(nextPosition);
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
        this.refreshLine();
    }

    private setPosition(position: Vector3): boolean {
        if (position.lengthSquared() === 0.0) {
            return false;
        }

        const orbitPoint = position
            .clone()
            .normalize()
            .scaleInPlace(Constants.satelliteOrbitRadiusMm);
        const radius = orbitPoint.length();

        this.latitudeRads = Math.atan2(orbitPoint.x, orbitPoint.y);
        this.longitudeRads = Math.asin(orbitPoint.z / radius);
        this.updatePosition();
        return true;
    }

    private refreshLine(): void {
        const length = Vector3.Distance(
            this.mesh.position,
            this.receiver.position,
        );
        const numDashes =
            length / (Satellite.lineDashSize + Satellite.lineGapSize);

        this.lines = MeshBuilder.CreateDashedLines("lines", {
            points: [this.mesh.position, this.receiver.position],
            dashSize: Satellite.lineDashSize,
            gapSize: Satellite.lineGapSize,
            dashNb: Math.max(1, Math.floor(numDashes)),
            updatable: true,
            instance: this.lines,
        });
    }

    private static intersectOrbit(ray: Ray): Vector3 | null {
        const radius = Constants.satelliteOrbitRadiusMm;
        const a = Vector3.Dot(ray.direction, ray.direction);
        const b = 2.0 * Vector3.Dot(ray.origin, ray.direction);
        const c = Vector3.Dot(ray.origin, ray.origin) - radius * radius;
        const discriminant = b * b - 4.0 * a * c;

        if (discriminant < 0.0) {
            return null;
        }

        const sqrtDiscriminant = Math.sqrt(discriminant);
        const nearDistance = (-b - sqrtDiscriminant) / (2.0 * a);
        const farDistance = (-b + sqrtDiscriminant) / (2.0 * a);
        const distance = [nearDistance, farDistance].find(
            (candidate) => candidate >= 0.0,
        );

        if (distance === undefined) {
            return null;
        }

        return ray.origin.add(ray.direction.scale(distance));
    }

    private static intersectXYPlane(ray: Ray): Vector3 | null {
        const point = ray.intersectsAxis("z", 0.0);
        if (point === null) {
            return null;
        }

        point.z = 0.0;
        return point;
    }
}
