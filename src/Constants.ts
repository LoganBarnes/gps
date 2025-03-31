export class Constants {
    static readonly earthDiameterMm = 12.756;
    static readonly earthRadiusMm = Constants.earthDiameterMm / 2.0;
    static readonly satelliteOrbitRadiusMm = 20.2;

    static readonly maxReceiverAltKm = 10.0;
    static readonly minReceiverAltKm = 0.0;

    static readonly receiverDiameterMm = 0.2;
    static readonly satelliteDiameterMm = 0.2;

    static megaFromKilo(km: number): number {
        return km * 0.001;
    }
    static kiloFromMega(m: number): number {
        return m * 1000.0;
    }
}
