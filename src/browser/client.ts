let sensors = [];

function setPage(name) {
    const page = document.getElementById('page');
    page.innerHTML = name;
}

setPage('Sensors');

function sensorName(descr): string {
    return descr.SN + ', port ' + descr.port;
}

function sensorId(descr): string {
    const sn = descr.SN.replace(' ', descr.SN);
    console.log(sn);
    const id = descr.SN.replace(' ', descr.SN) + '-' + descr.port;
    return id;
}

function listSensors(sensors) {
    for (const sensor of sensors) {
        const article = document.createElement('article');
        const heading = document.createElement('h3');

        heading.id = sensorId(sensor.descr) + '-value';
        article.appendChild(heading);

        const descr = document.createElement('p');
        descr.id = sensorId(sensor.descr);
        article.appendChild(descr);

        const section = document.getElementById('app');
        section.appendChild(article);
    }
    log(sensors);
}
let isMonitoring = false;
function setMonitoringButton() {
    const button = document.getElementById('monitor');
    if (isMonitoring) {
        button.innerHTML = 'Stop monitor';
    } else {
        button.innerHTML = 'Start Monitor';
    }
}

function startMonitor(sensors) {
    isMonitoring = true;
    setMonitoringButton();
    const descr = 'startMonitor';
    const data: any = [];
    for (const sensor of sensors) {
        data.push(sensor.descr);
    }
    socket.send(JSON.stringify({descr, data}));
}

function stopMonitor(sensors) {
    isMonitoring = false;
    setMonitoringButton();
    const descr = 'stopMonitor';
    const data: any = [];
    for (const sensor of sensors) {
        data.push(sensor.descr);
    }
    socket.send(JSON.stringify({descr, data}));
}
let logTimer;
function log(sensorData) {
    for (const sensor of sensorData) {
        const log = document.getElementById(sensorId(sensor.descr) + '-value');
        if (log) {
            const date = new Date(sensor.samples[0].date);
            const value = sensor.samples[0].value;
            log.innerHTML = value + ' °C';
        }
        const descr = document.getElementById(sensorId(sensor.descr));
        if (descr) {
            const date = new Date(sensor.samples[0].date);
            const value = sensor.samples[0].value;
            descr.innerHTML = 'by ' + sensorName(sensor.descr)  + ': ' +
                date.toLocaleDateString() + ', ' + date.toLocaleTimeString();
        }
        clearTimeout(logTimer);
        logTimer = setInterval(clearSensorValue, 5000);
    }
}

function settings(allSettings) {
    // TODO
}

function setConnectionStatus(connected: boolean) {
    const status = document.getElementById('connection');
    isMonitoring = connected && isMonitoring;
    setMonitoringButton();
    if (connected && isMonitoring) {
        status.innerHTML = ' (live)';
    } else if (connected) {
        status.innerHTML = ' (Connected)';
    } else {
        status.innerHTML = ' (Disconnected)';
    }
}

const url = 'ws://precision.vading.lan';
let socket = new WebSocket(url);
socket.onopen = function(e) {
    setConnectionStatus(true);
    socket.send(JSON.stringify({descr: 'getSensors'}));
    socket.send(JSON.stringify({descr: 'getSettings'}));
};

socket.onmessage = function(event) {
    setConnectionStatus(true);
    const msg = JSON.parse(event.data);
    switch(msg.descr) {
        case 'sensors':
            listSensors(msg.data);
            if (!isMonitoring) {
                startMonitor(sensors);
            }
            break;
        case 'settings':
            settings(msg.data);
            break;
        case 'log':
            log(msg.data);
            break;
      }
};

socket.onclose = function(event) {
    setConnectionStatus(false);
    clearTimeout(logTimer);
    logTimer = setInterval(clearSensorValue, 5000);
};

socket.onerror = function(error) {
    setConnectionStatus(false);
    clearTimeout(logTimer);
    logTimer = setInterval(clearSensorValue, 5000);
};

function monitor() {
    if (isMonitoring) {
        stopMonitor(sensors);

    } else {
        startMonitor(sensors);
    }
}

function clearSensorValue() {
    for (const sensor of sensors) {
        const sampleDate = sensor.samples[0].date;
        if (Date.now() - sampleDate > 60_000) {
            const sensorValue = document.getElementById(sensorId(sensor));
            sensorValue.innerHTML = 'No sensor data received last 60 seconds';
        }
    }

    setConnectionStatus(socket.readyState === socket.OPEN);
    if (socket.readyState === socket.CLOSED) {
        socket = new WebSocket(url);
    }
}

function round(value, precision) {
    //    precision || (precision = 1);
    const inverse = 1.0 / precision;
    return Math.round(value * inverse) / inverse;
}
