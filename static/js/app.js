// Find path to data file 'sample.json'
var samplesUrl = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'


d3.json(samplesUrl).then(function(data) {
    console.log(data)
    
    // Place the Dropdown
    var dropdown = d3.select("#selDataset");
    let names = data.names;

    // Setup the Dropdown selections
    for (let i = 0; i < names.length; i++) {
        dropdown
          .append("option")
          .text(names[i])
          .property("value", names[i]);
      };
    
    // Default Page
    demoBox(names[0])
    charts(names[0])
})


// Controller, adjusts page based on dropdown selection - referenced in index.html file
function optionChanged(id){
    demoBox(id)
    charts(id)
}


// Demographics Box
function demoBox(infoId){
    d3.json(samplesUrl).then(function(data){
        
        // Store metadata
        let metaData = data.metadata
        
        // Get the dict matching the sample id
        let sampleMetaDict = metaData.filter(sample => sample.id == infoId)[0]
        
        // Clear previous info in the box
        d3.select('#sample-metadata').text('');

        // Push the sample info into the html
        Object.entries(sampleMetaDict).forEach(([key, value]) => {
            d3.select('#sample-metadata').append('h4').text(`${key.toUpperCase()}: ${value}`);
        })
    })
}


// Plots all Charts
function charts(infoId) {
    d3.json(samplesUrl).then(function(data) {
        // Retrieve sample data for charts
        let bbbSampleData = data.samples
        
        // Filter on sample id and retrieve dict
        let bbbSampleDict = bbbSampleData.filter(sample => sample.id == infoId)[0];
        
        // Get the first 10 results
        let sample_valuesBar = bbbSampleDict.sample_values.slice(0,10).reverse()
        let otu_idsBar = bbbSampleDict.otu_ids.slice(0,10).reverse()

        // Plot the Bar Chart
        let trace = {
            x: sample_valuesBar,
            y: otu_idsBar.map(id => `OTU ${id}`),
            type: 'bar',
            orientation: 'h'
        };
        let layout = {
            title: "Top OTU's",
            height: 500,
            width: 800
        };
        
        Plotly.newPlot("bar", [trace], layout);

        // Bubbles Chart
        let samples_values = bbbSampleDict.sample_values
        let otu_ids = bbbSampleDict.otu_ids
        let otu_labels = bbbSampleDict.otu_labels

        // Plot the Bubble Chart
        trace = {
            x: otu_ids,
            y: samples_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: samples_values.map(data => 7 * Math.sqrt(data)),
                color: otu_ids
            }
        };
        layout = {
            title: `Microbiota Found in Subject ${infoId}`, 
            xaxis: {
                title: 'OTU ID'
            },
            yaxis: {
                title: 'Count of Bacteria Found'
            },
            height: 500,
            width: 1400
        };

        Plotly.newPlot("bubble", [trace], layout)
    })
}





