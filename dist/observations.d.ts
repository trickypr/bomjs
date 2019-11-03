export declare enum States {
    NSW = 0,
    QLD = 1,
    TAS = 2,
    VIC = 3,
    NT = 4,
    WA = 5,
    SA = 6
}
export interface IGlobalLocation {
    lat: number;
    lon: number;
    elevation?: number;
}
export interface IObservation {
    state?: States;
    wmo: number;
    bomid: number;
    name: string;
    description: string;
    time: Date;
    loc: IGlobalLocation;
    apparentTemp?: number;
    deltaT?: number;
    airTemperature?: number;
    dewPoint?: number;
    pressure?: number;
    qnhPressure?: number;
    relHumidity?: number;
    windDir?: string;
    windDirDeg?: number;
    windSpdKMH?: number;
    windSpdKnots?: number;
    rainfall?: number;
    rainfallHour?: number;
    rainfall10?: number;
    rainfall_24hr?: number;
    maximumAirTemperature?: number;
    minimumAirTemperature?: number;
}
export declare const getObservationsWMO: (id: number, state: States) => Promise<IObservation>;
export declare const getObservationsBOMID: (id: number, state: States) => Promise<IObservation>;
