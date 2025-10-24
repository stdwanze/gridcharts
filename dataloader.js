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

  let correctedDate = new Date(data.StatusSNS.Time);
  correctedDate.setHours(correctedDate.getHours() + 1);

  return new TimeSlice({
    val: data.StatusSNS.E320.Power_in,
    time: correctedDate.toISOString()
  });
}

export default loadTimeSlice;