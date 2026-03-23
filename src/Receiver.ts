import { Color3, MeshBuilder, Scene, StandardMaterial } from "@babylonjs/core";
import { Constants } from "./Constants";
import { OrbitalMesh } from "./OrbitalMesh";

export class Receiver {
    private readonly orbitalMesh: OrbitalMesh;

    constructor(readonly scene: Scene) {
        this.orbitalMesh = new OrbitalMesh(
            // Our built-in 'sphere' shape.
            MeshBuilder.CreateSphere(
                "earth",
                { diameter: Constants.receiverDiameterMm, segments: 16 },
                scene,
            ),
            new StandardMaterial("receiverMaterial", scene),
            0.0,
            0.0,
            Constants.earthRadiusMm,
        );

        this.orbital.material.specularColor = Color3.Black();
        this.orbital.material.diffuseColor = Color3.Black();
        this.orbital.material.emissiveColor = Color3.Red();
    }

    get orbital(): OrbitalMesh {
        return this.orbitalMesh;
    }

    get altitudeKm(): number {
        return this.orbital.altitudeKm - Constants.earthRadiusMm;
    }

    set altitudeKm(value: number) {
        this.orbital.altitudeKm = Constants.earthRadiusMm + value;
    }
}
