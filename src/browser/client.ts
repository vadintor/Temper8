let flag = false;
const sensors = [   {descr:{SN:'Temper 8', port: 0}},
                    {descr:{SN:'Temper 8', port: 1}},
                    {descr:{SN:'Temper Gold', port: 0}}];
let sensorData = [  {descr:{SN:'Temper 8', port: 0}, samples:[{value: 25.5, date:Date.now() }]},
                    {descr:{SN:'Temper 8', port: 1}, samples:[{value: 18.2, date:Date.now() + 5056}]},
                    {descr:{SN:'Temper Gold', port: 0}, samples:[{value: 25.5, date:Date.now() + 4088}]}];
let timer;
function message() {
    if (!flag) {
        flag = true;
        for (let sensor = 0; sensor < sensors.length; sensor++) {
            const article = document.createElement('article');
            const sensorName = sensors[sensor].descr.SN + ', port: '  + sensors[sensor].descr.port;
            const title = document.createElement('h2');
            title.innerHTML = sensorName;
            article.appendChild(title);
            const noSensorData = document.createElement('div');
            noSensorData.innerHTML = 'No sensor data';
            noSensorData.id = 'sensor-' + sensor;
            article.appendChild(noSensorData);
            const section = document.getElementById('sensors');
            section.appendChild(article);
        }
    } else {
        for (let sensor = 0; sensor < sensorData.length; sensor++) {
            const article = document.createElement('article');
            const sensorName = sensors[sensor].descr.SN + ', port: ' + sensors[sensor].descr.port;
            const title = document.createElement('h2');
            title.innerHTML = sensorName;
            article.appendChild(title);
            const sensorValue = document.getElementById('sensor-' + sensor);
            const date = new Date(Date.now() - Math.floor(Math.random() * 15000));
            const value = sensorData[sensor].samples[0].value + 5 * Math.random();
            sensorValue.innerHTML = value + ' °C, from: ' +
                        date.toLocaleDateString() + ', '  + date.toLocaleTimeString();
        }
        clearTimeout(timer);
        timer = setInterval(clearSensorValue, 5000);
    }
}

function clearSensorValue() {
    for (let sensor = 0; sensor < sensorData.length; sensor++) {
        const sampleDate = sensorData[sensor].samples[0].date;
        if (Date.now() - sampleDate > 30000) {
            const sensorValue = document.getElementById('sensor-' + sensor);
            sensorValue.innerHTML = 'No sensor data received last 30 seconds';
        }
    }
}

function round(value, precision) {
//    precision || (precision = 1);
    const inverse = 1.0 / precision;
    return Math.round(value * inverse) / inverse;
}
