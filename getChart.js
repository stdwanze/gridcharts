import ChartJSNodeCanvas  from 'chartjs-node-canvas';

const width = 400; // chart width
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
        backgroundColor: ['green']
        },
    {
        label: 'MIN',
        data: data ? data.map(item => item.max) : [],
        backgroundColor: ['red']
        },
        {
        label: 'MAX',
        data: data ? data.map(item => item.min) : [],
        backgroundColor: ['blue']
        }]
        
        
    }
    };


    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    return image;
}
export default getChart;
