"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fast_xml_parser_1 = require("fast-xml-parser");
const ftpHandler_1 = __importDefault(require("./ftpHandler"));
const utils_1 = require("./utils");
var States;
(function (States) {
    States[States["NSW"] = 0] = "NSW";
    States[States["QLD"] = 1] = "QLD";
    States[States["TAS"] = 2] = "TAS";
    States[States["VIC"] = 3] = "VIC";
    States[States["NT"] = 4] = "NT";
    States[States["WA"] = 5] = "WA";
    States[States["SA"] = 6] = "SA";
})(States = exports.States || (exports.States = {}));
const observationFile = (location) => {
    switch (location) {
        case States.NSW:
            return '/anon/gen/fwo/IDN60920.xml';
        case States.NT:
            return '/anon/gen/fwo/IDD60920.xml';
        case States.QLD:
            return '/anon/gen/fwo/IDQ60920.xml';
        case States.SA:
            return '/anon/gen/fwo/IDS60920.xml';
        case States.TAS:
            return '/anon/gen/fwo/IDT60920.xml';
        case States.VIC:
            return '/anon/gen/fwo/IDV60920.xml';
        case States.WA:
            return '/anon/gen/fwo/IDW60920.xml';
    }
    console.warn(`Warning: The enum with the value ${location} does not mach any forecast file, defaulting to the NSW (${States.NSW}) forecast file`);
    return observationFile(States.NSW);
};
const generateObservations = (stationData) => {
    const observations = {};
    stationData.period.level.element.forEach((element) => observations[element['@_type']] = element['#text']);
    const station = {
        wmo: stationData['@_wmo-id'],
        bomid: stationData['@_bom-id'],
        name: stationData['@_stn-name'],
        description: stationData['@_description'],
        time: new Date(stationData.period['@_time-utc']),
        loc: {
            lat: stationData['@_lat'],
            lon: stationData['@_lon'],
            elevation: stationData['@_stn-height']
        },
        apparentTemp: observations.apparent_temp,
        deltaT: observations.delta_t,
        airTemperature: observations.air_temperature,
        dewPoint: observations.dew_point,
        pressure: observations.pres,
        qnhPressure: observations.qnh_pres,
        rainfallHour: observations.rain_hour,
        rainfall10: observations.rainfall10,
        relHumidity: observations['rel-humidity'],
        windDir: observations.wind_dir,
        windDirDeg: observations.wind_dir_deg,
        windSpdKMH: observations.wind_spd_kmh,
        windSpdKnots: observations.wind_spd,
        rainfall_24hr: observations.rainfall_24hr,
        rainfall: observations.rainfall,
        maximumAirTemperature: observations.maximum_air_temperature,
        minimumAirTemperature: observations.minimum_air_temperature
    };
    return utils_1.objectFilter(station, (p) => typeof p === 'undefined');
};
const ftpHost = 'ftp.bom.gov.au';
const parserConfig = { ignoreAttributes: false };
exports.getObservationsWMO = async (id, state) => {
    const observationXMLFile = observationFile(state);
    const { product } = fast_xml_parser_1.parse(await ftpHandler_1.default(ftpHost, observationXMLFile), parserConfig);
    return generateObservations(product.observations.station.filter((s) => Number(s['@_wmo-id']) === id)[0]);
};
exports.getObservationsBOMID = async (id, state) => {
    const observationXMLFile = observationFile(state);
    const { product } = fast_xml_parser_1.parse(await ftpHandler_1.default(ftpHost, observationXMLFile), parserConfig);
    return generateObservations(product.observations.station.filter((s) => Number(s['@_bom-id']) === id)[0]);
};
