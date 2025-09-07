import ChartJSNodeCanvas  from 'chartjs-node-canvas';

const width = 800; // chart width
const height = 400; // chart height
const chartJSNodeCanvas = new ChartJSNodeCanvas.ChartJSNodeCanvas({ width, height });




async function getChart(data) {

    const configuration = {
    type: 'line', // chart type
    data: {
    labels: data ? data.map(item => item.endMinutesAgo) : [],
    datasets: [{
        label: 'AVG',
        data: data ? data.map(item => item.avg) : [],
        backgroundColor: ['green'],
        borderWidth: 8,
        borderColor: 'rgb(0,0,0)',   // Farbe der Linie
       backgroundColor: 'rgb(0,0,0)', // Füllfarbe unter der Linie
        },
    {
        label: 'MIN',
        data: data ? data.map(item => item.max) : [],
        backgroundColor: ['red'],
        borderWidth: 6,
          borderColor: 'rgb(80, 80, 80)',   // Farbe der Linie
       backgroundColor: 'rgb(80, 80, 80)', // Füllfarbe unter der Linie
        },
        {
        label: 'MAX',
        data: data ? data.map(item => item.min) : [],
        backgroundColor: ['blue'],
         borderWidth: 6,
           borderColor: 'rgb(80, 80, 80)',   // Farbe der Linie
       backgroundColor: 'rgb(80, 80, 80)', // Füllfarbe unter der Linie
        }]
        
        
    },
    options: {
    scales: {
      x: {
        ticks: {
          font: {
            size: 22,        // Schriftgröße
            family: 'Arial', // Schriftart
            weight: 'bold'   // Schriftstil
          }
        
        }
      },
      y: {
        ticks: {
          font: {
            size: 22,
            family: 'Arial',
            weight: 'bold'
          },
        }
      }
    }
    }
    }


    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    return image;
}
export default getChart;
