import polka from 'polka';
import GridModel from './gridmodel.js';
import loadTimeSlice from './dataloader.js';

const app = polka();
const gridModel = new GridModel(10);



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


function condensedWithMinutesAgo(condensedValues) {
  const now = Date.now();
  return condensedValues.map(item => {
     const startMs = new Date(item.start).getTime();
    const endMs = new Date(item.end).getTime();
    let startMinutesAgo = Math.round((now - startMs) / 60000);
    let endMinutesAgo = Math.round((now - endMs) / 60000);

    if (startMinutesAgo > 60) startMinutesAgo -= 60;
    if (endMinutesAgo > 60) endMinutesAgo -= 60;

    return {
      ...item,
      startMinutesAgo,
      endMinutesAgo
    };
  });
}
app.get('/gridchart', (req, res) => {
  res.end('Gridchart endpoint');
});

// Returns the current model state as an array
app.get('/gridmodel', (req, res) => {
  const arr = gridModel.get5SecondValues();
  const condensedArr = gridModel.getCondensedValues();
  // Convert TimeSlice instances to plain objects for JSON
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ fiveseconds: arr, condensed: condensedWithMinutesAgo(condensedArr) }));
});

app.listen(3000, err => {
  if (err) throw err;
  console.log('> Running on http://localhost:3000');
});