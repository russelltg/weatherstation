const sensorTitles = {
    temp: {
        displayName: "Temperature",
        units: "\u00b0 C",
    },
    pressure: {
        displayName: "Pressure",
        units: "Bars", // TODO: is this the right pressure unit to use?
    }
};

function displayName(sensor: string) {
    if (sensorTitles[sensor] !== undefined) {
        return sensorTitles[sensor].displayName
    } else {
        return sensor;
    }
}

function units(sensor: string) {
    if (sensorTitles[sensor] !== undefined) {
        return `(${sensorTitles[sensor].units})`;
    } else {
        return '';
    }
}

export { displayName, units };