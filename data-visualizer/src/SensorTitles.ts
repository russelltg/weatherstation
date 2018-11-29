const sensorTitles = {
    temp: {
        displayName: "Temperature",
        units: "\u00b0 C",
    },
    humidity: {
        displayName: "Humidity",
        units: "%"
    },
    wind: {
        displayName: "Wind",
        units: "m/s"
    },
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