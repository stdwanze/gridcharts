import polka from 'polka';
import GridModel from './gridmodel.js';
import loadTimeSlice from './dataloader.js';
import getChart from './getChart.js';

const app = polka();
const gridModel = new GridModel(10);


var data1 = [{
"min": -1409,
"max": -1334,
"avg": -1381.5,
"start": "2025-09-06T16:23:48",
"end": "2025-09-06T16:24:33",
"endMinutesAgo": 8
},
{
"min": -1344,
"max": -1183,
"avg": -1276.2,
"start": "2025-09-06T16:24:38",
"end": "2025-09-06T16:25:23",
"endMinutesAgo": 7
},
{
"min": -1297,
"max": -1178,
"avg": -1234.5,
"start": "2025-09-06T16:25:28",
"end": "2025-09-06T16:26:13",
"endMinutesAgo": 6
},
{
"min": -1592,
"max": -1357,
"avg": -1521.9,
"start": "2025-09-06T16:26:18",
"end": "2025-09-06T16:27:03",
"endMinutesAgo": 6
},
{
"min": -1499,
"max": -1171,
"avg": -1370.7,
"start": "2025-09-06T16:27:08",
"end": "2025-09-06T16:27:53",
"endMinutesAgo": 5
},
{
"min": -1473,
"max": -1392,
"avg": -1429,
"start": "2025-09-06T16:27:58",
"end": "2025-09-06T16:28:43",
"endMinutesAgo": 4
},
{
"min": -1420,
"max": -1349,
"avg": -1398.9,
"start": "2025-09-06T16:28:48",
"end": "2025-09-06T16:29:33",
"endMinutesAgo": 3
},
{
"min": -1351,
"max": -1287,
"avg": -1324.8,
"start": "2025-09-06T16:29:38",
"end": "2025-09-06T16:30:24",
"endMinutesAgo": 2
},
{
"min": -1263,
"max": -1006,
"avg": -1108.5,
"start": "2025-09-06T16:30:29",
"end": "2025-09-06T16:31:14",
"endMinutesAgo": 1
},
{
"min": -1067,
"max": -972.1,
"avg": -1029.6,
"start": "2025-09-06T16:31:19",
"end": "2025-09-06T16:32:04",
"endMinutesAgo": 1
}]



// Ingest data every 5 seconds
async function ingestGridData() {
  try {
    const timeslice = await loadTimeSlice();
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
  const now = Date.now();
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
  const now = Date.now();
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
    let img =await getChart(data1);
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


app.listen(3001, err => {
  if (err) throw err;
  console.log('> Running on http://localhost:3001');
});