
import Influx from 'influx'
import config from './config.js';

let powerPw = config().powerPw;

const influx = new Influx.InfluxDB({
  host: '192.168.1.55',
  port: 8086,                 // Standardport
  database: 'powerdata',    // deine Datenbank
  username: 'loggerPwr',           // optional
  password: powerPw,       // optional
})


function writePwrData(val, time) {
    influx.getDatabaseNames()
    .then(names => {
        if (!names.includes('powerdata')) {
        return influx.createDatabase('powerdata')
        }
    })
    .then(() => {
        console.log('Verbindung hergestellt & Datenbank bereit.')


        console.log(`Schreibe Datenpunkt: Wert=${val}, Zeit=${time.toISOString()}`);
        // Beispiel: Datenpunkt schreiben
        return influx.writePoints([
        {
            measurement: 'power',
            tags: { source: 'tasmota' },
            fields: { grid: val },
            timestamp: time
        }
        ])
    })
    .catch(err => {
        
        console.error('Fehler:', err)
    })
};

export default  writePwrData ;