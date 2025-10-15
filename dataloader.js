import TimeSlice from './timeslice.js';
import config from './config.js';



let url = config().counterUrl;



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