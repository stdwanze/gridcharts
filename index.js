import polka from 'polka';
import GridModel from './gridmodel.js';
import loadTimeSlice from './dataloader.js';
import getChart from './getChart.js';
import writePwrData from './influxapi.js';
const app = polka();
const gridModel = new GridModel(10);





// Ingest data every 5 seconds
async function ingestGridData() {
  try {
    const timeslice = await loadTimeSlice();
    writePwrData(timeslice.val, new Date(timeslice.time));
    gridModel.add(timeslice);
  } catch (err) {
    console.error('Error ingesting grid data:', err);
  }
}

// Crunsh data every 50 seconds
function crunshData() {
  gridModel.crunsh();
}
setInterval(ingestGridData, 5000);

setInterval(crunshData, 50000);

function fiveSecondsWithSecondsAgo(fiveSecondValues) {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return fiveSecondValues.map(item => {
    const timeMs = new Date(item.time).getTime();
    let secondsAgo = Math.round((now - timeMs) / 1000);
    if (secondsAgo >= 3600) secondsAgo -= 3600;
    return {
      ...item,
      secondsAgo
    };
  });
}

function condensedWithMinutesAgo(condensedValues) {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return condensedValues.map(item => {
     const startMs = new Date(item.start).getTime();
    const endMs = new Date(item.end).getTime();
    let startMinutesAgo = Math.round((now - startMs) / 60000);
    let endMinutesAgo = Math.round((now - endMs) / 60000);

    if (startMinutesAgo >= 60) startMinutesAgo -= 60;
    if (endMinutesAgo >= 60) endMinutesAgo -= 60;

    return {
      ...item,
      endMinutesAgo
    };
  });
}
app.get('/gridchart',async (req, res) => {
     const condensedArr = gridModel.getCondensedValues();
    let img =await getChart(condensedWithMinutesAgo(condensedArr));
  //  let img =await getChart(data1);
    res.setHeader('Content-Type', 'image/png');
    res.end(img, 'binary');
  //
});

// Returns the current model state as an array
app.get('/gridmodel', (req, res) => {
  const arr = gridModel.get5SecondValues();
  const condensedArr = gridModel.getCondensedValues();
  // Convert TimeSlice instances to plain objects for JSON
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ fiveseconds: fiveSecondsWithSecondsAgo(arr), condensed: condensedWithMinutesAgo(condensedArr) }));
});

app.get('/median30s', (req, res) => {
  const median = gridModel.getMedian30s();

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ median30s: median }));
});


app.listen(3001, err => {
  if (err) throw err;
  console.log('> Running on http://localhost:3001');
});