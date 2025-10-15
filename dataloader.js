import TimeSlice from './timeslice.js';
import config from './config.js';
import Influx from 'influx'


let url = config().counterUrl;
let powerPw = config().powerPw;


const influx = new Influx.InfluxDB({
  host: '192.168.1.55',
  port: 8086,                 // Standardport
  database: 'powerdata',    // deine Datenbank
  username: 'loggerPwr',           // optional
  password: powerPw,       // optional
})


async function loadTimeSlice() {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  // Assuming the JSON has { max, min, avg }
  return new TimeSlice({
    val: data.StatusSNS.E320.Power_in,
    time: data.StatusSNS.Time
  });
}

export default loadTimeSlice;