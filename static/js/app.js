// Find path to data file 'sample.json'
var samplesFilePath = '\samples.json'

// 
d3.json(samplesFilePath).then(function(data) {
    console.log(data);
}).catch(function(error) {
    // Handle errors if the JSON file couldn't be loaded
    console.error('Error loading JSON file:', error);
});