let sensors = [{ descr: { SN: 'Temper 8', port: 0 }, samples: [{ value: 25.5, date: Date.now() }] },
{ descr: { SN: 'Temper 8', port: 1 }, samples: [{ value: 18.2, date: Date.now() + 5056 }] },
{ descr: { SN: 'Temper Gold', port: 0 }, samples: [{ value: 25.5, date: Date.now() + 4088 }] }];

function setPage(name) {
    const page = document.getElementById('page');
    page.innerHTML = name;
}

setPage('Sensors');

function sensorName(descr): string {
    return descr.SN + ', port: ' + descr.port;
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

        const title = document.createElement('h3');
        title.innerHTML = sensorName(sensor.descr);
        article.appendChild(title);

        const sensorValue = document.createElement('div');
        sensorValue.innerHTML = 'No sensor data';
        sensorValue.id = sensorId(sensor.descr);
        article.appendChild(sensorValue);

        const section = document.getElementById('app');
        section.appendChild(article);
    }
    log(sensors);
}
let isMonitoring = false;
function setMonitoringButton() {
    const button = document.getElementById('monitor');
    if (isMonitoring) {
        button.innerHTML = 'Stop';
    } else {
        button.innerHTML = 'Monitor';
    }
}

function startMonitor(sensors) {
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
    isMonitoring = true;
    setMonitoringButton();
    for (const sensor of sensorData) {
        const log = document.getElementById(sensorId(sensor.descr));
        if (log) {
            const date = new Date(sensor.samples[0].date);
            const value = sensor.samples[0].value;
            log.innerHTML = value + ' °C, from: ' +
                date.toLocaleDateString() + ', ' + date.toLocaleTimeString();
        }

    }
    clearTimeout(logTimer);
    logTimer = setInterval(clearSensorValue, 5000);
}

function settings(allSettings) {
    // TODO
}

function setConnectionStatus(connected: boolean) {
    if (connected) {
        const status = document.getElementById('connection');
        status.innerHTML = ' (live)';
    } else {
        const status = document.getElementById('connection');
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
    if (event.wasClean) {
        alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        alert('[close] Connection died');
    }
};

socket.onerror = function(error) {
    setConnectionStatus(false);
    // alert(`[error] ${error.message}`);
};


function simulateMonitoring(sensors) {
    for (const sensor of sensors) {
        // simulate timestamp
        const date = new Date(Date.now() - Math.floor(Math.random() * 15000));
        sensor.samples[0].date = date.getMilliseconds();

        // simulate new sensor reading
        const value = sensor.samples[0].value + 5 * Math.random();
        sensor.samples[0].value = value;
    }
}


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
        if (Date.now() - sampleDate > 7*24*3600_000) {
            const sensorValue = document.getElementById(sensorId(sensor));
            sensorValue.innerHTML = 'No sensor data received last 15 seconds';
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
